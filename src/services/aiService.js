/**
 * AI Service - Handles all AI operations with OpenRouter (free tier only)
 *
 * Supports both OpenRouter and Ollama, with strict free-model enforcement
 */

const axios = require('axios');
const logger = require('../utils/logger');

// List of verified free models (as of 2025)
// See: https://openrouter.ai/models/?q=free
// Note: Free models can be rate-limited or unavailable - check OpenRouter for current status
const FREE_MODELS = [
  'mistralai/mistral-7b-instruct:free',  // ✅ Verified working
  'deepseek/deepseek-r1:free',           // May be rate-limited
  'google/gemini-2.0-flash-exp:free',    // May be rate-limited
  'meta-llama/llama-3.1-8b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
];

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'openrouter';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.freeOnly = process.env.OPENROUTER_FREE_ONLY === 'true';
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    // Model configuration
    this.fastModel = process.env.AI_MODEL_FAST || 'deepseek/deepseek-r1:free';
    this.qualityModel = process.env.AI_MODEL_QUALITY || 'google/gemini-2.0-flash-exp:free';

    // Validate free-only mode
    if (this.provider === 'openrouter' && this.freeOnly) {
      this.validateFreeModels();
    }

    logger.info(`AI Service initialized: provider=${this.provider}, freeOnly=${this.freeOnly}`);
  }

  /**
   * Validate that configured models are free
   * Throws error if paid models detected in free-only mode
   */
  validateFreeModels() {
    const models = [this.fastModel, this.qualityModel];

    for (const model of models) {
      if (!FREE_MODELS.includes(model)) {
        const error = `BLOCKED: Model "${model}" is not in the free tier list. Set OPENROUTER_FREE_ONLY=false to use paid models.`;
        logger.error(error);
        throw new Error(error);
      }
    }

    logger.info(` Free-only mode: All models validated as free tier`);
  }

  /**
   * Send a message to the AI and get a response
   *
   * @param {string} message - The message to send
   * @param {Object} options - Additional options
   * @param {boolean} options.useQualityModel - Use quality model instead of fast model
   * @param {number} options.maxTokens - Maximum tokens in response
   * @param {number} options.temperature - Response randomness (0-1)
   * @returns {Promise<string>} AI response
   */
  async chat(message, options = {}) {
    const {
      useQualityModel = false,
      maxTokens = 500,
      temperature = 0.3,
    } = options;

    const model = useQualityModel ? this.qualityModel : this.fastModel;

    try {
      if (this.provider === 'openrouter') {
        return await this.chatOpenRouter(message, model, { maxTokens, temperature });
      } else if (this.provider === 'ollama') {
        return await this.chatOllama(message, model, { maxTokens, temperature });
      } else {
        throw new Error(`Unknown AI provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error('AI chat error:', error.message);
      throw error;
    }
  }

  /**
   * OpenRouter chat implementation
   */
  async chatOpenRouter(message, model, options) {
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // Enforce free-only mode
    if (this.freeOnly && !FREE_MODELS.includes(model)) {
      throw new Error(`BLOCKED: Cannot use paid model "${model}" in free-only mode`);
    }

    logger.debug(`OpenRouter chat: model=${model}, length=${message.length}`);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: options.maxTokens,
        temperature: options.temperature,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/shafenkhan/flowbridge',
          'X-Title': 'FlowBridge',
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // Log usage for free tier monitoring
    const usage = response.data.usage;
    logger.debug(`OpenRouter usage: ${usage.prompt_tokens} prompt + ${usage.completion_tokens} completion = ${usage.total_tokens} tokens`);

    return content;
  }

  /**
   * Ollama chat implementation (for local AI)
   */
  async chatOllama(message, model, options) {
    logger.debug(`Ollama chat: model=${model}, length=${message.length}`);

    const response = await axios.post(
      `${this.ollamaUrl}/api/generate`,
      {
        model: model.replace(':free', ''), // Remove :free suffix for Ollama
        prompt: message,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }
    );

    return response.data.response;
  }

  /**
   * Categorize a message (emergency, maintenance, payment, inquiry)
   */
  async categorizeMessage(messageText, context = {}) {
    const prompt = `You are a property management assistant. Categorize this tenant message.

Message: "${messageText}"

Property context:
${context.propertyName ? `- Property: ${context.propertyName}` : ''}
${context.tenantName ? `- Tenant: ${context.tenantName}` : ''}
${context.messageChannel ? `- Channel: ${context.messageChannel}` : ''}

Respond in JSON format only:
{
  "category": "emergency|maintenance|payment|inquiry|other",
  "urgency": "critical|high|medium|low",
  "keywords": ["keyword1", "keyword2"],
  "suggestedAction": "brief action recommendation",
  "requiresOwnerAlert": true|false
}

Important:
- emergency: immediate danger (fire, flood, gas leak, break-in, medical)
- maintenance: repairs needed (broken appliance, leak, AC not working)
- payment: rent, deposits, fees
- inquiry: questions, requests for information
- critical urgency = owner must be notified immediately
- high urgency = needs response within 4 hours
- medium = respond within 24 hours
- low = respond within 2-3 days`;

    try {
      const response = await this.chat(prompt, { useQualityModel: false });

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) ||
                       response.match(/(\{[\s\S]*\})/);

      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }

      const result = JSON.parse(jsonMatch[1]);
      logger.info(`Message categorized: ${result.category} (${result.urgency})`);

      return result;
    } catch (error) {
      logger.error('Categorization error:', error.message);

      // Fallback categorization
      return {
        category: 'other',
        urgency: 'medium',
        keywords: [],
        suggestedAction: 'Manual review required',
        requiresOwnerAlert: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate a daily summary report from messages
   */
  async generateDailySummary(messages, date) {
    const prompt = `Generate a concise daily summary for property management communications.

Date: ${date}
Total messages: ${messages.length}

Messages:
${messages.map((msg, i) => `${i + 1}. [${msg.category}] ${msg.from}: ${msg.text.substring(0, 100)}...`).join('\n')}

Create a professional summary including:
1. Key highlights (2-3 sentences)
2. Urgent items requiring attention
3. Maintenance requests summary
4. Payment-related items
5. General inquiries

Format as a brief email-ready report (200-300 words max).`;

    try {
      const summary = await this.chat(prompt, {
        useQualityModel: true,
        maxTokens: 800,
      });

      logger.info(`Daily summary generated: ${summary.length} characters`);
      return summary;
    } catch (error) {
      logger.error('Summary generation error:', error.message);
      throw error;
    }
  }

  /**
   * Check if AI service is available
   */
  async healthCheck() {
    try {
      const testResponse = await this.chat('Respond with just "OK"', {
        useQualityModel: false,
        maxTokens: 10,
      });

      return {
        status: 'healthy',
        provider: this.provider,
        freeOnly: this.freeOnly,
        fastModel: this.fastModel,
        response: testResponse.substring(0, 50),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        provider: this.provider,
        error: error.message,
      };
    }
  }
}

// Export singleton instance
module.exports = new AIService();
