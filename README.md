# 🌉 FlowBridge

> **Bridge your property communication channels with AI-powered automation**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub Stars](https://img.shields.io/github/stars/yourusername/flowbridge?style=social)](https://github.com/yourusername/flowbridge)

**FlowBridge** is a free, open-source automation middleware that uses **local AI** to analyze, route, and log all your property management communications—without any monthly cloud costs.

[📖 Documentation](docs/) • [🚀 Quick Start](#-quick-start) • [💬 Community](https://github.com/yourusername/flowbridge/discussions) • [🐛 Report Bug](https://github.com/yourusername/flowbridge/issues)

---

## 🤔 What is FlowBridge? (Explain Like I'm 5)

Imagine you're a property manager with 50 apartments. Every day you get:
- 📱 Text messages from tenants
- 📧 Emails about maintenance
- 💬 WhatsApp messages from owners

Some messages are urgent ("TOILET OVERFLOWING!"), some aren't ("When is trash day?").

**The Problem**: You have to read every message, figure out what it's about, write it down in a spreadsheet, and decide who needs to know. This takes HOURS every day!

**FlowBridge to the Rescue!** 🦸‍♂️

FlowBridge is like having a super-smart assistant that:
1. **Reads** every message as soon as it arrives
2. **Understands** if it's an emergency, maintenance request, payment question, or just a question
3. **Alerts** the right people immediately (owner gets WhatsApp for emergencies!)
4. **Writes** everything down in Google Sheets automatically
5. **Creates** daily and weekly reports so you don't have to

**Best part?** The AI runs on YOUR computer (not in the cloud), so it's completely **FREE** and **PRIVATE**!

---

## ✨ Features

### 🤖 Smart AI Analysis
- **Categorizes** messages automatically (emergency, maintenance, payment, inquiry)
- **Detects urgency** (critical, high, medium, low)
- **Extracts keywords** (leak, repair, rent, etc.)
- **Understands context** (considers property history and tenant info)

### 🚨 Emergency Routing
- **Instant alerts** via WhatsApp when emergencies are detected
- **Smart detection** of keywords like "leak", "fire", "gas", "broken lock"
- **Context-aware** - knows the difference between "toilet broke" and "broke the lease"

### 📊 Automatic Logging
- **Real-time** logging to Google Sheets
- **Every message** from every channel in one place
- **Searchable** and filterable by date, property, category, urgency
- **Color-coded** for easy visual scanning

### 📈 Report Generation
- **Daily digests** emailed to owners at 6pm
- **Weekly summaries** created as Google Docs
- **Monthly analytics** with charts and insights
- **AI-written** summaries (no manual work!)

### 🔌 Multi-Channel Support
- **SMS/Phone** - OpenPhone integration
- **Email** - Gmail API integration
- **WhatsApp** - Meta Business Cloud API
- **More coming** - Slack, Discord, etc.

### 💰 Zero Cloud Costs
- **Local AI** running on your own hardware (Ollama)
- **No monthly fees** for AI processing
- **Privacy-first** - your data never leaves your control
- **Cost**: ~$2-5/month in electricity and WhatsApp messages

---

## 🏗️ How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     TENANT SENDS MESSAGE                        │
│                "Help! Toilet overflowing!"                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FLOWBRIDGE RECEIVES                           │
│              (via OpenPhone/Gmail webhook)                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL AI ANALYZES                            │
│   🧠 Category: Maintenance                                      │
│   🚨 Urgency: CRITICAL                                          │
│   🏷️ Tags: [toilet, emergency, water, plumbing]                │
│   💡 Action: Alert owner immediately                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
    ┌──────────────┐ ┌──────────┐ ┌─────────────┐
    │  WhatsApp    │ │  Google  │ │  Dashboard  │
    │  Alert to    │ │  Sheets  │ │  Update     │
    │  Owner       │ │  Log     │ │             │
    └──────────────┘ └──────────┘ └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ ([Download](https://nodejs.org))
- A computer with 8GB+ RAM (for local AI)
- OpenPhone, Gmail, and Google Cloud accounts (all free)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flowbridge.git
cd flowbridge

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Install Ollama (local AI)
# Mac: brew install ollama
# Windows: Download from ollama.ai
# Linux: curl https://ollama.ai/install.sh | sh

# Pull AI models
ollama pull llama3.1:8b

# Start FlowBridge
npm run dev
```

**That's it!** FlowBridge is now running at `http://localhost:3002`

📚 **Full setup guide**: [docs/SETUP.md](docs/SETUP.md)

---

## 📖 Documentation

- [**Setup Guide**](docs/SETUP.md) - Complete installation instructions
- [**Configuration**](docs/CONFIGURATION.md) - All configuration options
- [**API Reference**](docs/API.md) - Webhook endpoints and responses
- [**Deployment**](docs/DEPLOYMENT.md) - Production deployment guide
- [**Troubleshooting**](docs/TROUBLESHOOTING.md) - Common issues and fixes

---

## 🎯 Use Cases

### Property Managers
- Automatically categorize tenant messages
- Never miss an emergency maintenance request
- Generate reports for owners automatically
- Save 10+ hours per week on message management

### Landlords
- Get instant WhatsApp alerts for emergencies
- All communications logged in one Google Sheet
- Daily summaries without lifting a finger
- Know what's happening across all properties

### Real Estate Professionals
- Manage multiple properties efficiently
- Maintain communication history automatically
- Professional reporting for clients
- Scalable solution that grows with your portfolio

---

## 🤝 Contributing

We welcome contributions! Whether you're fixing bugs, adding features, or improving documentation, every contribution helps.

**Good first issues**: [Issues labeled "good first issue"](https://github.com/yourusername/flowbridge/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 🌟 Why Open Source?

We believe property management tools should be:
- **Accessible** - Free for everyone, not just those who can afford $200/month SaaS
- **Private** - Your tenant data should stay with you, not sold to third parties
- **Customizable** - Every property manager has different needs
- **Transparent** - Know exactly what the software does with your data

That's why FlowBridge is MIT licensed and runs entirely on your infrastructure.

---

## 💡 Inspiration

FlowBridge was born from real frustration: managing 50+ rental units meant drowning in messages across SMS, email, and WhatsApp. We needed something that:
- Didn't cost $100/month for AI
- Kept data private
- Actually worked reliably
- Could be customized

When we couldn't find it, we built it. Now we're sharing it with you.

---

## 📊 Roadmap

- [x] Core webhook processing
- [x] Local AI integration
- [x] Google Sheets logging
- [ ] WhatsApp emergency alerts (In Progress)
- [ ] Daily report generation (Coming Soon)
- [ ] Sentiment analysis (Planned Q1 2026)
- [ ] Multi-language support (Planned Q1 2026)
- [ ] Mobile dashboard app (Planned Q2 2026)

See [ROADMAP.md](ROADMAP.md) for detailed timeline.

---

## 🙏 Acknowledgments

- **Ollama** - For making local AI accessible and free
- **Meta** - For WhatsApp Cloud API
- **Google** - For Sheets/Docs APIs
- **OpenPhone** - For excellent webhook support
- **Open Source Community** - For the amazing tools we build upon

---

## 📄 License

MIT © 2025 FlowBridge Contributors

See [LICENSE](LICENSE) for full text.

---

## 💬 Community & Support

- **GitHub Discussions**: [Ask questions, share ideas](https://github.com/yourusername/flowbridge/discussions)
- **Issues**: [Report bugs, request features](https://github.com/yourusername/flowbridge/issues)
- **Discord**: [Join our community](https://discord.gg/flowbridge) (Coming Soon)

---

## ⭐ Star History

If FlowBridge helps you, give it a star! It helps others discover the project.

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/flowbridge&type=Date)](https://star-history.com/#yourusername/flowbridge&Date)

---

<div align="center">
  <sub>Built with ❤️ by property managers, for property managers</sub>
</div>
