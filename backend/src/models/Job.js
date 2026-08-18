const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true
    },
    location: {
      type: String,
      default: 'Remote',
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: [true, 'Job URL is required'],
      trim: true
    },
    source: {
      type: String,
      required: [true, 'Source identifier is required'],
      trim: true,
      index: true
    },
    sourceId: {
      type: String,
      required: [true, 'Source ID is required'],
      trim: true
    },
    employmentType: {
      type: String,
      default: 'Full-time',
      trim: true,
      index: true
    },
    postedAt: {
      type: Date,
      default: Date.now
    },
    ingestedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index for strict deduplication
JobSchema.index({ source: 1, sourceId: 1 }, { unique: true });

// Text index for fast search queries
JobSchema.index({ title: 'text', company: 'text', description: 'text' });

module.exports = mongoose.model('Job', JobSchema);
