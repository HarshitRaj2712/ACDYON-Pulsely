const Job = require('../models/Job');

/**
 * GET /api/jobs
 * List jobs with pagination, keyword search, and filters.
 */
const getJobs = async (req, res, next) => {
  try {
    const { page, limit, q, location, source, employmentType } = req.sanitizedQuery;
    const skip = (page - 1) * limit;

    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (source) {
      filter.source = source.toLowerCase();
    }

    if (employmentType) {
      filter.employmentType = { $regex: employmentType, $options: 'i' };
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ postedAt: -1, _id: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id
 * Retrieve single job by ID.
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: `Job with ID '${req.params.id}' was not found.`
        }
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'The requested job ID format is invalid.'
        }
      });
    }
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById
};
