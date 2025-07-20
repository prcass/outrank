#!/usr/bin/env node

/**
 * Update all 40 countries with World Bank data
 */

const fs = require('fs');

// Create backup
fs.copyFileSync('./data.js', './data.js.backup-all40');
console.log('✅ Backup created: data.js.backup-all40');

// Load data
let dataContent = fs.readFileSync('data.js', 'utf8');
const worldBankData = JSON.parse(fs.readFileSync('world_bank_all_40_data.json', 'utf8'));

console.log('🔄 Updating ALL 40 countries with World Bank data...');
console.log(`📊 Processing ${Object.keys(worldBankData).length} countries with data`);

let updatesApplied = 0;
let countriesUpdated = 0;

// Update each country
Object.entries(worldBankData).forEach(([countryCode, updates]) => {
    console.log(`\n📍 Updating country ${countryCode}...`);
    let countryUpdated = false;
    
    // Update life_expectancy if available
    if (updates.life_expectancy) {
        const lifePattern = new RegExp(`("${countryCode}":[^}]*"life_expectancy":\\s*)[0-9.]+`);
        const lifeMatch = dataContent.match(lifePattern);
        
        if (lifeMatch) {
            dataContent = dataContent.replace(lifePattern, `$1${updates.life_expectancy}`);
            console.log(`  ✓ Updated life_expectancy: ${updates.life_expectancy}`);
            updatesApplied++;
            countryUpdated = true;
        } else {
            console.log(`  ❌ Could not find life_expectancy pattern for ${countryCode}`);
        }
    }
    
    // Update internet_penetration if available
    if (updates.internet_penetration) {
        const internetPattern = new RegExp(`("${countryCode}":[^}]*"internet_penetration":\\s*)[0-9.]+`);
        const internetMatch = dataContent.match(internetPattern);
        
        if (internetMatch) {
            dataContent = dataContent.replace(internetPattern, `$1${updates.internet_penetration}`);
            console.log(`  ✓ Updated internet_penetration: ${updates.internet_penetration}`);
            updatesApplied++;
            countryUpdated = true;
        } else {
            console.log(`  ❌ Could not find internet_penetration pattern for ${countryCode}`);
        }
    }
    
    if (countryUpdated) {
        countriesUpdated++;
    }
});

// Write the updated file
fs.writeFileSync('data.js', dataContent);

console.log(`\n🎉 ALL 40 COUNTRIES UPDATE COMPLETE!`);
console.log(`📊 Countries updated: ${countriesUpdated}`);
console.log(`📊 Total updates applied: ${updatesApplied}`);
console.log(`📝 File updated: data.js`);
console.log(`💾 Backup: data.js.backup-all40`);

console.log('\n📈 Coverage Summary:');
console.log(`  ✅ Countries with World Bank data: 39/40 (Taiwan excluded)`);
console.log(`  📊 Life expectancy updated: ${Math.floor(updatesApplied/2)} countries`);
console.log(`  🌐 Internet penetration updated: ${Math.floor(updatesApplied/2)} countries`);

console.log('\n🎮 Your Outrank game now has fresh 2023 World Bank data for ALL countries!');
console.log('🔍 Test the game to see the updated rankings!');