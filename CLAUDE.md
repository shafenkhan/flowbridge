# FlowBridge - AI Context & Project Notes

> **Project**: FlowBridge - AI-powered property management communication automation
> **Created**: 2025-10-31
> **Last Updated**: 2025-11-19
> **Status**: ✅ Core AI categorization working perfectly (MILESTONE!)
> **GitHub**: https://github.com/shafenkhan/flowbridge (PUBLIC repo)

---

## Quick Start

### Running Locally
```bash
cd /Users/shafenkhan/projects/flowbridge

# Install dependencies (first time only)
npm install

# Start FlowBridge server
npm run dev  # Runs on http://localhost:3002

# Test AI categorization
node test-messages.js        # Full test suite (6 scenarios)
node test-openrouter.js      # OpenRouter connection test
```

### Testing with curl
```bash
# Send a test message
curl -X POST http://localhost:3002/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The toilet is overflowing!",
    "from": "John Doe",
    "propertyName": "Apartment 101"
  }'
```

---

## Current Status (2025-11-19)

### ✅ What's Working
- **AI Provider**: OpenRouter (free tier, Mistral 7B)
- **Message Categorization**: emergency, maintenance, payment, inquiry
- **Urgency Detection**: critical, high, medium, low
- **Emergency Detection**: Flags messages requiring owner alerts
- **Keyword Extraction**: Identifies key terms in messages
- **Suggested Actions**: AI recommends next steps
- **Webhook Endpoints**: test, OpenPhone, Gmail, WhatsApp
- **Free-Model Enforcement**: Blocks paid models automatically
- **Test Coverage**: 6/6 tests passing, 100% accuracy

### 📊 Test Results
```
Tests Run: 6/6
Category Accuracy: 100% (6/6)
Urgency Accuracy: 100% (6/6)
Average Response Time: 1677ms
Cost: $0/month (free tier)
```

### 🔧 Configuration

**Environment Variables** (`.env`):
```bash
# AI Configuration
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-***  # Stored securely, gitignored
AI_MODEL_FAST=mistralai/mistral-7b-instruct:free
AI_MODEL_QUALITY=mistralai/mistral-7b-instruct:free
OPENROUTER_FREE_ONLY=true  # Prevents accidental paid API usage

# Server
PORT=3002
NODE_ENV=development

# Other services (TODO: configure as needed)
# OPENPHONE_API_KEY=
# GMAIL_CLIENT_ID=
# WHATSAPP_ACCESS_TOKEN=
# GOOGLE_SHEETS_SPREADSHEET_ID=
```

**API Keys & Accounts:**
- OpenRouter: $84 balance, using free models only
- Daily limit: 1,000 requests (with $10+ balance)
- Current usage: ~30 messages/day = 3% of quota

---

## Architecture

### Tech Stack
- **Backend**: Node.js + Express
- **AI**: OpenRouter (Mistral 7B free tier)
- **Logging**: Winston
- **Testing**: Jest + custom test scripts
- **Future**: WhatsApp Cloud API, Gmail API, Google Sheets API

### Project Structure
```
flowbridge/
├── src/
│   ├── index.js                 # Main Express server
│   ├── routes/
│   │   └── webhooks.js          # Webhook handlers (test, OpenPhone, Gmail, WhatsApp)
│   ├── services/
│   │   ├── aiService.js         # OpenRouter integration + free-model enforcement
│   │   ├── categorizer.js       # Message categorization logic
│   │   ├── sheetsLogger.js      # (TODO) Google Sheets integration
│   │   ├── router.js            # (TODO) Emergency routing logic
│   │   └── reportGenerator.js  # (TODO) Daily/weekly reports
│   └── utils/
│       └── logger.js            # Winston logger
├── tests/
│   └── aiService.test.js        # Unit tests
├── test-openrouter.js           # OpenRouter connection test
├── test-messages.js             # Full integration test suite
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Template with all config options
├── package.json
├── README.md                    # Public-facing documentation
├── NEXT-STEPS.md                # Launch checklist
└── CLAUDE.md                    # This file (AI context)
```

### Data Flow
```
Tenant Message (SMS/Email/WhatsApp)
  ↓
Webhook Endpoint (/webhooks/test, /openphone, /gmail, /whatsapp)
  ↓
categorizer.categorize(message)
  ↓
aiService.categorizeMessage(text) → OpenRouter (Mistral 7B)
  ↓
{
  category: 'emergency|maintenance|payment|inquiry',
  urgency: 'critical|high|medium|low',
  keywords: ['toilet', 'overflowing', ...],
  requiresOwnerAlert: true/false,
  suggestedAction: 'Contact plumber immediately...'
}
  ↓
(Future) → router.route(result) → WhatsApp alert / Sheets log / Report
  ↓
Response sent back to webhook caller
```

