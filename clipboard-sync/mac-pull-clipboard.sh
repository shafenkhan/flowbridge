#!/bin/bash
# Mac ← Shared Context Clipboard Pull
# Retrieve Z13 clipboard from shared context

API_URL="https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app/api/context/z13-clipboard"

# Fetch clipboard from shared context
response=$(curl -s "$API_URL")

# Check if successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to fetch clipboard from shared context"
    exit 1
fi

# Extract value from JSON response
clipboard=$(echo "$response" | jq -r '.value // empty')

if [ -z "$clipboard" ]; then
    echo "❌ No clipboard data found in shared context"
    echo "💡 Make sure you ran the Z13 push script first"
    exit 1
fi

# Copy to Mac clipboard
echo "$clipboard" | pbcopy

# Show preview
preview=$(echo "$clipboard" | head -c 100)
length=${#clipboard}

echo "✅ Z13 clipboard retrieved and copied to Mac!"
echo ""
echo "Preview: $preview..."
echo ""
echo "📊 Length: $length characters"
echo "✨ Ready to paste on Mac!"
