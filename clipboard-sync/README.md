# Clipboard Sync - Mac ↔ Z13

Sync clipboard between your Mac and ROG Z13 using the shared-context API.

## 🚀 Quick Start

### On Mac
```bash
# Make scripts executable (one-time setup)
chmod +x mac-push-clipboard.sh mac-pull-clipboard.sh

# Send Mac clipboard to Z13
./mac-push-clipboard.sh

# Get Z13 clipboard on Mac
./mac-pull-clipboard.sh
```

### On Z13 (Windows PowerShell)
```powershell
# Send Z13 clipboard to Mac
.\z13-push-clipboard.ps1

# Get Mac clipboard on Z13
.\z13-pull-clipboard.ps1
```

---

## 📋 Usage Examples

### Example 1: Copy from Z13 → Mac

**On Z13:**
1. Copy something (Ctrl+C)
2. Run: `.\z13-push-clipboard.ps1`

**On Mac:**
3. Run: `./mac-pull-clipboard.sh`
4. Paste normally (Cmd+V)

### Example 2: Copy from Mac → Z13

**On Mac:**
1. Copy something (Cmd+C)
2. Run: `./mac-push-clipboard.sh`

**On Z13:**
3. Run: `.\z13-pull-clipboard.ps1`
4. Paste normally (Ctrl+V)

---

## 🛠️ Setup Instructions

### Mac Setup

1. **Install jq** (if not already installed):
   ```bash
   brew install jq
   ```

2. **Make scripts executable**:
   ```bash
   cd clipboard-sync
   chmod +x *.sh
   ```

3. **Optional: Add aliases to ~/.zshrc**:
   ```bash
   # Clipboard sync aliases
   alias clip-push='~/projects/flowbridge/clipboard-sync/mac-push-clipboard.sh'
   alias clip-pull='~/projects/flowbridge/clipboard-sync/mac-pull-clipboard.sh'
   ```

   Then reload: `source ~/.zshrc`

   Now you can just run:
   ```bash
   clip-push  # Send Mac clipboard to Z13
   clip-pull  # Get Z13 clipboard on Mac
   ```

### Z13 Setup

1. **Open PowerShell as Administrator**

2. **Enable script execution** (one-time):
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Copy scripts to Z13**:
   - Transfer `z13-push-clipboard.ps1` and `z13-pull-clipboard.ps1` to Z13
   - Suggested location: `C:\Users\YourName\Scripts\clipboard-sync\`

4. **Optional: Create PowerShell aliases**:

   Edit your PowerShell profile:
   ```powershell
   notepad $PROFILE
   ```

   Add these lines:
   ```powershell
   # Clipboard sync functions
   function clip-push { & "C:\Users\YourName\Scripts\clipboard-sync\z13-push-clipboard.ps1" }
   function clip-pull { & "C:\Users\YourName\Scripts\clipboard-sync\z13-pull-clipboard.ps1" }
   ```

   Save and reload:
   ```powershell
   . $PROFILE
   ```

   Now you can just run:
   ```powershell
   clip-push  # Send Z13 clipboard to Mac
   clip-pull  # Get Mac clipboard on Z13
   ```

---

## 🤖 Claude Code Integration

When you say **"get clipboard"** or **"get Z13 clipboard"**, I can retrieve it using MCP tools!

I'll automatically:
1. Fetch from shared-context API
2. Show you what's in the clipboard
3. Ask if you want me to work with it

No need to paste manually!

---

## 🔧 How It Works

```
┌─────────┐                  ┌──────────────────┐                  ┌─────────┐
│   Mac   │◄────push/pull────►│  Shared Context  │◄────push/pull────►│   Z13   │
│         │                  │  (Vercel Edge)   │                  │         │
└─────────┘                  └──────────────────┘                  └─────────┘
                                     ▲
                                     │
                                     │ MCP Tools
                                     ▼
                             ┌──────────────┐
                             │ Claude Code  │
                             │  (on Mac)    │
                             └──────────────┘
```

**Storage Keys:**
- `z13-clipboard` - Z13 → Mac clipboard
- `mac-clipboard` - Mac → Z13 clipboard

**API Endpoint:**
- https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app

---

## 📊 Features

### ✨ What's Supported
- ✅ Text content (unlimited length)
- ✅ Code snippets
- ✅ URLs
- ✅ JSON/XML
- ✅ Markdown
- ✅ Any text data

### ⏰ Timing
- **Push**: Instant (<1 second)
- **Pull**: Instant (<1 second)
- **Storage**: Persists in Upstash Redis
- **TTL**: 24 hours (auto-expires)

### 🔒 Security
- ✅ HTTPS encrypted
- ✅ No authentication required (use for non-sensitive data)
- ⚠️ Don't sync passwords or API keys
- 💡 For sensitive data, use local network sharing instead

---

## 🐛 Troubleshooting

### Mac: "jq: command not found"
```bash
brew install jq
```

### Mac: "Permission denied"
```bash
chmod +x mac-push-clipboard.sh mac-pull-clipboard.sh
```

### Z13: "cannot be loaded because running scripts is disabled"
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "No clipboard data found"
- Make sure you ran the push script on the other machine first
- Check if clipboard was empty when you pushed
- Wait a few seconds and try again

### Network Issues
- Verify internet connection on both machines
- Test API: `curl https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app/health`

---

## 🎯 Pro Tips

1. **Workflow Integration**: Add to your deployment scripts
   ```bash
   # Copy deployment URL from Z13
   ./mac-pull-clipboard.sh
   # Now paste URL in browser
   ```

2. **Code Sharing**: Copy error messages from Z13 terminal
   ```powershell
   # On Z13 after error
   $error[0] | Out-String | Set-Clipboard
   .\z13-push-clipboard.ps1

   # On Mac, Claude can now analyze it!
   ./mac-pull-clipboard.sh
   ```

3. **Quick Notes**: Use as instant note sync
   ```bash
   # Mac: Copy TODO list
   ./mac-push-clipboard.sh

   # Z13: Open notepad and paste
   .\z13-pull-clipboard.ps1
   ```

---

## 🚀 Advanced Usage

### Watch Mode (Auto-Sync)

**Mac** (auto-push every 5 seconds when clipboard changes):
```bash
#!/bin/bash
last_clip=""
while true; do
    current_clip=$(pbpaste)
    if [ "$current_clip" != "$last_clip" ]; then
        ./mac-push-clipboard.sh
        last_clip="$current_clip"
    fi
    sleep 5
done
```

**Z13** (auto-push every 5 seconds when clipboard changes):
```powershell
$lastClip = ""
while ($true) {
    $currentClip = Get-Clipboard -Raw
    if ($currentClip -ne $lastClip) {
        .\z13-push-clipboard.ps1
        $lastClip = $currentClip
    }
    Start-Sleep -Seconds 5
}
```

---

## 🎉 That's It!

Now you can seamlessly share clipboard between Mac and Z13!

**Questions?** Just ask Claude Code: "get clipboard" or "what's in the Z13 clipboard?"
