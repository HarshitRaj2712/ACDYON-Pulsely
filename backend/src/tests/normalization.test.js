const jobNormalizer = require('../services/normalization/JobNormalizer');

describe('JobNormalizer Service', () => {
  test('strips HTML tags cleanly from descriptions', () => {
    const htmlSnippet = '<p>We are hiring a <strong>Senior Engineer</strong> with <a href="#">React</a> skills!</p>';
    const cleaned = jobNormalizer.stripHtml(htmlSnippet);
    expect(cleaned).toBe('We are hiring a Senior Engineer with React skills!');
  });

  test('generates a deterministic SHA256 ID hash when sourceId is missing', () => {
    const hash1 = jobNormalizer.generateDeterministicId('weworkremotely', 'https://example.com/job/1');
    const hash2 = jobNormalizer.generateDeterministicId('weworkremotely', 'https://example.com/job/1');
    const hash3 = jobNormalizer.generateDeterministicId('weworkremotely', 'https://example.com/job/2');

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(16);
  });

  test('normalizes raw job payload into standardized schema', () => {
    const raw = {
      title: '  Lead Full Stack Developer ',
      company: '  Pulse Tech  ',
      location: '  Anywhere  ',
      description: '<div>Great role!</div>',
      url: 'https://example.com/job/lead',
      employmentType: 'Contract / Freelance'
    };

    const normalized = jobNormalizer.normalize(raw, 'test-source');

    expect(normalized.title).toBe('Lead Full Stack Developer');
    expect(normalized.company).toBe('Pulse Tech');
    expect(normalized.location).toBe('Remote');
    expect(normalized.description).toBe('Great role!');
    expect(normalized.source).toBe('test-source');
    expect(normalized.employmentType).toBe('Contract');
    expect(normalized.sourceId).toBeDefined();
  });

  test('throws error if mandatory fields are missing', () => {
    expect(() => {
      jobNormalizer.normalize({ company: 'Acme Inc', url: 'https://example.com' }, 'source');
    }).toThrow('Missing required field: title');

    expect(() => {
      jobNormalizer.normalize({ title: 'Dev', url: 'https://example.com' }, 'source');
    }).toThrow('Missing required field: company');

    expect(() => {
      jobNormalizer.normalize({ title: 'Dev', company: 'Acme Inc' }, 'source');
    }).toThrow('Missing required field: url');
  });
});
