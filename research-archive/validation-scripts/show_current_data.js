#!/usr/bin/env node

/**
 * Extract current data for specific countries from data.js
 * Shows what data we currently have vs World Bank data
 */

const fs = require('fs');

// Load the game data
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

// Countries to compare (matching World Bank download)
const countriesToCheck = [
    "United States", "China", "Japan", "Germany", "United Kingdom", 
    "France", "India", "Brazil", "Canada", "Italy"
];

// Load World Bank data
const worldBankData = JSON.parse(fs.readFileSync('world_bank_game_updates.json', 'utf8'));

console.log('🎮 CURRENT GAME DATA vs WORLD BANK DATA COMPARISON');
console.log('='.repeat(70));

// Create lookup for World Bank data
const wbLookup = {};
worldBankData.forEach(country => {
    wbLookup[country.name] = country.updates;
});

// Find countries in game data
const gameCountries = gameData.categories.countries.items;
const countryLookup = {};

// Create lookup by name
Object.values(gameCountries).forEach(country => {
    countryLookup[country.name] = country;
});

console.log(`\n📊 Found ${Object.keys(gameCountries).length} countries in game data`);
console.log(`🌍 Found ${worldBankData.length} countries in World Bank data\n`);

// Compare each country
let changesFound = false;

countriesToCheck.forEach(countryName => {
    const gameCountry = countryLookup[countryName];
    const wbCountry = wbLookup[countryName];
    
    if (!gameCountry) {
        console.log(`❓ ${countryName}: Not found in game data`);
        return;
    }
    
    if (!wbCountry) {
        console.log(`❓ ${countryName}: Not found in World Bank data`);
        return;
    }
    
    console.log(`\n🌍 ${countryName}:`);
    console.log('-'.repeat(50));
    
    const fields = [
        { game: 'gdp_per_capita', wb: 'gdp_per_capita', name: 'GDP per Capita', format: 'currency' },
        { game: 'population', wb: 'population', name: 'Population', format: 'number' },
        { game: 'life_expectancy', wb: 'life_expectancy', name: 'Life Expectancy', format: 'years' },
        { game: 'internet_penetration', wb: 'internet_penetration', name: 'Internet %', format: 'percent' },
        { game: 'inflation_rate', wb: 'inflation_rate', name: 'Inflation %', format: 'percent' },
        { game: 'unemployment_rate', wb: 'unemployment_rate', name: 'Unemployment %', format: 'percent' }
    ];
    
    let countryHasChanges = false;
    
    fields.forEach(field => {
        const currentValue = gameCountry[field.game];
        const newValue = wbCountry[field.wb];
        
        let currentDisplay, newDisplay, different = false;
        
        if (currentValue !== undefined && newValue !== undefined) {
            // Format displays
            if (field.format === 'currency') {
                currentDisplay = `$${Number(currentValue).toLocaleString()}`;
                newDisplay = `$${Number(newValue).toLocaleString()}`;
                different = Math.abs(currentValue - newValue) > 100; // $100 tolerance
            } else if (field.format === 'number') {
                currentDisplay = Number(currentValue).toLocaleString();
                newDisplay = Number(newValue).toLocaleString();
                different = Math.abs(currentValue - newValue) > (currentValue * 0.001); // 0.1% tolerance
            } else if (field.format === 'years') {
                currentDisplay = `${Number(currentValue).toFixed(1)} years`;
                newDisplay = `${Number(newValue).toFixed(1)} years`;
                different = Math.abs(currentValue - newValue) > 0.1;
            } else if (field.format === 'percent') {
                currentDisplay = `${Number(currentValue).toFixed(1)}%`;
                newDisplay = `${Number(newValue).toFixed(1)}%`;
                different = Math.abs(currentValue - newValue) > 0.1;
            }
            
            if (different) {
                console.log(`  🔄 ${field.name.padEnd(15)} | Current: ${currentDisplay.padStart(15)} → New: ${newDisplay.padStart(15)}`);
                countryHasChanges = true;
                changesFound = true;
            } else {
                console.log(`  ✓ ${field.name.padEnd(15)} | ${currentDisplay.padStart(15)} (no change)`);
            }
            
        } else if (currentValue === undefined && newValue !== undefined) {
            if (field.format === 'currency') {
                newDisplay = `$${Number(newValue).toLocaleString()}`;
            } else if (field.format === 'number') {
                newDisplay = Number(newValue).toLocaleString();
            } else if (field.format === 'years') {
                newDisplay = `${Number(newValue).toFixed(1)} years`;
            } else if (field.format === 'percent') {
                newDisplay = `${Number(newValue).toFixed(1)}%`;
            }
            
            console.log(`  ➕ ${field.name.padEnd(15)} | Current: ${'None'.padStart(15)} → New: ${newDisplay.padStart(15)}`);
            countryHasChanges = true;
            changesFound = true;
            
        } else if (currentValue !== undefined && newValue === undefined) {
            console.log(`  ⚠️  ${field.name.padEnd(15)} | Current: ${currentValue} → New: None`);
        } else {
            console.log(`  ❓ ${field.name.padEnd(15)} | No data available`);
        }
    });
    
    if (!countryHasChanges) {
        console.log('  ✅ No changes needed - all data is current!');
    }
});

console.log('\n' + '='.repeat(70));
if (changesFound) {
    console.log('📊 SUMMARY: Changes detected! World Bank has newer data.');
    console.log('💡 To apply updates, run:');
    console.log('   node precision_update.js world_bank_game_updates.json');
} else {
    console.log('✅ SUMMARY: All data is current! No updates needed.');
}

console.log('\n🔍 TIP: Check individual countries above to see specific differences.');