#!/bin/bash
# Mac → Shared Context Clipboard Push
# Save Mac clipboard to shared context for Z13 to retrieve

API_URL="https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app/api/context"

# Get clipboard content
clipboard=$(pbpaste)

if [ -z "$clipboard" ]; then
    echo "❌ Clipboard is empty"
    exit 1
fi

# Prepare JSON payload
timestamp=$(date "+%Y-%m-%d %H:%M:%S")
json_payload=$(jq -n \
    --arg key "mac-clipboard" \
    --arg value "$clipboard" \
    --arg machine "Mac" \
    --arg timestamp "$timestamp" \
    '{key: $key, value: $value, machine: $machine, timestamp: $timestamp}')

# Send to shared context
response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$json_payload")

if [ $? -ne 0 ]; then
    echo "❌ Failed to sync clipboard"
    exit 1
fi

# Show preview
preview=$(echo "$clipboard" | head -c 100)
length=${#clipboard}

echo "✅ Clipboard synced to shared context!"
echo ""
echo "Preview: $preview..."
echo ""
echo "📊 Length: $length characters"
echo "💡 Z13 can now retrieve it!"
