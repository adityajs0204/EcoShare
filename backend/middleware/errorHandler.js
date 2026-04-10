/**
 * Middleware: errorHandler
 * Global error handler for Express.
 * Returns JSON error response with status code.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Error] ${err.message}`);
  res.status(statusCode).json({
    message: err.message,
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
