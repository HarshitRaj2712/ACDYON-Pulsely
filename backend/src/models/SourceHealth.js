const mongoose = require('mongoose');

const SourceHealthSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['healthy', 'degraded', 'failed'],
      default: 'healthy'
    },
    lastSuccessfulRun: {
      type: Date,
      default: null
    },
    lastFailure: {
      type: Date,
      default: null
    },
    consecutiveFailures: {
      type: Number,
      default: 0
    },
    totalRuns: {
      type: Number,
      default: 0
    },
    successfulRuns: {
      type: Number,
      default: 0
    },
    failedRuns: {
      type: Number,
      default: 0
    },
    lastError: {
      message: { type: String, default: null },
      code: { type: String, default: null },
      timestamp: { type: Date, default: null }
    },
    lastMetrics: {
      fetched: { type: Number, default: 0 },
      inserted: { type: Number, default: 0 },
      updated: { type: Number, default: 0 },
      duplicates: { type: Number, default: 0 },
      failed: { type: Number, default: 0 },
      durationMs: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SourceHealth', SourceHealthSchema);
