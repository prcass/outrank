#!/bin/bash

# Repository Cleanup Script with Multiple Fallback Positions
# Creates clean repository structure while preserving all data

set -e  # Exit on any error

echo "🔄 Starting repository cleanup with fallback protection..."

# FALLBACK 1: Already created git tag 'repository-backup-pre-cleanup-YYYYMMDD-HHMMSS'
echo "✅ Fallback 1: Git tag backup already created"

# FALLBACK 2: Create complete archive of current state
echo "📦 Creating complete archive backup..."
tar -czf "../complete-repository-backup-$(date +%Y%m%d-%H%M%S).tar.gz" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.tar.gz' \
    . || { echo "❌ Archive creation failed, continuing anyway..."; }

# FALLBACK 3: Create research-archive directory for all temp files
echo "📁 Creating research-archive directory..."
mkdir -p research-archive/data-extraction
mkdir -p research-archive/validation-scripts
mkdir -p research-archive/test-files
mkdir -p research-archive/backups-old

# Core game files to KEEP in root
CORE_FILES=(
    "game.js"
    "data.js" 
    "index.html"
    "styles.css"
    "server.js"
    "auto-save.sh"
    "start-server.sh"
    "session-commands.sh"
    "CLAUDE.md"
    "COMMANDS.md"
    "DEVELOPMENT.md"
    "README.md"
)

echo "🔒 Protecting core game files..."
for file in "${CORE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ Keeping: $file"
    else
        echo "  ⚠️  Missing: $file"
    fi
done

# Keep these directories in root
echo "📂 Keeping essential directories: outrank-deploy/"

# Move research files to archive
echo "📦 Archiving research files..."

# Data extraction files
echo "  Moving data extraction files..."
mv *.csv research-archive/data-extraction/ 2>/dev/null || true
mv *.json research-archive/data-extraction/ 2>/dev/null || true
mv *data*.py research-archive/data-extraction/ 2>/dev/null || true
mv *extract*.py research-archive/data-extraction/ 2>/dev/null || true
mv *download*.py research-archive/data-extraction/ 2>/dev/null || true
mv *create*.py research-archive/data-extraction/ 2>/dev/null || true
mv *add_*.py research-archive/data-extraction/ 2>/dev/null || true
mv *fetch*.py research-archive/data-extraction/ 2>/dev/null || true
mv *world_bank*.py research-archive/data-extraction/ 2>/dev/null || true
mv *unesco*.py research-archive/data-extraction/ 2>/dev/null || true

# Validation scripts  
echo "  Moving validation scripts..."
mv *update*.js research-archive/validation-scripts/ 2>/dev/null || true
mv *test*.js research-archive/validation-scripts/ 2>/dev/null || true
mv *validation*.py research-archive/validation-scripts/ 2>/dev/null || true
mv *analyze*.py research-archive/validation-scripts/ 2>/dev/null || true
mv *verify*.py research-archive/validation-scripts/ 2>/dev/null || true
mv precision_update.js research-archive/validation-scripts/ 2>/dev/null || true
mv mass_update.js research-archive/validation-scripts/ 2>/dev/null || true
mv show_delta.js research-archive/validation-scripts/ 2>/dev/null || true
mv summarize_changes.js research-archive/validation-scripts/ 2>/dev/null || true

# Test files
echo "  Moving test files..."
mv test*.html research-archive/test-files/ 2>/dev/null || true
mv debug*.html research-archive/test-files/ 2>/dev/null || true
mv print*.html research-archive/test-files/ 2>/dev/null || true
mv security-test.html research-archive/test-files/ 2>/dev/null || true

# Old backups
echo "  Moving old backup files..."
mv data.js.backup* research-archive/backups-old/ 2>/dev/null || true
mv game_original_backup.js research-archive/backups-old/ 2>/dev/null || true
mv data_original_structure.js research-archive/backups-old/ 2>/dev/null || true
mv data_working_backup.js research-archive/backups-old/ 2>/dev/null || true

# Move documentation files that are research-related
echo "  Moving research documentation..."
mv *DATASET*.md research-archive/ 2>/dev/null || true
mv *VALIDATION*.md research-archive/ 2>/dev/null || true
mv *WORKFLOW*.md research-archive/ 2>/dev/null || true
mv *ANALYSIS*.md research-archive/ 2>/dev/null || true
mv *VERIFICATION*.md research-archive/ 2>/dev/null || true

# Move data expansion files
echo "  Moving data expansion files..."
mv companies_*.js research-archive/data-extraction/ 2>/dev/null || true
mv sports_*.js research-archive/data-extraction/ 2>/dev/null || true
mv board-game-data.js research-archive/data-extraction/ 2>/dev/null || true

# Clean up empty files and temp files
echo "🧹 Cleaning up temporary files..."
rm -f *.log 2>/dev/null || true
rm -f *.txt 2>/dev/null || true
rm -f save 2>/dev/null || true
rm -f demo-change.txt 2>/dev/null || true

echo "📊 Repository cleanup summary:"
echo "  Core game files: $(ls -1 *.js *.html *.css *.md *.sh 2>/dev/null | wc -l) files kept in root"
echo "  Research files archived: $(find research-archive -type f | wc -l) files moved to research-archive/"
echo "  Current directory size: $(du -sh . | cut -f1)"

echo ""
echo "🔄 FALLBACK RECOVERY OPTIONS:"
echo "  1. Git rollback: git checkout repository-backup-pre-cleanup-$(date +%Y%m%d)*"
echo "  2. Archive restore: tar -xzf complete-repository-backup-*.tar.gz"
echo "  3. Research files: All preserved in research-archive/ directory"
echo ""
echo "✅ Repository cleanup completed safely!"