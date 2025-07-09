#!/bin/bash

# GitHub Repository Creation Script
# This script helps create a new GitHub repository for the Mall Shop Admin System

set -e

REPO_NAME="mall-shop-admin-system"
REPO_DESCRIPTION="Complete mall management system with native mobile app and web admin dashboard"
REPO_VISIBILITY="public"  # or "private"

echo "🚀 Creating GitHub repository: $REPO_NAME"

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Please install it from: https://cli.github.com/"
    echo ""
    echo "🔧 Alternative: Manual setup instructions:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: $REPO_NAME"
    echo "3. Description: $REPO_DESCRIPTION"
    echo "4. Visibility: $REPO_VISIBILITY"
    echo "5. Initialize: Don't initialize (we already have files)"
    echo "6. Click 'Create repository'"
    echo ""
    echo "📋 Then run these commands:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &>/dev/null; then
    echo "🔑 Please log in to GitHub CLI:"
    gh auth login
fi

# Create the repository
echo "📁 Creating repository..."
gh repo create "$REPO_NAME" \
    --description "$REPO_DESCRIPTION" \
    --$REPO_VISIBILITY \
    --clone=false \
    --confirm

# Add remote origin
echo "🔗 Adding remote origin..."
git remote add origin "https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

# Get repository URL
REPO_URL=$(gh repo view --json url --jq .url)

echo "✅ Repository created successfully!"
echo "🌐 Repository URL: $REPO_URL"
echo "📚 Clone URL: https://github.com/$(gh api user --jq .login)/$REPO_NAME.git"
echo ""
echo "🎉 Your Mall Shop Admin System is now on GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Add repository secrets for CI/CD:"
echo "   - Go to $REPO_URL/settings/secrets/actions"
echo "   - Add secrets for Docker Hub, production server, etc."
echo "2. Review and update README.md with your specific details"
echo "3. Configure branch protection rules"
echo "4. Set up your production environment"
echo "5. Start contributing!"