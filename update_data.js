#!/usr/bin/env node

/**
 * Data Update Script for Outrank Game
 * 
 * This script updates the game data.js file with validated data
 * Usage: node update_data.js [validated_data.json]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DATA_FILE = './data.js';
const BACKUP_FILE = './data.js.backup';

/**
 * Creates a backup of the current data file
 */
function createBackup() {
    try {
        fs.copyFileSync(DATA_FILE, BACKUP_FILE);
        console.log('✅ Backup created: data.js.backup');
    } catch (error) {
        console.error('❌ Failed to create backup:', error.message);
        process.exit(1);
    }
}

/**
 * Reads the current data.js file
 */
function readCurrentData() {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        return content;
    } catch (error) {
        console.error('❌ Failed to read data.js:', error.message);
        process.exit(1);
    }
}

/**
 * Reads the validated data JSON file
 */
function readValidatedData(filename) {
    try {
        const content = fs.readFileSync(filename, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('❌ Failed to read validated data:', error.message);
        process.exit(1);
    }
}

/**
 * Updates a specific value in the data.js content
 */
function updateValue(content, category, itemCode, property, newValue) {
    // Find the item section
    const itemPattern = new RegExp(`(${itemCode}:\\s*{[^}]*${property}:\\s*)[^,\\n}]+`, 'g');
    
    const updatedContent = content.replace(itemPattern, (match, prefix) => {
        // Determine if the value should be quoted (strings) or not (numbers)
        const formattedValue = typeof newValue === 'string' ? `"${newValue}"` : newValue;
        return `${prefix}${formattedValue}`;
    });
    
    return updatedContent;
}

/**
 * Updates multiple values for a category
 */
function updateCategory(content, categoryName, categoryData) {
    let updatedContent = content;
    let updateCount = 0;
    
    console.log(`\n🔄 Updating ${categoryName} category...`);
    
    for (const itemCode in categoryData) {
        const itemData = categoryData[itemCode];
        
        for (const property in itemData) {
            const newValue = itemData[property];
            const oldContent = updatedContent;
            
            updatedContent = updateValue(updatedContent, categoryName, itemCode, property, newValue);
            
            if (updatedContent !== oldContent) {
                updateCount++;
                console.log(`  ✅ Updated ${itemCode}.${property} = ${newValue}`);
            } else {
                console.log(`  ⚠️  Failed to update ${itemCode}.${property}`);
            }
        }
    }
    
    console.log(`✅ ${categoryName}: ${updateCount} values updated`);
    return updatedContent;
}

/**
 * Main function
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('❌ Usage: node update_data.js [validated_data.json]');
        console.error('Example: node update_data.js validated_countries.json');
        process.exit(1);
    }
    
    const validatedDataFile = args[0];
    
    console.log('🚀 Starting data update process...');
    console.log(`📁 Data file: ${DATA_FILE}`);
    console.log(`📁 Validated data: ${validatedDataFile}`);
    
    // Create backup
    createBackup();
    
    // Read files
    let content = readCurrentData();
    const validatedData = readValidatedData(validatedDataFile);
    
    // Update each category
    if (validatedData.countries) {
        content = updateCategory(content, 'countries', validatedData.countries);
    }
    
    if (validatedData.movies) {
        content = updateCategory(content, 'movies', validatedData.movies);
    }
    
    if (validatedData.sports) {
        content = updateCategory(content, 'sports', validatedData.sports);
    }
    
    if (validatedData.companies) {
        content = updateCategory(content, 'companies', validatedData.companies);
    }
    
    // Write updated content
    try {
        fs.writeFileSync(DATA_FILE, content, 'utf8');
        console.log('\n✅ Data update completed successfully!');
        console.log('📝 Updated file: data.js');
        console.log('💾 Backup available: data.js.backup');
    } catch (error) {
        console.error('❌ Failed to write updated data:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}