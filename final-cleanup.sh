#!/bin/bash

# Final Repository Cleanup - Phase 2
# Move remaining research files to archive

echo "🔄 Phase 2: Final cleanup of remaining research files..."

# Move remaining Python research scripts
echo "📦 Moving remaining Python research scripts..."
mv *.py research-archive/data-extraction/ 2>/dev/null || true

# Move remaining documentation files that are research-related
echo "📄 Moving additional research documentation..."
mv ARCHITECTURE.md research-archive/ 2>/dev/null || true
mv CATEGORIES_REFERENCE.md research-archive/ 2>/dev/null || true
mv MISSING_DATA_SUMMARY.md research-archive/ 2>/dev/null || true
mv README_WORLD_BANK.md research-archive/ 2>/dev/null || true
mv STATE_MIGRATION_REPORT.md research-archive/ 2>/dev/null || true

# Move remaining rulebook versions (keep the final one)
echo "📋 Moving older rulebook versions..."
mv OUTRANK_COMPREHENSIVE_RULEBOOK.md research-archive/ 2>/dev/null || true
mv OUTRANK_RULEBOOK.md research-archive/ 2>/dev/null || true
# Keep OUTRANK_FINAL_RULEBOOK.md in root

# Move remaining JavaScript development files
echo "⚙️ Moving remaining development scripts..."
mv add_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv capitalize_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv combine_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv convert-*.js research-archive/validation-scripts/ 2>/dev/null || true
mv countries_data*.js research-archive/data-extraction/ 2>/dev/null || true
mv fix_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv format_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv get_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv integrate_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv movies_data.js research-archive/data-extraction/ 2>/dev/null || true
mv show_*.js research-archive/validation-scripts/ 2>/dev/null || true
mv world_bank_*.js research-archive/data-extraction/ 2>/dev/null || true

# Move remaining test/development files
echo "🧪 Moving test and development files..."
mv download_dataset.html research-archive/test-files/ 2>/dev/null || true

# Move any remaining backup files
echo "💾 Moving any remaining backup files..."
mv rollback_*.sh research-archive/backups-old/ 2>/dev/null || true

# Clean up script files (keep important ones)
echo "🧹 Final cleanup..."
rm -f complete-repository-backup-*.tar.gz 2>/dev/null || true  # Already have git backup

echo "📊 Final repository summary:"
echo "  Core files remaining in root:"
ls -la *.js *.html *.css *.md *.sh 2>/dev/null | wc -l
echo ""
echo "  Essential game files:"
echo "    ✅ game.js (main game logic)"
echo "    ✅ data.js (game data)"  
echo "    ✅ index.html (game interface)"
echo "    ✅ styles.css (styling)"
echo "    ✅ server.js (local server)"
echo ""
echo "  Essential documentation:"
echo "    ✅ CLAUDE.md (project context)"
echo "    ✅ COMMANDS.md (development commands)"
echo "    ✅ DEVELOPMENT.md (standards)"
echo "    ✅ README.md (project overview)"
echo ""
echo "  Essential tools:"
echo "    ✅ auto-save.sh (version control)"
echo "    ✅ start-server.sh (local development)"
echo "    ✅ session-commands.sh (git shortcuts)"
echo ""
echo "✅ Repository is now clean and focused on the core game!"