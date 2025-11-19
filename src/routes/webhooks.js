/**
 * Webhook Routes
 * Handle incoming webhooks from OpenPhone, Gmail, WhatsApp
 */

const express = require('express');
const router = express.Router();
const categorizer = require('../services/categorizer');
const logger = require('../utils/logger');

/**
 * Generic message handler
 * Processes message through AI categorization
 */
async function handleMessage(message, channel) {
  try {
    logger.info(`Received message via ${channel}: ${message.text.substring(0, 50)}...`);

    // Categorize the message using AI
    const result = await categorizer.categorize(
      {
        text: message.text,
        from: message.from,
        channel: channel,
      },
      {
        propertyName: message.propertyName,
        tenantName: message.tenantName,
      }
    );

    logger.info(`Categorized as: ${result.category} (${result.urgency})`);

    // Log the full result for testing
    logger.debug('Full categorization:', JSON.stringify(result, null, 2));

    return {
      success: true,
      result: {
        category: result.category,
        urgency: result.urgency,
        keywords: result.keywords,
        requiresOwnerAlert: result.requiresOwnerAlert,
        suggestedAction: result.suggestedAction,
      },
      message: 'Message processed successfully',
    };
  } catch (error) {
    logger.error(`Error processing ${channel} message:`, error.message);
    throw error;
  }
}

/**
 * Test webhook - For local testing
 * POST /webhooks/test
 * Body: { "text": "message text", "from": "sender", "propertyName": "optional", "tenantName": "optional" }
 */
router.post('/test', async (req, res) => {
  try {
    const { text, from, propertyName, tenantName } = req.body;

    if (!text || !from) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['text', 'from'],
      });
    }

    const result = await handleMessage(
      {
        text,
        from,
        propertyName,
        tenantName,
      },
      'test'
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message,
    });
  }
});

/**
 * OpenPhone webhook
 * POST /webhooks/openphone
 */
router.post('/openphone', async (req, res) => {
  try {
    logger.debug('OpenPhone webhook received:', JSON.stringify(req.body, null, 2));

    // Parse OpenPhone webhook format
    // Docs: https://www.openphone.com/docs/webhooks
    const { body: text, from, direction } = req.body;

    // Only process incoming messages
    if (direction !== 'incoming') {
      return res.status(200).json({ received: true, skipped: 'outgoing message' });
    }

    const result = await handleMessage(
      {
        text,
        from: from.phoneNumber,
      },
      'sms'
    );

    res.status(200).json(result);
  } catch (error) {
    logger.error('OpenPhone webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Gmail webhook
 * POST /webhooks/gmail
 */
router.post('/gmail', async (req, res) => {
  try {
    logger.debug('Gmail webhook received:', JSON.stringify(req.body, null, 2));

    // Parse Gmail push notification format
    // Docs: https://developers.google.com/gmail/api/guides/push
    const { emailAddress, historyId } = req.body.message?.data || {};

    // TODO: Implement Gmail message fetching via API
    // For now, accept direct message format for testing
    const { text, from, subject } = req.body;

    if (!text || !from) {
      return res.status(200).json({ received: true, note: 'Gmail webhook registered' });
    }

    const result = await handleMessage(
      {
        text: `${subject ? `Subject: ${subject}\n` : ''}${text}`,
        from,
      },
      'email'
    );

    res.status(200).json(result);
  } catch (error) {
    logger.error('Gmail webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * WhatsApp webhook (verification)
 * GET /webhooks/whatsapp
 */
router.get('/whatsapp', (req, res) => {
  // WhatsApp webhook verification
  // Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'flowbridge_verify';

  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    logger.warn('WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
});

/**
 * WhatsApp webhook (messages)
 * POST /webhooks/whatsapp
 */
router.post('/whatsapp', async (req, res) => {
  try {
    logger.debug('WhatsApp webhook received:', JSON.stringify(req.body, null, 2));

    // Parse WhatsApp Cloud API format
    // Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.status(200).json({ received: true, note: 'No message in payload' });
    }

    const { text: messageText, from } = message;
    const text = messageText?.body || 'No text content';

    const result = await handleMessage(
      {
        text,
        from,
      },
      'whatsapp'
    );

    res.status(200).json(result);
  } catch (error) {
    logger.error('WhatsApp webhook error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check for webhooks
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    endpoints: {
      test: 'POST /webhooks/test',
      openphone: 'POST /webhooks/openphone',
      gmail: 'POST /webhooks/gmail',
      whatsapp: 'POST /webhooks/whatsapp (GET for verification)',
    },
  });
});

module.exports = router;
