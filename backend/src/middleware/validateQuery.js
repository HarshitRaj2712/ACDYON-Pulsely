const validateJobQuery = (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.limit, 10);

  req.sanitizedQuery = {
    page: isNaN(page) || page < 1 ? 1 : page,
    limit: isNaN(limit) || limit < 1 ? 20 : Math.min(limit, 100)
  };

  if (req.query.q && typeof req.query.q === 'string') {
    req.sanitizedQuery.q = req.query.q.trim();
  }

  if (req.query.location && typeof req.query.location === 'string') {
    req.sanitizedQuery.location = req.query.location.trim();
  }

  if (req.query.source && typeof req.query.source === 'string') {
    req.sanitizedQuery.source = req.query.source.trim();
  }

  if (req.query.employmentType && typeof req.query.employmentType === 'string') {
    req.sanitizedQuery.employmentType = req.query.employmentType.trim();
  }

  next();
};

module.exports = { validateJobQuery };
