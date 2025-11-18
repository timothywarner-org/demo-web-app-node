/**
 * Globomantics Robotics API Application
 * Express app configuration and middleware setup
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const robotRoutes = require('./routes/robotRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// Security middleware - configured to allow static assets
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Logging middleware
if (config.env !== 'test') {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Globomantics Robotics API',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1/robots', robotRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Globomantics Robotics API',
    version: '1.0.0',
    endpoints: {
      dashboard: '/',
      health: '/health',
      robots: '/api/v1/robots',
      documentation: '/docs'
    }
  });
});

// Root endpoint - serves the dashboard
// Note: This is handled by express.static middleware
// If index.html is not found, it will fall through to notFoundHandler

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
