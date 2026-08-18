const Job = require('../../models/Job');
const WeworkRemotelyAdapter = require('../adapters/WeworkRemotelyAdapter');
const MockJobAdapter = require('../adapters/MockJobAdapter');
const jobNormalizer = require('../normalization/JobNormalizer');
const healthTracker = require('../resilience/HealthTracker');

class IngestionService {
  constructor() {
    this.primaryAdapter = new WeworkRemotelyAdapter();
    this.fallbackAdapter = new MockJobAdapter();
  }

  /**
   * Deduplicates and saves/updates a normalized job record in MongoDB.
   * Uses compound index { source, sourceId } via Mongoose findOneAndUpdate with upsert.
   */
  async saveOrUpdateJob(normalizedJob) {
    const filter = {
      source: normalizedJob.source,
      sourceId: normalizedJob.sourceId
    };

    const existing = await Job.findOne(filter);
    if (existing) {
      // Check if job content actually changed
      const isUpdated =
        existing.title !== normalizedJob.title ||
        existing.company !== normalizedJob.company ||
        existing.location !== normalizedJob.location ||
        existing.description !== normalizedJob.description;

      if (isUpdated) {
        await Job.updateOne(filter, {
          $set: {
            title: normalizedJob.title,
            company: normalizedJob.company,
            location: normalizedJob.location,
            description: normalizedJob.description,
            url: normalizedJob.url,
            employmentType: normalizedJob.employmentType,
            postedAt: normalizedJob.postedAt,
            ingestedAt: new Date()
          }
        });
        return { status: 'updated' };
      }

      return { status: 'duplicate' };
    }

    // Insert new job record
    await Job.create(normalizedJob);
    return { status: 'inserted' };
  }

  /**
   * Runs the complete ingestion pipeline for a given adapter instance.
   */
  async runPipelineForAdapter(adapter) {
    const startTime = Date.now();
    const metrics = {
      source: adapter.name,
      fetched: 0,
      inserted: 0,
      updated: 0,
      duplicates: 0,
      failed: 0,
      durationMs: 0
    };

    console.log(`[IngestionPipeline] Starting ingestion run for source: ${adapter.name}...`);

    // Step 1: Fetch raw items via adapter
    const rawItems = await adapter.fetchJobs();
    metrics.fetched = Array.isArray(rawItems) ? rawItems.length : 0;

    if (metrics.fetched === 0) {
      console.warn(`[IngestionPipeline] Source ${adapter.name} returned 0 items.`);
    }

    // Step 2: Iterate items -> parse -> normalize -> validate -> deduplicate -> save
    for (const rawItem of rawItems) {
      try {
        const rawNormalized = adapter.normalizeJob(rawItem);
        const validJob = jobNormalizer.normalize(rawNormalized, adapter.name);

        const result = await this.saveOrUpdateJob(validJob);
        if (result.status === 'inserted') metrics.inserted++;
        else if (result.status === 'updated') metrics.updated++;
        else if (result.status === 'duplicate') metrics.duplicates++;
      } catch (err) {
        metrics.failed++;
        console.warn(`[IngestionPipeline] Skipped malformed record from ${adapter.name}: ${err.message}`);
      }
    }

    metrics.durationMs = Date.now() - startTime;
    console.log(`[IngestionPipeline] Completed run for ${adapter.name} in ${metrics.durationMs}ms`, metrics);

    await healthTracker.recordSuccess(adapter.name, metrics);
    return metrics;
  }

  /**
   * Main entry point to run ingestion. Attempts primary adapter first, falling back to secondary if primary fails.
   */
  async executeIngestion() {
    let primaryMetrics = null;

    try {
      primaryMetrics = await this.runPipelineForAdapter(this.primaryAdapter);
      return {
        usedFallback: false,
        metrics: primaryMetrics
      };
    } catch (primaryError) {
      console.error(`[IngestionPipeline] Primary adapter (${this.primaryAdapter.name}) failed: ${primaryError.message}`);
      await healthTracker.recordFailure(this.primaryAdapter.name, primaryError);

      console.log(`[IngestionPipeline] Initiating automatic fallback to secondary adapter (${this.fallbackAdapter.name})...`);
      try {
        const fallbackMetrics = await this.runPipelineForAdapter(this.fallbackAdapter);
        return {
          usedFallback: true,
          primaryError: primaryError.message,
          metrics: fallbackMetrics
        };
      } catch (fallbackError) {
        console.error(`[IngestionPipeline] Fallback adapter (${this.fallbackAdapter.name}) also failed: ${fallbackError.message}`);
        await healthTracker.recordFailure(this.fallbackAdapter.name, fallbackError);

        throw new Error(`Ingestion failed on both primary (${primaryError.message}) and fallback (${fallbackError.message}) sources.`);
      }
    }
  }
}

module.exports = new IngestionService();