---

## AI Service Details

### Free Models List (aiService.js:13)
```javascript
const FREE_MODELS = [
  'mistralai/mistral-7b-instruct:free',  // ✅ Currently using
  'deepseek/deepseek-r1:free',           // May be rate-limited
  'google/gemini-2.0-flash-exp:free',    // May be rate-limited
  'meta-llama/llama-3.1-8b-instruct:free',
  'nousresearch/hermes-3-llama-3.1-405b:free',
];
```

### Key Functions
- `aiService.chat(message, options)` - Send message to AI
- `aiService.categorizeMessage(text, context)` - Categorize tenant message
- `aiService.generateDailySummary(messages, date)` - Create reports
- `aiService.healthCheck()` - Verify AI service is working
- `aiService.validateFreeModels()` - Enforce free-only mode

### Free-Only Enforcement
```javascript
// In .env:
OPENROUTER_FREE_ONLY=true

// Blocks this:
AI_MODEL_FAST=openai/gpt-4  // ❌ Throws error

// Allows this:
AI_MODEL_FAST=mistralai/mistral-7b-instruct:free  // ✅ Works
```

---

## Webhook Endpoints

### POST /webhooks/test
**Purpose**: Local testing endpoint
**Body**:
```json
{
  "text": "message content",
  "from": "sender identifier",
  "propertyName": "optional",
  "tenantName": "optional"
}
```

### POST /webhooks/openphone
**Purpose**: OpenPhone SMS webhook
**Docs**: https://www.openphone.com/docs/webhooks
**Status**: Handler ready, needs API key

### POST /webhooks/gmail
**Purpose**: Gmail push notifications
**Docs**: https://developers.google.com/gmail/api/guides/push
**Status**: Handler ready, needs OAuth setup

### POST /webhooks/whatsapp
**Purpose**: WhatsApp Cloud API webhook
**Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
**Status**: Handler ready, needs access token

### GET /webhooks/whatsapp
**Purpose**: WhatsApp webhook verification
**Required**: For initial WhatsApp setup

---

## Next Steps

### Immediate (Before Launch)
- [ ] **Create Demo Assets** (using Playwright MCP)
  - [ ] Screenshots of test results
  - [ ] Demo video (2-3 min) showing AI categorization
  - [ ] Update README.md with visuals
- [ ] **Commit Milestone** to GitHub
  - Current working state with OpenRouter integration
  - Test scripts and documentation

### Phase 1 Features (MVP)
- [ ] **WhatsApp Alerting** (for emergencies)
  - Integrate WhatsApp Cloud API
  - Send owner alerts when requiresOwnerAlert=true
  - Template: "🚨 EMERGENCY at {property}: {message}"
- [ ] **Google Sheets Logging**
  - Log every message to spreadsheet
  - Columns: timestamp, property, tenant, channel, category, urgency, text
  - Color-code by urgency
- [ ] **Daily Report Generation**
  - Use aiService.generateDailySummary()
  - Email to owner at 6pm daily
  - Summary of all messages + urgent items

### Phase 2 Features (Enhancement)
- [ ] **Deploy for Real Testing**
  - Vercel/Railway/fly.io deployment
  - Configure production webhooks
  - Test with real tenant messages
- [ ] **Sentiment Analysis**
  - Add tenant satisfaction tracking
  - Flag frustrated/angry tenants
- [ ] **Auto-Responses**
  - Simple questions → auto-reply
  - "Trash day is Tuesday" type responses

### Phase 3 (Scale)
- [ ] **Multi-Property Support**
  - Handle multiple properties per account
  - Property-specific configurations
- [ ] **Mobile Dashboard**
  - View all messages in one place
  - Real-time categorization updates
- [ ] **Predictive Maintenance**
  - Identify patterns (e.g., recurring AC issues)
  - Proactive alerts

---

## Known Issues & Limitations

### OpenRouter Free Tier
- **Rate Limits**: Some free models (DeepSeek R1, Gemini) frequently rate-limited
- **Solution**: Using Mistral 7B which is reliable
- **Fallback**: Can switch to paid models if needed (change OPENROUTER_FREE_ONLY=false)

### Current Gaps
- No persistent database (messages only processed, not stored)
- No WhatsApp sending yet (only receives)
- No Google Sheets integration yet
- No email sending for reports yet

### Testing Limitations
- Test suite uses mock data, not real webhooks
- Need ngrok/cloudflare tunnel for real webhook testing
- OpenRouter API calls are live (not mocked)

---

