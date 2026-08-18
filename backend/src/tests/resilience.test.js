const httpClient = require('../services/resilience/HttpClient');

describe('HttpClient Resilience Suite', () => {
  test('correctly identifies transient vs non-transient errors', () => {
    // Timeout error is transient
    const timeoutError = { code: 'ETIMEDOUT', message: 'Connection timed out' };
    expect(httpClient.isTransientError(timeoutError)).toBe(true);

    // 503 Service Unavailable is transient
    const serverError = { response: { status: 503 }, message: 'Service Unavailable' };
    expect(httpClient.isTransientError(serverError)).toBe(true);

    // 429 Rate Limited is transient
    const rateLimitError = { response: { status: 429 }, message: 'Too Many Requests' };
    expect(httpClient.isTransientError(rateLimitError)).toBe(true);

    // 404 Not Found is NOT transient
    const notFoundError = { response: { status: 404 }, message: 'Not Found' };
    expect(httpClient.isTransientError(notFoundError)).toBe(false);

    // 401 Unauthorized is NOT transient
    const authError = { response: { status: 401 }, message: 'Unauthorized' };
    expect(httpClient.isTransientError(authError)).toBe(false);
  });
});
