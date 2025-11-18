/**
 * Application Configuration
 * Loads environment variables and exports configuration object
 */

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  apiVersion: 'v1',

  // Pagination defaults
  pagination: {
    defaultLimit: 10,
    maxLimit: 100
  },

  // Feature flags
  features: {
    advancedDiagnostics: process.env.FEATURE_ADVANCED_DIAGNOSTICS === 'true',
    aiIntegration: process.env.FEATURE_AI_INTEGRATION === 'true'
  }
};

module.exports = config;
