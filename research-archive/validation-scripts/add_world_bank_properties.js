#!/usr/bin/env node

/**
 * Add new World Bank properties to existing country data
 * This will add gdp_per_capita, population, etc. as new properties
 */

const fs = require('fs');

// Load World Bank data
const worldBankData = JSON.parse(fs.readFileSync('world_bank_by_codes.json', 'utf8'));

// Read current data.js file
let dataContent = fs.readFileSync('data.js', 'utf8');

console.log('🔄 Adding World Bank properties to country data...');

// Create backup first
fs.copyFileSync('./data.js', './data.js.backup-before-wb');
console.log('✅ Backup created: data.js.backup-before-wb');

let totalUpdates = 0;

// Process each country
Object.entries(worldBankData).forEach(([countryCode, updates]) => {
    console.log(`\n📍 Processing country ${countryCode}...`);
    
    // Find the country block and add new properties
    const countryPattern = new RegExp(`("${countryCode}":\\s*{[^}]*)"originalCode"`, 'g');
    
    const match = dataContent.match(countryPattern);
    if (match) {
        // Build the new properties string
        let newProperties = '';
        Object.entries(updates).forEach(([property, value]) => {
            // Check if property already exists
            const existingPropertyPattern = new RegExp(`"${property}":\\s*[^,\\n}]+`);
            if (dataContent.includes(`"${countryCode}":`) && 
                dataContent.substring(dataContent.indexOf(`"${countryCode}":`), 
                dataContent.indexOf('"originalCode"', dataContent.indexOf(`"${countryCode}":`))).match(existingPropertyPattern)) {
                
                // Update existing property
                const updatePattern = new RegExp(`("${countryCode}":[^}]*"${property}":\\s*)[^,\\n}]+`);
                const oldContent = dataContent;
                dataContent = dataContent.replace(updatePattern, `$1${value}`);
                
                if (dataContent !== oldContent) {
                    console.log(`  🔄 Updated ${property}: ${value}`);
                    totalUpdates++;
                } else {
                    console.log(`  ⚠️  Failed to update ${property}`);
                }
            } else {
                // Add new property
                newProperties += `,\n                    "${property}": ${value}`;
                console.log(`  ➕ Adding ${property}: ${value}`);
                totalUpdates++;
            }
        });
        
        // If we have new properties to add, insert them before "originalCode"
        if (newProperties) {
            const insertPattern = new RegExp(`("${countryCode}":[^}]*)"originalCode"`);
            dataContent = dataContent.replace(insertPattern, `$1${newProperties},\n                    "originalCode"`);
        }
    } else {
        console.log(`  ❌ Country ${countryCode} not found in data.js`);
    }
});

// Write the updated file
fs.writeFileSync('data.js', dataContent);

console.log(`\n✅ World Bank properties added!`);
console.log(`📊 Total updates: ${totalUpdates}`);
console.log(`📝 Updated file: data.js`);
console.log(`💾 Backup available: data.js.backup-before-wb`);

console.log('\n🔍 Verify the changes with:');
console.log('   node show_current_data.js');