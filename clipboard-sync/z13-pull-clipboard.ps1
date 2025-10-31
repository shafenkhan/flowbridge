# Z13 ← Shared Context Clipboard Pull
# Retrieve Mac clipboard from shared context

$apiUrl = "https://shared-context-n3vow6dcz-genesisflowlabs.vercel.app/api/context/mac-clipboard"

try {
    # Fetch clipboard from shared context
    $response = Invoke-RestMethod -Uri $apiUrl -Method Get

    if ([string]::IsNullOrEmpty($response.value)) {
        Write-Host "❌ No clipboard data found in shared context"
        Write-Host "💡 Make sure Mac pushed clipboard first"
        exit 1
    }

    # Copy to Z13 clipboard
    Set-Clipboard -Value $response.value

    # Show preview
    $preview = if ($response.value.Length -gt 100) {
        $response.value.Substring(0, 100) + "..."
    } else {
        $response.value
    }

    Write-Host "✅ Mac clipboard retrieved and copied to Z13!"
    Write-Host ""
    Write-Host "Preview: $preview"
    Write-Host ""
    Write-Host "📊 Length: $($response.value.Length) characters"
    Write-Host "✨ Ready to paste on Z13!"
}
catch {
    Write-Host "❌ Failed to fetch clipboard: $_"
    exit 1
}
