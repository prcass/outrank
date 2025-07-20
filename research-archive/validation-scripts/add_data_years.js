#!/usr/bin/env node

/**
 * Add data year tracking to countries and update prompts
 */

const fs = require('fs');

// Create backup
fs.copyFileSync('./data.js', './data.js.backup-years');
console.log('✅ Backup created: data.js.backup-years');

// Load data
let dataContent = fs.readFileSync('data.js', 'utf8');

console.log('🔄 Adding data year tracking and updating prompts...');

// Step 1: Add data_year properties to countries
// For now, we know from our analysis:
// - life_expectancy is all 2023 data
// - internet_penetration is mostly 2023, some 2024

// Add life_expectancy_year property to all countries
console.log('\n📅 Adding year tracking for life_expectancy (2023)...');
const lifeYearPattern = /("life_expectancy":\s*[0-9.]+)/g;
dataContent = dataContent.replace(lifeYearPattern, '$1,\n                    "life_expectancy_year": 2023');

// Add internet_penetration_year property (2023 for most, 2024 for some)
console.log('📅 Adding year tracking for internet_penetration...');
const internetYearPattern = /("internet_penetration":\s*[0-9.]+)/g;
dataContent = dataContent.replace(internetYearPattern, '$1,\n                    "internet_penetration_year": 2023');

// Update Germany and Denmark to 2024 for internet (based on our check)
const germanyInternetPattern = /("009":[^}]*"internet_penetration_year":\s*)2023/;
dataContent = dataContent.replace(germanyInternetPattern, '$12024');

const denmarkInternetPattern = /("010":[^}]*"internet_penetration_year":\s*)2023/;
dataContent = dataContent.replace(denmarkInternetPattern, '$12024');

// Step 2: Update the prompts to include data year
console.log('\n📝 Updating prompts to show data year...');

// Update life expectancy prompt
const lifeExpPromptPattern = /"label":\s*"Rank these countries by life expectancy \(highest to lowest\)"/;
dataContent = dataContent.replace(lifeExpPromptPattern, 
    '"label": "Rank these countries by life expectancy (highest to lowest) - 2023 data"');

// Update internet penetration prompt
const internetPromptPattern = /"label":\s*"Rank these countries by internet penetration \(highest to lowest\)"/;
dataContent = dataContent.replace(internetPromptPattern,
    '"label": "Rank these countries by internet penetration (highest to lowest) - 2023/2024 data"');

// Write the updated file
fs.writeFileSync('data.js', dataContent);

console.log('\n✅ Data year tracking added!');
console.log('📊 Updates applied:');
console.log('  - Added life_expectancy_year: 2023 to all countries');
console.log('  - Added internet_penetration_year: 2023/2024 as appropriate');
console.log('  - Updated prompts to show data years');
console.log('💾 Backup: data.js.backup-years');

console.log('\n💡 Next steps:');
console.log('  1. Test the game to see updated prompts');
console.log('  2. Future World Bank updates will track years automatically');

// Show sample of updated prompt
console.log('\n📋 Sample updated prompts:');
console.log('  "Rank by life expectancy (highest to lowest) - 2023 data"');
console.log('  "Rank by internet penetration (highest to lowest) - 2023/2024 data"');