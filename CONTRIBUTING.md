# Contributing to FlowBridge

First off, thanks for taking the time to contribute! 🎉

FlowBridge is a community project, and we welcome contributions from everyone—whether you're fixing a typo, adding a feature, or improving documentation.

## 🌟 How Can I Contribute?

### 1. Report Bugs 🐛

Found a bug? Please [open an issue](https://github.com/yourusername/flowbridge/issues/new?template=bug_report.md) with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node version, etc.)
- Screenshots if relevant

### 2. Suggest Features 💡

Have an idea? [Open a feature request](https://github.com/yourusername/flowbridge/issues/new?template=feature_request.md) with:
- Clear description of the feature
- Why it would be useful
- How you envision it working
- Optional: Mockups or examples

### 3. Improve Documentation 📚

Documentation is just as important as code! You can:
- Fix typos or unclear explanations
- Add examples
- Translate documentation
- Create tutorials or guides

### 4. Write Code 💻

Ready to code? Here's how:

1. **Find an issue** to work on:
   - [Good first issues](https://github.com/yourusername/flowbridge/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) - Great for beginners
   - [Help wanted](https://github.com/yourusername/flowbridge/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) - We'd love help here
   - Or propose your own feature

2. **Fork and clone**:
   ```bash
   git clone https://github.com/yourusername/flowbridge.git
   cd flowbridge
   npm install
   ```

3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

4. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

5. **Test your changes**:
   ```bash
   npm test
   npm run lint
   ```

6. **Commit with a clear message**:
   ```bash
   git commit -m "Add: Feature description"
   # or
   git commit -m "Fix: Bug description"
   ```

7. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub!

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows existing style
- [ ] Tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Documentation updated if needed
- [ ] Commit messages are clear

### PR Description Should Include

- **What** - What does this PR do?
- **Why** - Why is this change needed?
- **How** - How did you implement it?
- **Testing** - How did you test it?
- **Screenshots** - If UI changes

### Example Good PR Description

```markdown
## What
Adds sentiment analysis to message processing

## Why
Property managers want to track tenant satisfaction over time.
Closes #42

## How
- Added sentiment analysis function using AI
- Stores sentiment scores in database
- Updates dashboard to show sentiment trends

## Testing
- Unit tests for sentiment analyzer
- Manual testing with 50+ real messages
- All tests passing ✅

## Screenshots
[Dashboard showing sentiment chart]
```

## 🎨 Code Style

We use ESLint and Prettier for consistent formatting:

```bash
# Check style
npm run lint

# Auto-fix style issues
npm run lint:fix

# Format code
npm run format
```

### Key Conventions

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Yes, always
- **Naming**:
  - camelCase for functions and variables
  - PascalCase for classes
  - UPPERCASE for constants

## 🧪 Testing

We aim for high test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Writing Tests

```javascript
// tests/aiService.test.js
describe('AI Classification', () => {
  test('detects emergency correctly', async () => {
    const message = "HELP! Toilet overflowing!!";
    const result = await aiService.classify(message);

    expect(result.category).toBe('maintenance');
    expect(result.urgency).toBe('critical');
    expect(result.keywords).toContain('toilet');
  });
});
```

## 📚 Documentation

When adding features, please update:

- **README.md** - If user-facing changes
- **API docs** - If adding/changing endpoints
- **Code comments** - For complex logic
- **CHANGELOG.md** - Brief description of changes

## 🏷️ Issue Labels

We use labels to organize issues:

- **good first issue** - Great for newcomers
- **help wanted** - We'd love contributions here
- **bug** - Something isn't working
- **feature** - New feature request
- **documentation** - Documentation improvements
- **question** - Question about usage
- **enhancement** - Improvement to existing feature

## 🌍 Areas We Need Help

### High Priority
- [ ] Multi-language support (Spanish, Chinese, French)
- [ ] WhatsApp integration completion
- [ ] Mobile dashboard app
- [ ] Docker containerization

### Medium Priority
- [ ] Slack integration
- [ ] Discord integration
- [ ] Voice message processing
- [ ] Better error handling

### Always Welcome
- Documentation improvements
- Bug fixes
- Test coverage
- Performance optimizations
- Security improvements

## 💬 Communication

- **GitHub Issues** - For bugs and features
- **GitHub Discussions** - For questions and ideas
- **Pull Requests** - For code contributions
- **Discord** - For real-time chat (coming soon)

## 🎯 Commit Message Format

We follow conventional commits:

```
type(scope): subject

body

footer
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(ai): add sentiment analysis

Adds sentiment scoring to message analysis for tracking
tenant satisfaction over time.

Closes #42
```

```
fix(webhook): handle OpenPhone rate limits

Adds retry logic with exponential backoff when OpenPhone
API rate limits are hit.

Fixes #103
```

## ⚖️ Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

TL;DR: Be respectful, inclusive, and professional.

## 🎉 Recognition

Contributors are automatically added to:
- **README.md** - All contributors section
- **CHANGELOG.md** - Release notes
- **GitHub** - Contributors graph

Significant contributors may be invited to become maintainers!

## ❓ Questions?

Not sure about something? Don't hesitate to ask!

- Open a [GitHub Discussion](https://github.com/yourusername/flowbridge/discussions)
- Comment on the issue you're working on
- Tag maintainers in your PR

## 🙏 Thank You!

Every contribution matters—no matter how small. You're helping make property management easier for everyone.

**Happy coding!** 🌉
