/**
 * FlowBridge - Main Entry Point
 *
 * Bridge your property communication channels with AI-powered automation
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const webhookRoutes = require('./routes/webhooks');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'FlowBridge',
    version: '0.1.0',
    status: 'running',
    description: 'AI-powered property communication automation',
    endpoints: {
      health: '/health',
      webhooks: '/webhooks/*',
      dashboard: '/dashboard'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Webhook routes (to be implemented)
app.use('/webhooks', webhookRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`<	 FlowBridge is running on port ${PORT}`);
  logger.info(`=Ê Health check: http://localhost:${PORT}/health`);
  logger.info(`=á Webhooks ready: http://localhost:${PORT}/webhooks`);
});

module.exports = app;
