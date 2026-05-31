# LearningHub Deploy Script
# Usage: .\deploy.ps1 "Commit message here"
# Or just: .\deploy.ps1 (uses default message with timestamp)

param(
    [string]$msg = ""
)

# Navigate to project folder
Set-Location -Path $PSScriptRoot

# If no message provided, generate one with timestamp
if ([string]::IsNullOrWhiteSpace($msg)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $msg = "Update site - $timestamp"
}

Write-Host "📦 Deploying LearningHub..." -ForegroundColor Cyan
Write-Host ""

# Check for changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to deploy." -ForegroundColor Green
    exit 0
}

# Show what changed
Write-Host "📝 Changes detected:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Stage, commit, push
Write-Host "🔄 Staging changes..." -ForegroundColor Cyan
git add -A

Write-Host "💾 Committing: $msg" -ForegroundColor Cyan
git commit -m "$msg"

# Abort if the commit itself failed (e.g. missing git identity, empty commit).
# Without this check the script would falsely report success on the push step below.
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Commit failed - nothing was deployed." -ForegroundColor Red
    Write-Host "   Likely cause: git identity not set in this repo. Fix with:" -ForegroundColor Yellow
    Write-Host "   git config user.email `"grlnvasile@gmail.com`"" -ForegroundColor Yellow
    Write-Host "   git config user.name `"Prof. Gurlan Vasile`"" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Pushing to remote..." -ForegroundColor Cyan
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deploy successful! Site will update in ~1 minute." -ForegroundColor Green
    Write-Host "🔗 Check: https://licuvas.github.io/LearningHub/hub/" -ForegroundColor Blue
    Write-Host "🔗 Alt:   https://learninghub-8z6.pages.dev/hub/" -ForegroundColor Blue
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Check your connection or run:" -ForegroundColor Red
    Write-Host "   git push --set-upstream origin master" -ForegroundColor Yellow
}
