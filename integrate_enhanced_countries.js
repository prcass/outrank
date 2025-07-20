#!/usr/bin/env node
/**
 * Integrate Enhanced 40-Country Dataset
 * Safely merges your expanded dataset into the working game structure
 */

const fs = require('fs');

console.log('🔄 Starting enhanced countries integration...');

// Step 1: Load the enhanced dataset
console.log('📊 Loading enhanced dataset...');
const enhancedData = JSON.parse(fs.readFileSync('know_it_all_COMPLETE_40_countries_34_indicators_20250719_224831.json', 'utf8'));
console.log(`✅ Loaded ${enhancedData.countries.length} countries with ${enhancedData.dataset_info.indicator_count} indicators`);

// Step 2: Load current working data
console.log('📖 Loading current working data structure...');
const currentDataContent = fs.readFileSync('data.js', 'utf8');
let gameData;

// Parse the current data by creating a mock window object
const window = {};
eval(currentDataContent);
gameData = window.GAME_DATA;

console.log(`✅ Current structure has ${Object.keys(gameData.categories).length} categories`);

// Step 3: Create enhanced prompts based on our 34 indicators
console.log('🎯 Generating enhanced prompts...');
const enhancedPrompts = [
    {
        "challenge": "gdp_total",
        "label": "Which country has the biggest economy (GDP)? Rank highest to lowest"
    },
    {
        "challenge": "gdp_growth_pct", 
        "label": "Which country has the fastest growing economy? Rank highest to lowest"
    },
    {
        "challenge": "unemployment_rate",
        "label": "Which country has the lowest unemployment? Rank lowest to highest"
    },
    {
        "challenge": "health_expenditure_pct_gdp",
        "label": "Which country spends the most on healthcare (% GDP)? Rank highest to lowest"
    },
    {
        "challenge": "healthy_diet_cost_ppp",
        "label": "Where is a healthy diet most affordable? Rank lowest to highest cost"
    },
    {
        "challenge": "patent_applications",
        "label": "Which country files the most patents? Rank highest to lowest"
    },
    {
        "challenge": "female_labor_participation_pct",
        "label": "Where do women have highest workforce participation? Rank highest to lowest"
    },
    {
        "challenge": "population_total",
        "label": "Which country has the most people? Rank highest to lowest"
    },
    {
        "challenge": "population_0_14_pct",
        "label": "Which country has the most kids (0-14)? Rank highest to lowest %"
    },
    {
        "challenge": "population_65_plus_pct",
        "label": "Which country has the most elderly (65+)? Rank highest to lowest %"
    },
    {
        "challenge": "birth_rate",
        "label": "Where are the most babies born? Rank highest to lowest birth rate"
    },
    {
        "challenge": "life_expectancy",
        "label": "Where do people live longest? Rank highest to lowest years"
    },
    {
        "challenge": "rural_population_pct",
        "label": "Which country is most rural? Rank highest to lowest % rural"
    },
    {
        "challenge": "broadband_per_100",
        "label": "Who has the most home internet? Rank highest to lowest broadband"
    },
    {
        "challenge": "mobile_per_100",
        "label": "Where does everyone have phones? Rank highest to lowest mobile subs"
    },
    {
        "challenge": "secure_servers_per_1m",
        "label": "Who has the most secure internet? Rank highest to lowest servers"
    },
    {
        "challenge": "forest_area_pct",
        "label": "Which country is basically one big forest? Rank highest to lowest %"
    },
    {
        "challenge": "renewable_energy_pct",
        "label": "Who runs on clean energy? Rank highest to lowest renewable %"
    },
    {
        "challenge": "electricity_coal_pct",
        "label": "Who uses the least coal? Rank lowest to highest coal electricity"
    },
    {
        "challenge": "electricity_oil_pct",
        "label": "Who uses the least oil? Rank lowest to highest oil electricity"
    },
    {
        "challenge": "pollution_index",
        "label": "Where's the cleanest air? Rank lowest to highest pollution index"
    },
    {
        "challenge": "irrigated_land_km2",
        "label": "Who waters the most farmland? Rank highest to lowest irrigated land"
    },
    {
        "challenge": "soybean_production_tonnes",
        "label": "Who's the soybean superpower? Rank highest to lowest production"
    },
    {
        "challenge": "airports",
        "label": "Which country has airports everywhere? Rank highest to lowest count"
    },
    {
        "challenge": "unesco_total_sites",
        "label": "Who's hoarding UNESCO sites? Rank highest to lowest total sites"
    },
    {
        "challenge": "unesco_cultural_sites",
        "label": "Where are the most historic sites? Rank highest to lowest cultural"
    },
    {
        "challenge": "unesco_natural_sites",
        "label": "Who has the most stunning nature? Rank highest to lowest natural"
    },
    {
        "challenge": "unesco_mixed_sites",
        "label": "Where culture meets nature? Rank highest to lowest mixed sites"
    },
    {
        "challenge": "tertiary_enrollment_pct",
        "label": "Where's everyone in college? Rank highest to lowest enrollment"
    },
    {
        "challenge": "nobel_laureates",
        "label": "Which country breeds Nobel winners? Rank highest to lowest laureates"
    },
    {
        "challenge": "crime_index",
        "label": "Where can you walk alone at night? Rank lowest to highest crime"
    },
    {
        "challenge": "life_evaluation",
        "label": "Where are people loving life most? Rank highest to lowest happiness"
    }
];

