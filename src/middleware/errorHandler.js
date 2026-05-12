function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
}

module.exports = { errorHandler };
