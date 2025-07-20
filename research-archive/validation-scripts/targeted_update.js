#!/usr/bin/env node

/**
 * Targeted Data Update Script for Outrank Game
 * Updates specific items with precise targeting
 */

const fs = require('fs');

// Create backup
function createBackup() {
    try {
        fs.copyFileSync('./data.js', './data.js.backup');
        console.log('✅ Backup created: data.js.backup');
    } catch (error) {
        console.error('❌ Failed to create backup:', error.message);
        process.exit(1);
    }
}

// Update a specific property for a specific item
function updateSpecificItem(content, itemKey, property, newValue) {
    // Create pattern to match the specific item and property
    const pattern = new RegExp(
        `("${itemKey}":\\s*{[^}]*${property}:\\s*)[^,\\n}]+`, 
        'g'
    );
    
    const formattedValue = typeof newValue === 'string' ? `"${newValue}"` : newValue;
    
    return content.replace(pattern, `$1${formattedValue}`);
}

// Main function
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Usage: node targeted_update.js [updates.json]');
        console.error('Format: {"AVATAR": {"imdb_rating": 8.2, "box_office_gross": 2923.7}}');
        process.exit(1);
    }
    
    console.log('🎯 Starting targeted data update...');
    
    // Create backup
    createBackup();
    
    // Read current data
    let content = fs.readFileSync('./data.js', 'utf8');
    
    // Read updates
    const updates = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    
    // Apply targeted updates
    let updateCount = 0;
    
    for (const itemKey in updates) {
        const itemUpdates = updates[itemKey];
        
        console.log(`\n🔄 Updating ${itemKey}:`);
        
        for (const property in itemUpdates) {
            const newValue = itemUpdates[property];
            const oldContent = content;
            
            content = updateSpecificItem(content, itemKey, property, newValue);
            
            if (content !== oldContent) {
                updateCount++;
                console.log(`  ✅ ${property} = ${newValue}`);
            } else {
                console.log(`  ⚠️  Failed to update ${property}`);
            }
        }
    }
    
    // Write updated content
    fs.writeFileSync('./data.js', content);
    
    console.log(`\n✅ Update completed! ${updateCount} values updated`);
    console.log('📝 Updated file: data.js');
    console.log('💾 Backup available: data.js.backup');
}

if (require.main === module) {
    main();
}