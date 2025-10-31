# Clipboard Sync - Quickstart

## 🚀 30-Second Setup

### On Mac (One-Time)
```bash
cd ~/projects/flowbridge/clipboard-sync
chmod +x *.sh

# Optional: Add aliases
echo 'alias clip-push="~/projects/flowbridge/clipboard-sync/mac-push-clipboard.sh"' >> ~/.zshrc
echo 'alias clip-pull="~/projects/flowbridge/clipboard-sync/mac-pull-clipboard.sh"' >> ~/.zshrc
source ~/.zshrc
```

### On Z13 (One-Time)
1. Copy `z13-push-clipboard.ps1` and `z13-pull-clipboard.ps1` to Z13
2. Open PowerShell as Admin:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

## 📋 Daily Usage

### Z13 → Mac
**On Z13:**
```powershell
# Copy something, then:
.\z13-push-clipboard.ps1
```

**On Mac:**
```bash
./mac-pull-clipboard.sh
# Or if you added alias:
clip-pull
```

### Mac → Z13
**On Mac:**
```bash
# Copy something, then:
./mac-push-clipboard.sh
# Or:
clip-push
```

**On Z13:**
```powershell
.\z13-pull-clipboard.ps1
```

## 🤖 With Claude Code

Just say:
- **"get clipboard"** - I'll fetch and show Z13 clipboard
- **"get clipboard and save as notes.md"** - I'll fetch and create file
- **"get clipboard and explain the error"** - I'll fetch and analyze

## ⚠️ Important Notes

1. **API Endpoint**: Scripts use `https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app`
   - If this URL is incorrect, update in all 4 script files
   - Check your shared-context-mcp deployment URL

2. **First Time**: Test with simple text first:
   ```
   Z13: Copy "Hello from Z13"
   Z13: Run push script
   Mac: Run pull script
   Mac: Paste - should see "Hello from Z13"
   ```

3. **Troubleshooting**: If it doesn't work:
   - Check internet connection
   - Verify API URL is correct
   - Check scripts have execute permissions (Mac)
   - Check PowerShell execution policy (Z13)

## 🎯 Next Steps

Read the full docs:
- `README.md` - Complete documentation
- `CLAUDE-INTEGRATION.md` - How Claude Code uses it

**That's it! Start syncing!** 🌉
