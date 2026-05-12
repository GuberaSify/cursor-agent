function validateSearchQuery(req, res, next) {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'The "query" parameter is required and must be a non-empty string.',
    });
  }

  if (query.length > 200) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'The "query" parameter must be 200 characters or fewer.',
    });
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const perPage = req.query.per_page ? Number(req.query.per_page) : 10;

  if (isNaN(page) || page < 1) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'The "page" parameter must be a positive integer.',
    });
  }

  if (isNaN(perPage) || perPage < 1 || perPage > 80) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'The "per_page" parameter must be between 1 and 80.',
    });
  }

  next();
}

module.exports = { validateSearchQuery };
