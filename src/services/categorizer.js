/**
 * Categorizer Service - Categorizes incoming messages using AI
 */

const aiService = require('./aiService');
const logger = require('../utils/logger');

class Categorizer {
  /**
   * Categorize an incoming message
   *
   * @param {Object} message - Message object
   * @param {string} message.text - Message content
   * @param {string} message.from - Sender identifier
   * @param {string} message.channel - Communication channel (sms, email, whatsapp)
   * @param {Object} context - Additional context
   * @returns {Promise<Object>} Categorization result
   */
  async categorize(message, context = {}) {
    logger.debug(`Categorizing message from ${message.from} via ${message.channel}`);

    try {
      const result = await aiService.categorizeMessage(message.text, {
        messageChannel: message.channel,
        ...context,
      });

      return {
        ...result,
        originalMessage: message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Categorization failed:', error.message);
      throw error;
    }
  }

  /**
   * Batch categorize multiple messages
   */
  async categorizeBatch(messages, context = {}) {
    logger.info(`Batch categorizing ${messages.length} messages`);

    const results = await Promise.allSettled(
      messages.map(msg => this.categorize(msg, context))
    );

    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failed = results.filter(r => r.status === 'rejected');

    if (failed.length > 0) {
      logger.warn(`${failed.length} messages failed to categorize`);
    }

    return {
      successful,
      failed: failed.length,
      total: messages.length,
    };
  }
}

module.exports = new Categorizer();