console.log(`✅ Generated ${enhancedPrompts.length} enhanced prompts`);

// Step 4: Convert enhanced countries to game format
console.log('🌍 Converting enhanced countries to game format...');
const enhancedItems = {};

enhancedData.countries.forEach((country, index) => {
    // Use 3-digit format like original (001, 002, etc.)
    const code = String(index + 1).padStart(3, '0');
    
    enhancedItems[code] = {
        name: country.name,
        code: code,
        // Map all our enhanced indicators
        gdp_total: country.gdp_current_usd,
        gdp_growth_pct: country.gdp_growth_pct,
        unemployment_rate: country.unemployment_rate,
        health_expenditure_pct_gdp: country.health_expenditure_pct_gdp,
        healthy_diet_cost_ppp: country.healthy_diet_cost_ppp,
        patent_applications: country.patent_applications,
        female_labor_participation_pct: country.female_labor_participation_pct,
        population_total: country.population_total,
        population_0_14_pct: country.population_0_14_pct,
        population_65_plus_pct: country.population_65_plus_pct,
        birth_rate: country.birth_rate,
        life_expectancy: country.life_expectancy,
        rural_population_pct: country.rural_population_pct,
        broadband_per_100: country.broadband_per_100,
        mobile_per_100: country.mobile_per_100,
        secure_servers_per_1m: country.secure_servers_per_1m,
        forest_area_pct: country.forest_area_pct,
        renewable_energy_pct: country.renewable_energy_pct,
        electricity_coal_pct: country.electricity_coal_pct,
        electricity_oil_pct: country.electricity_oil_pct,
        pollution_index: country.pollution_index,
        irrigated_land_km2: country.irrigated_land_km2,
        soybean_production_tonnes: country.soybean_production_tonnes,
        airports: country.airports,
        unesco_total_sites: country.unesco_total_sites,
        unesco_cultural_sites: country.unesco_cultural_sites,
        unesco_natural_sites: country.unesco_natural_sites,
        unesco_mixed_sites: country.unesco_mixed_sites,
        tertiary_enrollment_pct: country.tertiary_enrollment_pct,
        nobel_laureates: country.nobel_laureates,
        crime_index: country.crime_index,
        life_evaluation: country.life_evaluation
    };
});

console.log(`✅ Converted ${Object.keys(enhancedItems).length} countries to game format`);

// Step 5: Replace countries category while preserving others
console.log('🔄 Integrating enhanced countries into game structure...');
gameData.categories.countries = {
    name: "Countries",
    icon: "🌍",
    prompts: enhancedPrompts,
    items: enhancedItems
};

// Step 6: Generate new data.js file
console.log('📝 Generating new data.js file...');
const newContent = `/**
 * Outrank Game Data - v2.3 Enhanced Countries
 * Updated: ${new Date().toISOString()}
 * Enhanced countries with 34 comprehensive indicators + preserved other categories
 * Countries: 40 (enhanced dataset)
 * Movies: ${Object.keys(gameData.categories.movies.items).length}
 * Total Categories: ${Object.keys(gameData.categories).length}
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

console.log('✅ Enhanced game data loaded with', Object.keys(window.GAME_DATA.categories).length, 'categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length);
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length);
`;

// Step 7: Write the enhanced file
fs.writeFileSync('data_enhanced.js', newContent);

console.log('\\n✅ Integration Complete!');
console.log('📁 Enhanced file: data_enhanced.js');
console.log('🌍 Countries: 40 (enhanced with 34 indicators)');
console.log('🎬 Movies: Preserved');
console.log('📊 Total prompts: Countries(' + enhancedPrompts.length + ') + Movies(' + gameData.categories.movies.prompts.length + ')');

console.log('\\n📋 Next Steps:');
console.log('1. Review data_enhanced.js');
console.log('2. Test: mv data_enhanced.js data.js');
console.log('3. Refresh browser and test all categories');
console.log('4. If issues: mv data_working_backup.js data.js');

// Show sample enhanced data
console.log('\\n📊 Sample Enhanced Country:');
const firstCountry = Object.values(enhancedItems)[0];
console.log(`   ${firstCountry.name}: GDP=${firstCountry.gdp_total}, Crime=${firstCountry.crime_index}, Pollution=${firstCountry.pollution_index}`);