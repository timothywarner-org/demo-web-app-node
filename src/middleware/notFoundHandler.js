/**
 * Not Found Handler Middleware
 * Handles requests to undefined routes
 */

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: {
      root: '/',
      health: '/health',
      robots: '/api/v1/robots',
      robotById: '/api/v1/robots/:id',
      statistics: '/api/v1/robots/statistics',
      reset: '/api/v1/robots/reset'
    }
  });
};

module.exports = notFoundHandler;
