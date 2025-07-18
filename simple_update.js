#!/usr/bin/env node

/**
 * Simple Data Update Script for Outrank Game
 * Updates specific values in data.js
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

// Update a specific value
function updateValue(content, searchText, newValue) {
    const pattern = new RegExp(`(${searchText}:\\s*)[^,\\n}]+`, 'g');
    return content.replace(pattern, `$1${newValue}`);
}

// Main function
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Usage: node simple_update.js [updates.json]');
        process.exit(1);
    }
    
    console.log('🚀 Starting simple data update...');
    
    // Create backup
    createBackup();
    
    // Read current data
    let content = fs.readFileSync('./data.js', 'utf8');
    
    // Read updates
    const updates = JSON.parse(fs.readFileSync(args[0], 'utf8'));
    
    // Apply updates
    let updateCount = 0;
    for (const property in updates) {
        const newValue = updates[property];
        const oldContent = content;
        
        content = updateValue(content, property, newValue);
        
        if (content !== oldContent) {
            updateCount++;
            console.log(`  ✅ Updated ${property} = ${newValue}`);
        } else {
            console.log(`  ⚠️  Failed to update ${property}`);
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