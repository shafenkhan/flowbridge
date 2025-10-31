# Claude Code Integration - "Get Clipboard"

When you say **"get clipboard"** or **"get Z13 clipboard"**, here's how it works:

## 🤖 For Claude Code

I have two ways to retrieve your Z13 clipboard:

### Method 1: Direct MCP Tool Access (Preferred)
Since you have `shared-context` MCP server configured, I can use:

```
Tool: ReadMcpResourceTool
Server: shared-context
URI: context://z13-clipboard
```

This gives me instant access to whatever Z13 pushed to shared context.

### Method 2: API Curl (Fallback)
```bash
curl -s [API_ENDPOINT]/api/context/z13-clipboard
```

## 📋 Usage Examples

### Example 1: "Get clipboard"
**You say:** "get clipboard"

**I do:**
1. Use ReadMcpResourceTool to fetch `z13-clipboard`
2. Show you the content
3. Ask: "What would you like me to do with this?"

### Example 2: "Get clipboard and create a file"
**You say:** "get the Z13 clipboard and save it as notes.md"

**I do:**
1. Fetch clipboard via MCP
2. Create `/Users/shafenkhan/projects/notes.md` with content
3. Confirm it's done

### Example 3: "Get clipboard and analyze"
**You say:** "get clipboard and tell me what this error means"

**I do:**
1. Fetch Z13 clipboard (probably an error message)
2. Analyze the error
3. Suggest fixes

## 🔄 Workflow

```
You (on Z13):
1. Copy something (Ctrl+C)
2. Run: z13-push-clipboard.ps1

You (talking to Claude on Mac):
3. Say: "get clipboard"

Claude:
4. Fetches via MCP tool
5. Shows content
6. Works with it per your request
```

## ⚡ Quick Commands

**Simple retrieval:**
- "get clipboard"
- "show me the Z13 clipboard"
- "what's in the clipboard?"

**With action:**
- "get clipboard and explain it"
- "get clipboard and create a file"
- "get clipboard and fix the errors"
- "get clipboard and commit it to git"

## 🎯 Pro Tips

**1. Error Analysis:**
```
Z13: Copy error from PowerShell → Run push script
Mac: "get clipboard and help me fix this error"
```

**2. Code Transfer:**
```
Z13: Copy function → Run push script
Mac: "get clipboard and add it to src/utils.js"
```

**3. URL Sharing:**
```
Z13: Copy deployment URL → Run push script
Mac: "get clipboard and open in browser"
```

**4. Notes Sync:**
```
Z13: Copy meeting notes → Run push script
Mac: "get clipboard and save as meeting-notes.md"
```

## 🔧 Technical Details

**Storage Location:**
- Key: `z13-clipboard` (Z13 → Mac)
- Key: `mac-clipboard` (Mac → Z13)
- TTL: 24 hours

**Content Types Supported:**
- Plain text ✅
- Code snippets ✅
- URLs ✅
- Error messages ✅
- JSON/XML ✅
- Markdown ✅

**Size Limits:**
- Upstash Redis: 100MB per value
- Practical limit: Keep under 10MB for best performance

## 🚀 Example Session

```
You: Just copied an error from Z13, get clipboard

Claude: I'll fetch that for you!
[Uses ReadMcpResourceTool]

Here's what's in the Z13 clipboard:

```
Error: Cannot find module 'express'
at Module._resolveFilename (internal/modules/cjs/loader.js:880:15)
...
```

This is a Node.js module error. The `express` package isn't installed.

Would you like me to:
1. Add it to package.json
2. Show you the npm install command
3. Check if there are other missing dependencies
```

---

**That's it!** Just say "get clipboard" anytime and I'll grab what Z13 has for you! 🎉
