const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobpulse',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  REQUEST_TIMEOUT_MS: parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 10000,
  REQUEST_DELAY_MS: parseInt(process.env.REQUEST_DELAY_MS, 10) || 1000,
  MAX_RETRIES: parseInt(process.env.MAX_RETRIES, 10) || 3,
  BACKOFF_BASE_MS: parseInt(process.env.BACKOFF_BASE_MS, 10) || 500,

  PRIMARY_SOURCE_URL: process.env.PRIMARY_SOURCE_URL || 'https://weworkremotely.com/categories/remote-programming-jobs.rss',
  FALLBACK_SOURCE_URL: process.env.FALLBACK_SOURCE_URL || 'https://hnrss.org/jobs'
};
