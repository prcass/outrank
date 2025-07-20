#!/bin/bash
# Rollback script to restore original Outrank data
# Use this if anything goes wrong with the update

echo "🔄 Outrank Data Rollback Script"
echo "================================"
echo ""

# Safety check
if [ ! -f "backups/2025-07-19/data_ORIGINAL_SAFE_20250719_225935.js" ]; then
    echo "❌ ERROR: Original backup file not found!"
    echo "Cannot proceed with rollback."
    exit 1
fi

echo "This will restore the ORIGINAL Outrank data from before the Know-It-All update."
echo ""
echo "Current files will be backed up as:"
echo "  • data.js → data.js.before_rollback"
echo "  • game.js → game.js.before_rollback"
echo ""
read -p "Are you sure you want to rollback? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Rollback cancelled."
    exit 0
fi

# Backup current files
echo ""
echo "📦 Backing up current files..."
cp data.js data.js.before_rollback 2>/dev/null
cp game.js game.js.before_rollback 2>/dev/null

# Restore original files
echo "♻️  Restoring original files..."
cp backups/2025-07-19/data_ORIGINAL_SAFE_20250719_225935.js data.js
cp backups/2025-07-19/game_ORIGINAL_SAFE_20250719_225935.js game.js

# Verify
if [ -f "data.js" ] && [ -f "game.js" ]; then
    echo ""
    echo "✅ Rollback complete!"
    echo ""
    echo "Restored files:"
    echo "  • data.js ($(wc -l < data.js) lines)"
    echo "  • game.js ($(wc -l < game.js) lines)"
    echo ""
    echo "Your original Outrank game data has been restored."
    echo "Previous attempt saved as: data.js.before_rollback"
else
    echo "❌ ERROR: Rollback failed!"
    exit 1
fi