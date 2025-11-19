/**
 * Local Message Testing Script
 *
 * Tests FlowBridge by sending sample messages to the webhook
 * Make sure FlowBridge is running: npm run dev
 *
 * Usage: node test-messages.js
 */

const axios = require('axios');

const SERVER_URL = 'http://localhost:3002';

// Sample test messages representing different scenarios
const TEST_MESSAGES = [
  {
    name: 'Emergency - Water Leak',
    text: 'Help! The toilet is overflowing and water is everywhere! It\'s flooding the bathroom!',
    from: 'John Doe (+1234567890)',
    propertyName: 'Apartment 101',
    tenantName: 'John Doe',
    expectedCategory: 'emergency',
    expectedUrgency: 'critical',
  },
  {
    name: 'Maintenance - AC Not Working',
    text: 'Hi, the AC in the bedroom stopped working. It\'s getting pretty hot in here. Can someone take a look?',
    from: 'Jane Smith (+1234567891)',
    propertyName: 'Apartment 205',
    tenantName: 'Jane Smith',
    expectedCategory: 'maintenance',
    expectedUrgency: 'high',
  },
  {
    name: 'Payment - Rent Question',
    text: 'Quick question about next month\'s rent. Is it due on the 1st or can I pay on the 5th?',
    from: 'Bob Johnson (+1234567892)',
    propertyName: 'Apartment 310',
    tenantName: 'Bob Johnson',
    expectedCategory: 'payment',
    expectedUrgency: 'medium',
  },
  {
    name: 'Inquiry - Trash Day',
    text: 'When is trash pickup day? I forgot and want to make sure I put it out on time.',
    from: 'Sarah Wilson (+1234567893)',
    propertyName: 'Apartment 412',
    tenantName: 'Sarah Wilson',
    expectedCategory: 'inquiry',
    expectedUrgency: 'low',
  },
  {
    name: 'Emergency - Gas Smell',
    text: 'I smell gas in the kitchen! Should I call someone or evacuate?',
    from: 'Mike Brown (+1234567894)',
    propertyName: 'Apartment 508',
    tenantName: 'Mike Brown',
    expectedCategory: 'emergency',
    expectedUrgency: 'critical',
  },
  {
    name: 'Maintenance - Light Bulb',
    text: 'The light bulb in the hallway is out. Not urgent but wanted to let you know.',
    from: 'Lisa Garcia (+1234567895)',
    propertyName: 'Apartment 601',
    tenantName: 'Lisa Garcia',
    expectedCategory: 'maintenance',
    expectedUrgency: 'low',
  },
];

/**
 * Send a test message to FlowBridge
 */
async function sendTestMessage(message) {
  try {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📨 Testing: ${message.name}`);
    console.log(`${'='.repeat(70)}`);
    console.log(`📍 Property: ${message.propertyName}`);
    console.log(`👤 From: ${message.tenantName}`);
    console.log(`💬 Message: "${message.text}"`);
    console.log(`\n⏳ Sending to FlowBridge...`);

    const startTime = Date.now();

    const response = await axios.post(
      `${SERVER_URL}/webhooks/test`,
      {
        text: message.text,
        from: message.from,
        propertyName: message.propertyName,
        tenantName: message.tenantName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const duration = Date.now() - startTime;

    console.log(`✅ Response received in ${duration}ms\n`);

    const result = response.data.result;

    console.log(`🤖 AI Analysis:`);
    console.log(`   Category: ${result.category}`);
    console.log(`   Urgency: ${result.urgency}`);
    console.log(`   Keywords: ${result.keywords.join(', ')}`);
    console.log(`   Owner Alert Required: ${result.requiresOwnerAlert ? 'YES ⚠️' : 'NO'}`);
    console.log(`   Suggested Action: ${result.suggestedAction}`);

    // Verify expectations
    const categoryMatch = result.category.toLowerCase().includes(message.expectedCategory);
    const urgencyMatch = result.urgency.toLowerCase() === message.expectedUrgency;

    console.log(`\n📊 Accuracy Check:`);
    console.log(`   Category: ${categoryMatch ? '✅' : '❌'} (expected: ${message.expectedCategory})`);
    console.log(`   Urgency: ${urgencyMatch ? '✅' : '❌'} (expected: ${message.expectedUrgency})`);

    return {
      success: true,
      categoryMatch,
      urgencyMatch,
      duration,
    };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);

    if (error.code === 'ECONNREFUSED') {
      console.log(`\n💡 Tip: Make sure FlowBridge is running with: npm run dev`);
    }

    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Run all test messages
 */
async function runTests() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🧪 FlowBridge Local Message Testing`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Server: ${SERVER_URL}`);
  console.log(`Tests: ${TEST_MESSAGES.length} sample messages`);

  // Check if server is running
  try {
    await axios.get(`${SERVER_URL}/health`);
    console.log(`✅ FlowBridge is running\n`);
  } catch (error) {
    console.log(`\n❌ FlowBridge is not running!`);
    console.log(`\n💡 Start it with: npm run dev\n`);
    process.exit(1);
  }

  const results = [];

  // Run tests sequentially to avoid rate limiting
  for (const message of TEST_MESSAGES) {
    const result = await sendTestMessage(message);
    results.push(result);

    // Wait 2 seconds between tests to avoid rate limiting
    if (TEST_MESSAGES.indexOf(message) < TEST_MESSAGES.length - 1) {
      console.log(`\n⏸️  Waiting 2 seconds before next test...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 Test Summary`);
  console.log(`${'='.repeat(70)}`);

  const successful = results.filter((r) => r.success).length;
  const categoryAccuracy = results.filter((r) => r.categoryMatch).length;
  const urgencyAccuracy = results.filter((r) => r.urgencyMatch).length;
  const avgDuration = results
    .filter((r) => r.duration)
    .reduce((sum, r) => sum + r.duration, 0) / results.length;

  console.log(`Tests Run: ${TEST_MESSAGES.length}`);
  console.log(`Successful: ${successful}/${TEST_MESSAGES.length}`);
  console.log(`Category Accuracy: ${categoryAccuracy}/${TEST_MESSAGES.length} (${Math.round((categoryAccuracy / TEST_MESSAGES.length) * 100)}%)`);
  console.log(`Urgency Accuracy: ${urgencyAccuracy}/${TEST_MESSAGES.length} (${Math.round((urgencyAccuracy / TEST_MESSAGES.length) * 100)}%)`);
  console.log(`Average Response Time: ${Math.round(avgDuration)}ms`);

  console.log(`\n${'='.repeat(70)}\n`);

  if (successful === TEST_MESSAGES.length) {
    console.log(`✅ All tests passed! FlowBridge is working correctly.\n`);
  } else {
    console.log(`⚠️  Some tests failed. Check the logs above for details.\n`);
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
