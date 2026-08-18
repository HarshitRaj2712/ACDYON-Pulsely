const SourceHealth = require('../../models/SourceHealth');

class HealthTracker {
  /**
   * Retrieves or initializes the health status record for a given source.
   */
  async getStatus(sourceName) {
    let health = await SourceHealth.findOne({ source: sourceName });
    if (!health) {
      health = await SourceHealth.create({ source: sourceName, status: 'healthy' });
    }
    return health;
  }

  /**
   * Records a successful ingestion run for a source.
   */
  async recordSuccess(sourceName, metrics) {
    const health = await this.getStatus(sourceName);

    health.totalRuns += 1;
    health.successfulRuns += 1;
    health.consecutiveFailures = 0;
    health.lastSuccessfulRun = new Date();
    health.status = 'healthy';
    health.lastMetrics = {
      fetched: metrics.fetched || 0,
      inserted: metrics.inserted || 0,
      updated: metrics.updated || 0,
      duplicates: metrics.duplicates || 0,
      failed: metrics.failed || 0,
      durationMs: metrics.durationMs || 0
    };

    await health.save();
    return health;
  }

  /**
   * Records a failed ingestion run for a source and evaluates health state transitions.
   */
  async recordFailure(sourceName, error) {
    const health = await this.getStatus(sourceName);

    health.totalRuns += 1;
    health.failedRuns += 1;
    health.consecutiveFailures += 1;
    health.lastFailure = new Date();
    health.lastError = {
      message: error.message || 'Unknown ingestion error',
      code: error.code || error.name || 'INGESTION_ERROR',
      timestamp: new Date()
    };

    // Transition health status based on consecutive failures
    if (health.consecutiveFailures >= 3) {
      health.status = 'failed';
    } else if (health.consecutiveFailures >= 1) {
      health.status = 'degraded';
    }

    await health.save();
    return health;
  }

  /**
   * Retrieves all source health statuses.
   */
  async getAllStatuses() {
    return await SourceHealth.find().sort({ source: 1 });
  }
}

module.exports = new HealthTracker();
