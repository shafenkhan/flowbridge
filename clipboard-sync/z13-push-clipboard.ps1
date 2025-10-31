# Z13 → Shared Context Clipboard Push
# Save Z13 clipboard to shared context for Mac to retrieve

# Get clipboard content
$clipboardContent = Get-Clipboard -Raw

if ([string]::IsNullOrEmpty($clipboardContent)) {
    Write-Host "❌ Clipboard is empty"
    exit 1
}

# Your shared-context API endpoint
$apiUrl = "https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app/api/context"

# Prepare the payload
$body = @{
    key = "z13-clipboard"
    value = $clipboardContent
    machine = "Z13"
    timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json

# Send to shared context
try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"

    # Show preview (first 100 chars)
    $preview = if ($clipboardContent.Length -gt 100) {
        $clipboardContent.Substring(0, 100) + "..."
    } else {
        $clipboardContent
    }

    Write-Host "✅ Clipboard synced to shared context!"
    Write-Host ""
    Write-Host "Preview: $preview"
    Write-Host ""
    Write-Host "📊 Length: $($clipboardContent.Length) characters"
}
catch {
    Write-Host "❌ Failed to sync clipboard: $_"
    exit 1
}
