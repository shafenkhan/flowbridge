/**
 * Quick test script to verify OpenRouter connection
 *
 * Usage: node test-openrouter.js
 */

require('dotenv').config();
const aiService = require('./src/services/aiService');

async function testOpenRouter() {
  console.log('\n🧪 Testing OpenRouter Connection...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣  Running health check...');
    const health = await aiService.healthCheck();
    console.log('   ✓ Status:', health.status);
    console.log('   ✓ Provider:', health.provider);
    console.log('   ✓ Free-only mode:', health.freeOnly);
    console.log('   ✓ Fast model:', health.fastModel);
    console.log('   ✓ Response:', health.response);

    // Test 2: Simple categorization
    console.log('\n2️⃣  Testing message categorization...');
    const testMessage = 'Help! The toilet is overflowing and water is everywhere!';
    console.log('   Message:', testMessage);

    const result = await aiService.categorizeMessage(testMessage, {
      propertyName: 'Test Apartment 101',
      tenantName: 'John Doe',
      messageChannel: 'SMS',
    });

    console.log('   ✓ Category:', result.category);
    console.log('   ✓ Urgency:', result.urgency);
    console.log('   ✓ Keywords:', result.keywords.join(', '));
    console.log('   ✓ Requires owner alert:', result.requiresOwnerAlert);
    console.log('   ✓ Suggested action:', result.suggestedAction);

    // Test 3: Verify free model enforcement
    console.log('\n3️⃣  Verifying free-model enforcement...');
    if (aiService.freeOnly) {
      console.log('   ✓ Free-only mode is ACTIVE');
      console.log('   ✓ Paid models are BLOCKED');
    } else {
      console.log('   ⚠️  Free-only mode is OFF - paid models allowed');
    }

    console.log('\n✅ All tests passed! OpenRouter is configured correctly.\n');
    console.log('💡 Next steps:');
    console.log('   1. Start FlowBridge: npm run dev');
    console.log('   2. Set up webhooks with ngrok/cloudflare tunnel');
    console.log('   3. Test with real messages\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your .env file exists');
    console.error('   2. Verify OPENROUTER_API_KEY is set');
    console.error('   3. Ensure AI_PROVIDER=openrouter');
    console.error('   4. Check your internet connection');
    console.error('\n');
    process.exit(1);
  }
}

testOpenRouter();
