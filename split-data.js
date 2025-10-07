/**
 * Data Splitting Script for Know-It-All Game
 * Extracts category data from main data.js file into separate JSON files
 */

const fs = require('fs');
const path = require('path');

// Read the original data.js file
const dataPath = './data.js';
const outputDir = './data';

console.log('📦 Starting data split process...');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read and parse the original data file
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract the GAME_DATA object
const startMarker = 'window.GAME_DATA = ';
const endMarker = '};';

const startIndex = dataContent.indexOf(startMarker);
if (startIndex === -1) {
    console.error('❌ Could not find GAME_DATA in file');
    process.exit(1);
}

const dataStart = startIndex + startMarker.length;
let braceCount = 0;
let endIndex = dataStart;
let inString = false;
let escapeNext = false;

// Find the end of the object by counting braces
for (let i = dataStart; i < dataContent.length; i++) {
    const char = dataContent[i];
    
    if (escapeNext) {
        escapeNext = false;
        continue;
    }
    
    if (char === '\\') {
        escapeNext = true;
        continue;
    }
    
    if (char === '"' || char === "'") {
        inString = !inString;
        continue;
    }
    
    if (!inString) {
        if (char === '{') {
            braceCount++;
        } else if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }
}

const gameDataStr = dataContent.substring(dataStart, endIndex);
const gameData = eval('(' + gameDataStr + ')');

console.log('✅ Parsed GAME_DATA successfully');

// Extract each category
const categories = ['countries', 'movies', 'sports', 'companies'];

categories.forEach(categoryName => {
    const category = gameData.categories[categoryName];
    if (!category) {
        console.warn(`⚠️ Category ${categoryName} not found`);
        return;
    }
    
    // Create production version (40 items for countries, all items for others)
    const productionData = {
        prompts: category.prompts || [],
        items: category.items || {}
    };
    
    // For countries, we might want to limit to first 40 items in the future
    // For now, keep all items as they represent the "production" dataset
    
    const filename = `${categoryName}-production.json`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(productionData, null, 2));
    
    const itemCount = Object.keys(productionData.items).length;
    const promptCount = productionData.prompts.length;
    const fileSize = fs.statSync(filepath).size;
    
    console.log(`✅ ${categoryName}: ${itemCount} items, ${promptCount} prompts (${Math.round(fileSize/1024)}KB) -> ${filename}`);
});

// Create a core data file with just the structure
const coreData = {
    meta: {
        version: "5.2-lazy",
        split: true,
        timestamp: new Date().toISOString(),
        categories: Object.keys(gameData.categories)
    },
    structure: Object.keys(gameData.categories).reduce((acc, cat) => {
        acc[cat] = {
            name: gameData.categories[cat].name,
            icon: gameData.categories[cat].icon,
            promptCount: gameData.categories[cat].prompts?.length || 0,
            itemCount: Object.keys(gameData.categories[cat].items || {}).length
        };
        return acc;
    }, {})
};

fs.writeFileSync(path.join(outputDir, 'core.json'), JSON.stringify(coreData, null, 2));

console.log('✅ Core data structure saved');
console.log('📊 Data split complete!');

// Calculate total savings
const originalSize = fs.statSync(dataPath).size;
const totalSplitSize = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.json'))
    .reduce((total, file) => {
        return total + fs.statSync(path.join(outputDir, file)).size;
    }, 0);

console.log(`📏 Original size: ${Math.round(originalSize/1024)}KB`);
console.log(`📏 Split files total: ${Math.round(totalSplitSize/1024)}KB`);
console.log(`💾 Initial load reduction: ${Math.round((1 - totalSplitSize/originalSize) * 100)}% when loading on-demand`);