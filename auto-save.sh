#!/bin/bash
# Automatic save script for Outrank project
# Run this periodically or after major changes

echo "🔄 Auto-saving Outrank project changes..."

# Check if we're in the right directory
if [ ! -f "game.js" ]; then
    echo "❌ Error: Not in Outrank project directory"
    exit 1
fi

# Check for any changes
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ No changes to save"
    exit 0
fi

# Create timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
BRANCH=$(git branch --show-current)

# Stage all changes
git add .

# Get commit message
if [ "$1" ]; then
    # Description provided as argument
    COMMIT_MSG="$1"
else
    # Interactive mode - prompt for description
    echo ""
    echo "📝 What changes did you make?"
    echo "   Examples: 'fixed fonts', 'added feature', 'bug fix'"
    echo "   (or press Enter for timestamp only)"
    echo ""
    read -p "💬 Description: " USER_INPUT
    
    if [ -n "$USER_INPUT" ]; then
        COMMIT_MSG="$USER_INPUT"
    else
        COMMIT_MSG="🔄 Auto-save: $TIMESTAMP"
    fi
fi

# Commit changes
git commit -m "$COMMIT_MSG

🤖 Auto-saved from branch: $BRANCH
Timestamp: $TIMESTAMP

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to Outrank repository
echo "📤 Pushing to Outrank repository..."
git push

echo "✅ Auto-save complete! Changes pushed to Outrank."