#!/usr/bin/env node

/**
 * Direct update of World Bank data using simple string replacement
 */

const fs = require('fs');

// Create backup
fs.copyFileSync('./data.js', './data.js.backup-direct');
console.log('✅ Backup created: data.js.backup-direct');

// Load data
let dataContent = fs.readFileSync('data.js', 'utf8');
const worldBankData = JSON.parse(fs.readFileSync('world_bank_by_codes.json', 'utf8'));

console.log('🔄 Applying World Bank updates directly...');

let updatesApplied = 0;

// Update life_expectancy and internet_penetration for each country
Object.entries(worldBankData).forEach(([countryCode, updates]) => {
    console.log(`\n📍 Updating country ${countryCode}...`);
    
    // Update life_expectancy
    const lifeExpectancyPattern = new RegExp(`("${countryCode}":[^}]*"life_expectancy":\\s*)[0-9.]+`);
    const lifeMatch = dataContent.match(lifeExpectancyPattern);
    
    if (lifeMatch) {
        dataContent = dataContent.replace(lifeExpectancyPattern, `$1${updates.life_expectancy}`);
        console.log(`  ✓ Updated life_expectancy: ${updates.life_expectancy}`);
        updatesApplied++;
    } else {
        console.log(`  ❌ Could not find life_expectancy for ${countryCode}`);
    }
    
    // Update internet_penetration
    const internetPattern = new RegExp(`("${countryCode}":[^}]*"internet_penetration":\\s*)[0-9.]+`);
    const internetMatch = dataContent.match(internetPattern);
    
    if (internetMatch) {
        dataContent = dataContent.replace(internetPattern, `$1${updates.internet_penetration}`);
        console.log(`  ✓ Updated internet_penetration: ${updates.internet_penetration}`);
        updatesApplied++;
    } else {
        console.log(`  ❌ Could not find internet_penetration for ${countryCode}`);
    }
});

// Write the updated file
fs.writeFileSync('data.js', dataContent);

console.log(`\n✅ Direct updates completed!`);
console.log(`📊 Updates applied: ${updatesApplied}`);
console.log(`📝 File updated: data.js`);
console.log(`💾 Backup: data.js.backup-direct`);

console.log('\n🔍 Test the game to verify updates worked!');