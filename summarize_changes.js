#!/usr/bin/env node

/**
 * Summarize Changes - Show concise overview of what was updated
 */

const { execSync } = require('child_process');
const fs = require('fs');

function summarizeChanges() {
    if (!fs.existsSync('./data.js.backup')) {
        console.log('❌ No backup file found. Run an update first.');
        return;
    }

    try {
        const diff = execSync('diff -u data.js.backup data.js', { encoding: 'utf8' });
        console.log('📊 No changes found - files are identical');
    } catch (error) {
        const diffOutput = error.stdout;
        const lines = diffOutput.split('\n');
        
        console.log('📊 MASS UPDATE SUMMARY');
        console.log('='.repeat(50));
        
        const changes = {};
        let totalChanges = 0;
        
        lines.forEach(line => {
            if (line.startsWith('-            ') && !line.startsWith('---')) {
                const property = line.match(/(\w+):/)?.[1];
                if (property) {
                    if (!changes[property]) {
                        changes[property] = { old: [], new: [] };
                    }
                    const value = line.match(/:\s*([^,]+)/)?.[1];
                    changes[property].old.push(value);
                    totalChanges++;
                }
            } else if (line.startsWith('+            ') && !line.startsWith('+++')) {
                const property = line.match(/(\w+):/)?.[1];
                if (property) {
                    const value = line.match(/:\s*([^,]+)/)?.[1];
                    if (changes[property]) {
                        changes[property].new.push(value);
                    }
                }
            }
        });
        
        console.log('📋 PROPERTIES UPDATED:');
        console.log('');
        
        Object.keys(changes).forEach(property => {
            const change = changes[property];
            const instances = change.old.length;
            const oldSample = change.old[0];
            const newValue = change.new[0];
            
            console.log(`🔄 ${property}:`);
            console.log(`   ${instances} instances updated`);
            console.log(`   Example: ${oldSample} → ${newValue}`);
            console.log('');
        });
        
        console.log('='.repeat(50));
        console.log(`📊 TOTAL: ${Object.keys(changes).length} different properties updated`);
        console.log(`📊 TOTAL: ${totalChanges} individual values changed`);
        console.log(`💾 Backup: data.js.backup`);
        console.log(`🔄 Rollback: cp data.js.backup data.js`);
    }
}

summarizeChanges();