#!/usr/bin/env node

/**
 * Safely add World Bank data using the existing update mechanism
 */

const fs = require('fs');

// Load World Bank data
const worldBankByCode = JSON.parse(fs.readFileSync('world_bank_by_codes.json', 'utf8'));

console.log('🔄 Creating safe update format for existing properties...');

// Create update object for properties that already exist
const safeUpdates = {};

// Only update existing properties first (life_expectancy, internet_penetration)
Object.entries(worldBankByCode).forEach(([code, updates]) => {
    safeUpdates[code] = {
        life_expectancy: updates.life_expectancy,
        internet_penetration: updates.internet_penetration
    };
});

// Save the safe updates
fs.writeFileSync('world_bank_safe_updates.json', JSON.stringify(safeUpdates, null, 2));

console.log('✅ Safe updates created: world_bank_safe_updates.json');
console.log('📊 This will update life_expectancy and internet_penetration only');

console.log('\n💡 To apply safe updates:');
console.log('   node precision_update.js world_bank_safe_updates.json');

console.log('\n🔍 Contents preview:');
console.log(JSON.stringify(safeUpdates, null, 2).substring(0, 500) + '...');