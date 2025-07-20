#!/usr/bin/env node

/**
 * Convert World Bank data from country names to country codes
 * for use with precision_update.js
 */

const fs = require('fs');

// Load the game data to get country codes
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

// Load World Bank data
const worldBankData = JSON.parse(fs.readFileSync('world_bank_game_updates.json', 'utf8'));

// Create name to code mapping
const nameToCode = {};
Object.entries(gameData.categories.countries.items).forEach(([code, country]) => {
    nameToCode[country.name] = code;
});

console.log('🔄 Converting World Bank data to country codes...');
console.log('Available country codes:');
Object.entries(nameToCode).forEach(([name, code]) => {
    console.log(`  ${code}: ${name}`);
});

// Convert World Bank data to use codes instead of names
const codeBasedUpdates = {};

worldBankData.forEach(country => {
    const countryName = country.name;
    const countryCode = nameToCode[countryName];
    
    if (countryCode) {
        codeBasedUpdates[countryCode] = country.updates;
        console.log(`✓ Mapped ${countryName} → ${countryCode}`);
    } else {
        console.log(`❌ No code found for ${countryName}`);
    }
});

// Save the converted data
fs.writeFileSync('world_bank_by_codes.json', JSON.stringify(codeBasedUpdates, null, 2));

console.log('\n✅ Converted data saved to: world_bank_by_codes.json');
console.log(`📊 ${Object.keys(codeBasedUpdates).length} countries ready for update`);

console.log('\n💡 Now run:');
console.log('   node precision_update.js world_bank_by_codes.json');