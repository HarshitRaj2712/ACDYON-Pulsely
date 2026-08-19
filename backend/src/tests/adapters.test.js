const WeworkRemotelyAdapter = require('../services/adapters/WeworkRemotelyAdapter');
const MockJobAdapter = require('../services/adapters/MockJobAdapter');

describe('Adapters Unit Tests', () => {
  describe('WeworkRemotelyAdapter', () => {
    let adapter;

    beforeEach(() => {
      adapter = new WeworkRemotelyAdapter();
    });

    test('exposes name weworkremotely', () => {
      expect(adapter.name).toBe('weworkremotely');
    });

    test('normalizeJob splits title on colon into company and title', () => {
      const raw = {
        title: 'Acme Corp: Lead Full Stack Engineer',
        link: 'https://weworkremotely.com/jobs/123',
        guid: 'guid-123',
        isoDate: '2026-08-19T00:00:00.000Z',
        contentSnippet: 'Great tech stack',
        categories: ['Full-Time Programming']
      };

      const normalized = adapter.normalizeJob(raw);
      expect(normalized.company).toBe('Acme Corp');
      expect(normalized.title).toBe('Lead Full Stack Engineer');
      expect(normalized.url).toBe('https://weworkremotely.com/jobs/123');
      expect(normalized.sourceId).toBe('guid-123');
    });

    test('normalizeJob fallback when colon is not present in title', () => {
      const raw = {
        title: 'Senior DevOps Architect',
        link: 'https://weworkremotely.com/jobs/456',
        guid: 'guid-456'
      };

      const normalized = adapter.normalizeJob(raw);
      expect(normalized.company).toBe('Unknown');
      expect(normalized.title).toBe('Senior DevOps Architect');
    });
  });

  describe('MockJobAdapter', () => {
    let adapter;

    beforeEach(() => {
      adapter = new MockJobAdapter();
    });

    test('exposes name mock-sandbox', () => {
      expect(adapter.name).toBe('mock-sandbox');
    });

    test('fetchJobs returns a static array of mock jobs with unique sourceIds', async () => {
      const jobs = await adapter.fetchJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThanOrEqual(3);

      const ids = jobs.map((j) => j.sourceId);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(jobs.length);
    });

    test('normalizeJob maps job fields cleanly', () => {
      const raw = {
        title: 'Mock Job',
        company: 'Mock Inc',
        location: 'Remote',
        description: 'Test description',
        url: 'https://example.com',
        sourceId: 'mock-1',
        employmentType: 'Full-time',
        postedAt: new Date()
      };

      const normalized = adapter.normalizeJob(raw);
      expect(normalized.title).toBe('Mock Job');
      expect(normalized.company).toBe('Mock Inc');
      expect(normalized.sourceId).toBe('mock-1');
    });
  });
});
