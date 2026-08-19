class MockJobAdapter {
  constructor() {
    this.name = 'mock-sandbox';
  }

  /**
   * Returns static sandbox sample jobs for offline/fallback ingestion.
   */
  async fetchJobs() {
    return [
      {
        title: 'Senior React Developer (Sandbox)',
        company: 'PulseLabs Mock',
        location: 'Remote (US/EU)',
        description: 'Build high-performance real-time analytics dashboards using React, Vite, and Tailwind CSS.',
        url: 'https://example.com/mock-jobs/1',
        sourceId: 'mock-sandbox-001',
        employmentType: 'Full-time',
        postedAt: new Date().toISOString()
      },
      {
        title: 'Backend Systems Engineer (Sandbox)',
        company: 'DataStream Core',
        location: 'Remote',
        description: 'Design resilient microservices, rate limiters, and automated fallback ingestion pipelines in Node.js.',
        url: 'https://example.com/mock-jobs/2',
        sourceId: 'mock-sandbox-002',
        employmentType: 'Full-time',
        postedAt: new Date().toISOString()
      },
      {
        title: 'DevOps & Infrastructure Architect (Sandbox)',
        company: 'CloudPulse Inc',
        location: 'Remote',
        description: 'Manage Kubernetes clusters, CI/CD automated deployments, and zero-downtime database migrations.',
        url: 'https://example.com/mock-jobs/3',
        sourceId: 'mock-sandbox-003',
        employmentType: 'Contract',
        postedAt: new Date().toISOString()
      },
      {
        title: 'AI Pipeline Specialist (Sandbox)',
        company: 'NeuralPulse AI',
        location: 'Remote (Worldwide)',
        description: 'Develop automated web scrapers, LLM normalizers, and self-healing ETL pipelines.',
        url: 'https://example.com/mock-jobs/4',
        sourceId: 'mock-sandbox-004',
        employmentType: 'Full-time',
        postedAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Normalizes raw mock item into standard adapter output shape.
   */
  normalizeJob(rawItem) {
    if (!rawItem || typeof rawItem !== 'object') {
      throw new Error('Raw item must be an object');
    }

    return {
      title: rawItem.title || 'Untitled Position',
      company: rawItem.company || 'Unknown',
      location: rawItem.location || 'Remote',
      description: rawItem.description || '',
      url: rawItem.url || '',
      sourceId: rawItem.sourceId || '',
      employmentType: rawItem.employmentType || 'Full-time',
      postedAt: rawItem.postedAt || new Date()
    };
  }
}

module.exports = MockJobAdapter;
