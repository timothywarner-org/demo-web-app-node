/**
 * Globomantics Robotics API Application
 * Express app configuration and middleware setup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const robotRoutes = require('./routes/robotRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// Security middleware
app.use(helmet());

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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Globomantics Robotics API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      robots: '/api/v1/robots',
      documentation: '/docs'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
