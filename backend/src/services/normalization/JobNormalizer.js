const crypto = require('crypto');

class JobNormalizer {
  /**
   * Cleans HTML markup from text snippet for clean presentation.
   */
  stripHtml(htmlStr) {
    if (!htmlStr) return '';
    return htmlStr
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Generates a deterministic fallback sourceId from source + url when sourceId is missing.
   */
  generateDeterministicId(source, url) {
    const rawKey = `${source}:${url}`;
    return crypto.createHash('sha256').update(rawKey).digest('hex').substring(0, 16);
  }

  /**
   * Validates and normalizes raw job items into strict Mongoose schema shape.
   */
  normalize(rawJob, sourceName) {
    if (!rawJob || typeof rawJob !== 'object') {
      throw new Error('Raw job payload must be a non-null object');
    }

    const title = (rawJob.title || '').trim();
    const company = (rawJob.company || '').trim();
    const url = (rawJob.url || '').trim();
    const source = (sourceName || rawJob.source || 'unknown').toLowerCase().trim();

    // Required fields validation
    if (!title) throw new Error('Missing required field: title');
    if (!company) throw new Error('Missing required field: company');
    if (!url) throw new Error('Missing required field: url');

    // Deterministic sourceId creation if missing or generic
    let sourceId = (rawJob.sourceId || '').trim();
    if (!sourceId || sourceId === 'undefined' || sourceId === 'null') {
      sourceId = this.generateDeterministicId(source, url);
    }

    // Location normalization
    let location = (rawJob.location || 'Remote').trim();
    if (!location || location.toLowerCase() === 'anywhere') {
      location = 'Remote';
    }

    // Date normalization
    let postedAt = new Date();
    if (rawJob.postedAt) {
      const parsedDate = new Date(rawJob.postedAt);
      if (!isNaN(parsedDate.getTime())) {
        postedAt = parsedDate;
      }
    }

    // Employment type normalization
    let employmentType = (rawJob.employmentType || 'Full-time').trim();
    const empLower = employmentType.toLowerCase();
    if (empLower.includes('part')) employmentType = 'Part-time';
    else if (empLower.includes('contract') || empLower.includes('freelance')) employmentType = 'Contract';
    else if (empLower.includes('intern')) employmentType = 'Internship';
    else employmentType = 'Full-time';

    const description = this.stripHtml(rawJob.description || '');

    return {
      title,
      company,
      location,
      description,
      url,
      source,
      sourceId,
      employmentType,
      postedAt,
      ingestedAt: new Date()
    };
  }
}

module.exports = new JobNormalizer();
