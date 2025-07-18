#!/usr/bin/env node

/**
 * Mass Data Update Script - Handles thousands of property updates
 */

const fs = require('fs');

function createBackup() {
    try {
        fs.copyFileSync('./data.js', './data.js.backup');
        console.log('✅ Backup created: data.js.backup');
    } catch (error) {
        console.error('❌ Failed to create backup:', error.message);
        process.exit(1);
    }
}

function updateValue(content, searchText, newValue) {
    const pattern = new RegExp(`(${searchText}:\\s*)[^,\\n}]+`, 'g');
    let matchCount = 0;
    
    const updatedContent = content.replace(pattern, (match) => {
        matchCount++;
        return `${searchText}: ${newValue}`;
    });
    
    return { content: updatedContent, matchCount };
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Usage: node mass_update.js [updates.json]');
        process.exit(1);
    }
    
    console.log('⚡ Starting mass data update...');
    const startTime = Date.now();
    
    createBackup();
    
    let content = fs.readFileSync('./data.js', 'utf8');
    const updates = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    
    let totalUpdates = 0;
    let totalMatches = 0;
    
    console.log(`\n🔄 Processing ${Object.keys(updates).length} properties...`);
    
    for (const property in updates) {
        const newValue = updates[property];
        const result = updateValue(content, property, newValue);
        
        content = result.content;
        totalUpdates++;
        totalMatches += result.matchCount;
        
        if (result.matchCount > 0) {
            console.log(`✅ ${property}: ${result.matchCount} instances updated`);
        } else {
            console.log(`⚠️  ${property}: No matches found`);
        }
    }
    
    fs.writeFileSync('./data.js', content);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`\n⚡ Mass update completed in ${duration}ms!`);
    console.log(`📊 ${totalUpdates} properties processed`);
    console.log(`📊 ${totalMatches} individual values updated`);
    console.log(`📝 Updated file: data.js`);
    console.log(`💾 Backup available: data.js.backup`);
    console.log(`🚀 Performance: ${Math.round(totalMatches / (duration / 1000))} updates/second`);
}

if (require.main === module) {
    main();
}