#!/usr/bin/env node
/**
 * Combine all category files into a single browser-compatible data.js
 */
const fs = require('fs');

console.log('🔄 Combining category files...');

// Read all category files
const files = [
  'countries_data_v2.js',
  'movies_data.js', 
  'sports_data.js',
  'companies_data.js'
];

let combinedContent = `/**
 * Outrank Game Data - v2.2 Combined
 * Updated: ${new Date().toISOString()}
 * Combined from modular category files
 * Categories: Countries (40 expanded), Movies (40), Sports (40), Companies (40)
 */

`;

// Extract data from each file and combine
files.forEach(file => {
  console.log(`📄 Processing ${file}...`);
  
  const content = fs.readFileSync(file, 'utf8');
  
  // Extract the export data (everything between export const and the closing })
  const match = content.match(/export const \w+Data\s*=\s*({[\s\S]*});/);
  if (match) {
    const dataObj = match[1];
    const categoryName = file.replace('_data.js', '').replace('_v2', '').replace('countries', 'countries');
    
    combinedContent += `// ${categoryName.toUpperCase()} CATEGORY DATA\n`;
    combinedContent += `const ${categoryName}Data = ${dataObj};\n\n`;
  }
});

// Add the main GAME_DATA structure
combinedContent += `
// Main GAME_DATA structure
window.GAME_DATA = {
    categories: {
        countries: countriesData,
        movies: moviesData,
        sports: sportsData,
        companies: companiesData
    }
};

console.log('✅ Game data loaded with', Object.keys(window.GAME_DATA.categories).length, 'categories');
`;

// Write the combined file
fs.writeFileSync('data.js', combinedContent);
console.log('✅ Combined data.js created successfully!');
console.log('📊 File size:', Math.round(combinedContent.length/1024) + 'KB');