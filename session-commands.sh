#!/bin/bash
# Session management commands for Claude Code work

session_start() {
    echo "🚀 Starting Outrank development session..."
    echo "📍 Current branch: $(git branch --show-current)"
    echo "📊 Status:"
    git status --short
    echo ""
    echo "💡 Quick commands:"
    echo "  save 'message'  - Save current work with message"
    echo "  checkpoint      - Create stable checkpoint"
    echo "  rollback        - Return to last stable version"
    echo "  status          - Show current git status"
}

save() {
    if [ -z "$1" ]; then
        echo "Usage: save 'commit message'"
        return 1
    fi
    
    ./auto-save.sh "$1"
}

checkpoint() {
    TIMESTAMP=$(date "+%Y%m%d_%H%M")
    TAG_NAME="checkpoint-$TIMESTAMP"
    
    # Save current work first
    ./auto-save.sh "🏁 Checkpoint: $TIMESTAMP"
    
    # Create tag
    git tag -a "$TAG_NAME" -m "Checkpoint created at $TIMESTAMP"
    git push --tags
    
    echo "✅ Checkpoint created: $TAG_NAME"
    echo "   Rollback with: git checkout $TAG_NAME"
}

rollback() {
    echo "Available restore points:"
    git tag -l | grep -E "(outrank-|checkpoint-)" | tail -5
    echo ""
    echo "To rollback: git checkout [tag-name]"
    echo "Latest stable: outrank-v2.1"
}

status() {
    echo "📊 Outrank Project Status:"
    echo "🌿 Branch: $(git branch --show-current)"
    echo "📍 Remote: $(git remote get-url origin)"
    echo "📝 Changes:"
    git status --short
}

# Make functions available
export -f session_start save checkpoint rollback status

# Auto-start session info
session_start