const ingestionService = require('../services/ingestion/IngestionService');
const healthTracker = require('../services/resilience/HealthTracker');

/**
 * POST /api/ingestion/run
 * Triggers the ingestion pipeline.
 */
const runIngestion = async (req, res, next) => {
  try {
    const result = await ingestionService.executeIngestion();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INGESTION_FAILED',
        message: error.message || 'Job ingestion pipeline failed.'
      }
    });
  }
};

/**
 * GET /api/ingestion/status
 * Returns current health and execution statistics for all ingested sources.
 */
const getIngestionStatus = async (req, res, next) => {
  try {
    const statuses = await healthTracker.getAllStatuses();
    res.json({
      success: true,
      data: statuses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  runIngestion,
  getIngestionStatus
};
