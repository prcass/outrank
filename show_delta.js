#!/usr/bin/env node

/**
 * Show Delta - Compare data.js before and after updates
 */

const { execSync } = require('child_process');
const fs = require('fs');

function showDelta() {
    if (!fs.existsSync('./data.js.backup')) {
        console.log('❌ No backup file found. Run an update first.');
        return;
    }

    try {
        // Get diff output
        const diff = execSync('diff -u data.js.backup data.js', { encoding: 'utf8' });
        console.log('📊 No changes found - files are identical');
    } catch (error) {
        // diff returns non-zero exit code when files differ
        const diffOutput = error.stdout;
        
        console.log('📊 DELTA REPORT: Changes Made\n');
        console.log('='.repeat(50));
        
        // Parse and display changes
        const lines = diffOutput.split('\n');
        let changeCount = 0;
        
        lines.forEach(line => {
            if (line.startsWith('-            ') && !line.startsWith('---')) {
                const oldValue = line.replace('-            ', '').trim();
                changeCount++;
                console.log(`❌ REMOVED: ${oldValue}`);
            } else if (line.startsWith('+            ') && !line.startsWith('+++')) {
                const newValue = line.replace('+            ', '').trim();
                console.log(`✅ ADDED:   ${newValue}`);
                console.log('');
            }
        });
        
        console.log('='.repeat(50));
        console.log(`📈 Total changes: ${changeCount} values updated`);
        console.log('💾 Backup available at: data.js.backup');
        console.log('🔄 To revert: cp data.js.backup data.js');
    }
}

showDelta();