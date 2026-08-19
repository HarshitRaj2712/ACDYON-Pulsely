const Parser = require('rss-parser');
const httpClient = require('../resilience/HttpClient');
const env = require('../../config/env');

class WeworkRemotelyAdapter {
  constructor() {
    this.name = 'weworkremotely';
    this.parser = new Parser({
      customFields: {
        item: ['region']
      }
    });
  }

  /**
   * Fetches raw job items from WeWorkRemotely RSS feed using resilient HttpClient.
   * Throws an error if response body is empty or blank.
   */
  async fetchJobs() {
    const xmlText = await httpClient.get(env.PRIMARY_SOURCE_URL, { responseType: 'text' });

    if (!xmlText || typeof xmlText !== 'string' || xmlText.trim().length === 0) {
      throw new Error('Fetched RSS content is empty or blank from WeWorkRemotely feed.');
    }

    const feed = await this.parser.parseString(xmlText);
    const items = feed && Array.isArray(feed.items) ? feed.items : [];
    return items;
  }

  /**
   * Maps an RSS item from WeWorkRemotely into standardized raw job object shape.
   * Handles "Company: Job Title" title format splitting.
   */
  normalizeJob(rawItem) {
    if (!rawItem || typeof rawItem !== 'object') {
      throw new Error('Raw item must be an object');
    }

    let company = 'Unknown';
    let title = rawItem.title || '';

    if (title && title.includes(':')) {
      const colonIndex = title.indexOf(':');
      company = title.substring(0, colonIndex).trim();
      title = title.substring(colonIndex + 1).trim();
    }

    if (!company) company = 'Unknown';
    if (!title) title = rawItem.title || 'Untitled Position';

    const url = rawItem.link || rawItem.guid || '';
    const sourceId = rawItem.guid || rawItem.id || rawItem.link || url;
    const location = rawItem.region || (rawItem.categories && rawItem.categories.length > 0 ? rawItem.categories[0] : 'Remote');
    const description = rawItem.contentSnippet || rawItem.content || rawItem.description || '';
    const postedAt = rawItem.isoDate || rawItem.pubDate || new Date();

    let employmentType = 'Full-time';
    if (rawItem.categories && Array.isArray(rawItem.categories)) {
      const catStr = rawItem.categories.join(' ').toLowerCase();
      if (catStr.includes('part')) employmentType = 'Part-time';
      else if (catStr.includes('contract') || catStr.includes('freelance')) employmentType = 'Contract';
      else if (catStr.includes('intern')) employmentType = 'Internship';
    }

    return {
      title,
      company,
      location,
      description,
      url,
      sourceId,
      employmentType,
      postedAt
    };
  }
}

module.exports = WeworkRemotelyAdapter;
