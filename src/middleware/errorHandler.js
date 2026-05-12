function errorHandler(err, _req, res, _next) {
  console.error('Unhandled error:', err.message);

  if (err.response) {
    return res.status(err.response.status || 502).json({
      error: 'Upstream Error',
      message: err.response.data?.message || err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
}

module.exports = { errorHandler };
