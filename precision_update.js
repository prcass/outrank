#!/usr/bin/env node

/**
 * Precision Update Script - Update specific items without affecting others
 * Handles per-country, per-movie, per-sport team updates
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

function updateSpecificItem(content, itemKey, property, newValue) {
    // Create precise pattern to match ONLY the specific item
    const pattern = new RegExp(
        `("${itemKey}":\\s*\\{[^}]*${property}:\\s*)[^,\\n}]+`,
        'g'
    );
    
    const formattedValue = typeof newValue === 'string' ? `"${newValue}"` : newValue;
    
    let matches = 0;
    const updatedContent = content.replace(pattern, (match, prefix) => {
        matches++;
        return `${prefix}${formattedValue}`;
    });
    
    return { content: updatedContent, matches };
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Usage: node precision_update.js [updates.json]');
        console.error('Format: {"USA": {"coffee_consumption": 4.2}, "AVATAR": {"imdb_rating": 8.5}}');
        process.exit(1);
    }
    
    console.log('🎯 Starting precision data update...');
    const startTime = Date.now();
    
    createBackup();
    
    let content = fs.readFileSync('./data.js', 'utf8');
    const updates = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    
    let totalUpdates = 0;
    let totalMatches = 0;
    
    console.log(`\n🔄 Processing ${Object.keys(updates).length} items...`);
    
    for (const itemKey in updates) {
        const itemUpdates = updates[itemKey];
        
        console.log(`\n📍 Updating ${itemKey}:`);
        
        for (const property in itemUpdates) {
            const newValue = itemUpdates[property];
            const result = updateSpecificItem(content, itemKey, property, newValue);
            
            content = result.content;
            totalUpdates++;
            
            if (result.matches > 0) {
                totalMatches += result.matches;
                console.log(`  ✅ ${property}: ${result.matches} instance(s) updated → ${newValue}`);
            } else {
                console.log(`  ⚠️  ${property}: No matches found`);
            }
        }
    }
    
    fs.writeFileSync('./data.js', content);
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`\n🎯 Precision update completed in ${duration}ms!`);
    console.log(`📊 ${Object.keys(updates).length} items processed`);
    console.log(`📊 ${totalUpdates} properties attempted`);
    console.log(`📊 ${totalMatches} values successfully updated`);
    console.log(`📝 Updated file: data.js`);
    console.log(`💾 Backup available: data.js.backup`);
    
    if (totalMatches > 0) {
        console.log(`🚀 Performance: ${Math.round(totalMatches / (duration / 1000))} updates/second`);
    }
}

if (require.main === module) {
    main();
}