#!/bin/bash
# Setup automatic aliases for Outrank development

echo "🔧 Setting up Outrank development aliases..."

# Add to .bashrc if not already present
ALIAS_FILE="$HOME/.bashrc"

# Function to add alias if it doesn't exist
add_alias() {
    local alias_name="$1"
    local alias_command="$2"
    
    if ! grep -q "alias $alias_name=" "$ALIAS_FILE" 2>/dev/null; then
        echo "alias $alias_name='$alias_command'" >> "$ALIAS_FILE"
        echo "✅ Added: $alias_name"
    else
        echo "⚠️  Alias $alias_name already exists"
    fi
}

# Get current directory
OUTRANK_DIR="$(pwd)"

# Add development aliases
add_alias "outrank-save" "cd '$OUTRANK_DIR' && ./auto-save.sh"
add_alias "outrank-checkpoint" "cd '$OUTRANK_DIR' && source session-commands.sh && checkpoint"
add_alias "outrank-status" "cd '$OUTRANK_DIR' && source session-commands.sh && status"
add_alias "outrank-rollback" "cd '$OUTRANK_DIR' && git checkout outrank-v2.1"
add_alias "outrank-cd" "cd '$OUTRANK_DIR'"

echo ""
echo "🎯 Available commands (after running 'source ~/.bashrc'):"
echo "  outrank-save 'message'  - Save and push changes"
echo "  outrank-checkpoint      - Create stable checkpoint"
echo "  outrank-status          - Show project status"
echo "  outrank-rollback        - Emergency rollback"
echo "  outrank-cd              - Navigate to project"
echo ""
echo "💡 Run: source ~/.bashrc"