const axios = require('axios');
const env = require('../../config/env');

/**
 * Resilient HTTP Client with:
 * - Configurable Request Timeout (AbortController)
 * - Rate limiting / delay pacing
 * - Retry mechanism with Exponential Backoff + Jitter
 * - Transient vs Non-transient error classification
 */
class HttpClient {
  constructor() {
    this.defaultTimeout = env.REQUEST_TIMEOUT_MS;
    this.maxRetries = env.MAX_RETRIES;
    this.backoffBase = env.BACKOFF_BASE_MS;
    this.requestDelay = env.REQUEST_DELAY_MS;
    this.lastRequestTime = 0;
  }

  /**
   * Delays execution to respect configured rate limits (REQUEST_DELAY_MS).
   */
  async enforceRateLimit() {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.requestDelay) {
      const waitTime = this.requestDelay - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Determines if an error is transient and safe to retry.
   */
  isTransientError(error) {
    if (!error) return false;

    // Timeout or network connection abort
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET' || error.name === 'AbortError') {
      return true;
    }

    // HTTP 5xx Server Errors (Temporary outage / Gateway timeout)
    if (error.response && error.response.status >= 500 && error.response.status <= 599) {
      return true;
    }

    // HTTP 429 Too Many Requests (Rate limit hit)
    if (error.response && error.response.status === 429) {
      return true;
    }

    // 4xx client errors, 401/403 auth errors, etc. are NOT transient
    return false;
  }

  /**
   * Executes a GET request with timeout, rate limit pacing, and exponential backoff retry.
   */
  async get(url, options = {}) {
    let attempt = 0;
    const timeoutMs = options.timeout || this.defaultTimeout;

    while (attempt <= this.maxRetries) {
      try {
        await this.enforceRateLimit();

        const response = await axios.get(url, {
          timeout: timeoutMs,
          headers: {
            'User-Agent': 'JobPulse-Ingestion-Bot/1.0 (Public Authorized Listing Ingestion Platform)',
            ...options.headers
          },
          responseType: options.responseType || 'text',
          validateStatus: (status) => status >= 200 && status < 300
        });

        return response.data;
      } catch (error) {
        attempt++;

        const isTransient = this.isTransientError(error);
        const statusCode = error.response ? error.response.status : error.code;
        console.warn(`[HttpClient] GET ${url} attempt ${attempt}/${this.maxRetries + 1} failed (${statusCode}): ${error.message}`);

        // Stop retrying if not transient or max retries exceeded
        if (!isTransient || attempt > this.maxRetries) {
          error.attempts = attempt;
          error.isTransient = isTransient;
          throw error;
        }

        // Exponential backoff with jitter: base * 2^attempt + random(0..100)
        const backoffMs = this.backoffBase * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
        console.log(`[HttpClient] Backing off for ${backoffMs}ms before retry ${attempt}...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }
  }
}

module.exports = new HttpClient();
