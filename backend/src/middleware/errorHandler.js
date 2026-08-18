const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred.',
      ...(env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    }
  });
};

module.exports = errorHandler;
