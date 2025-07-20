#!/usr/bin/env node

/**
 * Extract all 40 countries from game data and create World Bank mapping
 */

const fs = require('fs');

// Load the game data
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const gameData = window.GAME_DATA;

// ISO3 mapping for World Bank API
const iso3Mapping = {
    "Argentina": "ARG", "Australia": "AUS", "Belgium": "BEL", "Bangladesh": "BGD",
    "Brazil": "BRA", "Canada": "CAN", "Chile": "CHL", "China": "CHN",
    "Germany": "DEU", "Denmark": "DNK", "Egypt": "EGY", "Spain": "ESP",
    "Finland": "FIN", "France": "FRA", "United Kingdom": "GBR", "Greece": "GRC",
    "Indonesia": "IDN", "India": "IND", "Ireland": "IRL", "Israel": "ISR",
    "Italy": "ITA", "Japan": "JPN", "Kenya": "KEN", "South Korea": "KOR",
    "Mexico": "MEX", "Malaysia": "MYS", "Nigeria": "NGA", "Netherlands": "NLD",
    "Norway": "NOR", "New Zealand": "NZL", "Philippines": "PHL", "Portugal": "PRT",
    "Russia": "RUS", "Saudi Arabia": "SAU", "Thailand": "THA", "Turkey": "TUR",
    "Taiwan": "TWN", "United States": "USA", "Vietnam": "VNM", "South Africa": "ZAF",
    "Switzerland": "CHE", "Austria": "AUT", "United Arab Emirates": "ARE", "Singapore": "SGP"
};

console.log('🌍 Extracting ALL 40 Countries from Game Data');
console.log('=' * 60);

const countries = gameData.categories.countries.items;
const allCountries = {};

Object.entries(countries).forEach(([code, country]) => {
    const iso3 = iso3Mapping[country.name];
    if (iso3) {
        allCountries[code] = {
            name: country.name,
            iso3: iso3
        };
        console.log(`✓ ${code}: ${country.name} → ${iso3}`);
    } else {
        allCountries[code] = {
            name: country.name,
            iso3: null
        };
        console.log(`❌ ${code}: ${country.name} → No ISO3 mapping`);
    }
});

// Save the mapping
fs.writeFileSync('all_40_countries_mapping.json', JSON.stringify(allCountries, null, 2));

console.log(`\n✅ Extracted ${Object.keys(allCountries).length} countries`);
console.log('📁 Saved to: all_40_countries_mapping.json');

// Count how many have ISO3 codes
const withISO3 = Object.values(allCountries).filter(c => c.iso3).length;
console.log(`📊 Countries with ISO3 codes: ${withISO3}`);
console.log(`⚠️  Countries without ISO3: ${Object.keys(allCountries).length - withISO3}`);