## Launch Plan (from NEXT-STEPS.md)

### Pre-Launch Checklist
1. ✅ Core AI working
2. [ ] Demo video created
3. [ ] Screenshots ready
4. [ ] Good first issues tagged on GitHub
5. [ ] Quick start tested by fresh user

### Launch Platforms
1. **Hacker News** - "Show HN: FlowBridge - Property management automation with local AI"
2. **Reddit** - r/PropertyManagement, r/selfhosted, r/LocalLLaMA, r/opensource
3. **Twitter/X** - With demo video
4. **Dev.to** - Blog post about building it

### Goals
- Month 1: 50 GitHub stars, 5 contributors
- Month 2-3: Featured by Ollama or OpenPhone
- Month 6: 500 stars, active community

---

## Development Workflow

### Making Changes
1. Make code changes
2. Test locally: `npm run dev` + `node test-messages.js`
3. Verify all tests still pass (6/6)
4. Commit with descriptive message
5. Push to GitHub

### Adding New Features
1. Update this CLAUDE.md with plan
2. Implement feature
3. Add tests
4. Update README.md if user-facing
5. Commit and push

### Debugging
- Server logs: Check terminal where `npm run dev` is running
- Detailed logs: Check Winston output
- AI errors: Check OpenRouter dashboard for quota/errors
- Test failures: Run `node test-messages.js` for detailed output

---

## Important Files Reference

### Documentation
- `README.md` - Public documentation, installation, usage
- `CLAUDE.md` - This file (AI context, internal notes)
- `NEXT-STEPS.md` - Launch checklist and growth strategy
- `CONTRIBUTING.md` - How to contribute
- `CODE_OF_CONDUCT.md` - Community guidelines

### Configuration
- `.env` - Environment variables (gitignored, local only)
- `.env.example` - Template with all config options (in git)
- `package.json` - Dependencies and scripts
- `.gitignore` - Files to exclude from git

### Code Entry Points
- `src/index.js` - Main server, starts Express on port 3002
- `src/routes/webhooks.js` - All webhook handlers
- `src/services/aiService.js` - AI integration logic

### Testing
- `test-messages.js` - Full integration test (6 scenarios)
- `test-openrouter.js` - OpenRouter connection test
- `tests/aiService.test.js` - Unit tests (Jest)

---

## Commands Cheat Sheet

```bash
# Development
npm run dev              # Start server with auto-reload
npm start                # Start server (production)
npm test                 # Run Jest unit tests
npm run lint             # Check code style
npm run lint:fix         # Auto-fix code style

# Testing
node test-messages.js    # Run full test suite
node test-openrouter.js  # Test OpenRouter connection

# Git
git status               # Check what's changed
git add .                # Stage all changes
git commit -m "message"  # Commit with message
git push                 # Push to GitHub

# Debugging
curl http://localhost:3002/health           # Health check
curl http://localhost:3002/webhooks/health  # Webhook status
```

---

## When You Come Back...

**To pick up where you left off:**

1. **Check CLAUDE-MAC.md** in `/Users/shafenkhan/gf-labs/CLAUDE-MAC.md`
   - See "Recent Activity" section for latest milestone

2. **Read this file** (`CLAUDE.md`) for FlowBridge-specific context

3. **Next immediate task**:
   - Restart Claude Code to load Playwright MCP
   - Create demo screenshots and video
   - Commit milestone to GitHub

4. **If you want to**:
   - Build new features: Check "Next Steps" section above
   - Test locally: `cd /Users/shafenkhan/projects/flowbridge && npm run dev`
   - Deploy: Review NEXT-STEPS.md for deployment options

---

## Philosophy & Design Decisions

### Why Free Tier Only (Initially)?
- **Test the concept** before paying for APIs
- **Zero monthly costs** = sustainable long-term
- **Prove value** first, then upgrade to better models
- **Open source ethos** - accessible to everyone

### Why OpenRouter?
- **Access to free models** (Mistral, DeepSeek, etc.)
- **No vendor lock-in** - can switch models easily
- **OpenAI-compatible API** - easy to swap providers
- **Good for testing** before committing to paid services

### Why Not Build Everything at Once?
- **Ship core value first** (AI categorization works!)
- **Iterate based on real usage** (don't build unused features)
- **Test assumptions** (do people actually need daily reports?)
- **Avoid over-engineering** (YAGNI - You Ain't Gonna Need It)

### Why Public Repo?
- **Build in public** - transparency and community
- **Marketing** - GitHub stars, contributors
- **Portfolio** - showcase real project
- **Help others** - many property managers have this problem

---

**Last Updated**: 2025-11-19 (Milestone: Core AI categorization working!)
