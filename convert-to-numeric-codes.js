// Script to convert all token codes to numeric format (001, 002, etc.)
const fs = require('fs');

// Read the current data
const dataContent = fs.readFileSync('data.js', 'utf8');

// Create a backup first
fs.writeFileSync('data.js.backup-before-numeric', dataContent);
console.log('✅ Backup created: data.js.backup-before-numeric');

// Parse the data structure
const window = {};
eval(dataContent);
const gameData = window.GAME_DATA;

// Create mappings for each category
const codeMappings = {
    countries: {},
    movies: {},
    sports: {},
    companies: {}
};

// Convert each category to numeric codes
Object.keys(gameData.categories).forEach(category => {
    const items = gameData.categories[category].items;
    const keys = Object.keys(items);
    
    // Sort keys to ensure consistent ordering
    keys.sort();
    
    // Create new items with numeric codes
    const newItems = {};
    keys.forEach((oldCode, index) => {
        const numericCode = String(index + 1).padStart(3, '0'); // 001, 002, etc.
        newItems[numericCode] = {
            ...items[oldCode],
            code: numericCode,
            originalCode: oldCode // Keep original for reference
        };
        codeMappings[category][oldCode] = numericCode;
    });
    
    // Replace the items
    gameData.categories[category].items = newItems;
});

// Convert the data back to string format
let newDataContent = 'window.GAME_DATA = ' + JSON.stringify(gameData, null, 4) + ';';

// Write the updated data
fs.writeFileSync('data.js', newDataContent);
console.log('✅ Data converted to numeric codes');

// Save the mappings for reference
fs.writeFileSync('code-mappings.json', JSON.stringify(codeMappings, null, 2));
console.log('✅ Code mappings saved to code-mappings.json');

// Display summary
Object.keys(codeMappings).forEach(category => {
    console.log(`\n${category.toUpperCase()}:`);
    const mapping = codeMappings[category];
    const keys = Object.keys(mapping);
    console.log(`- Total items: ${keys.length}`);
    console.log(`- First 5 mappings:`);
    keys.slice(0, 5).forEach(oldCode => {
        console.log(`  ${oldCode} → ${mapping[oldCode]}`);
    });
});

console.log('\n⚠️  IMPORTANT: Test the game thoroughly after this change!');
console.log('If issues occur, restore with: cp data.js.backup-before-numeric data.js');