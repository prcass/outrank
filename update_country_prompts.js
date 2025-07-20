#!/usr/bin/env node
/**
 * Update country prompts with funny sentences and source information
 */

const fs = require('fs');

console.log('🎯 Updating country prompts with enhanced descriptions...');

// Define enhanced prompts with funny sentences and source info
const enhancedPrompts = [
    {
        "challenge": "gdp_total",
        "label": "Which country has the biggest economy? Rank highest to lowest [World Bank 2023, GDP in current USD]"
    },
    {
        "challenge": "gdp_growth_pct",
        "label": "Which country's economy is growing like a rocket? Rank highest to lowest [World Bank 2023, GDP growth %]"
    },
    {
        "challenge": "unemployment_rate",
        "label": "Where's everyone got a job? Rank lowest to highest unemployment [ILO/National Statistics 2024, Unemployment rate %]"
    },
    {
        "challenge": "health_expenditure_pct_gdp",
        "label": "Who's spending big on keeping people healthy? Rank highest to lowest [World Bank 2021, Health expenditure % of GDP]"
    },
    {
        "challenge": "healthy_diet_cost_ppp",
        "label": "Where's eating healthy cheapest? Rank lowest to highest cost [FAO 2021, Cost in PPP dollars]"
    },
    {
        "challenge": "patent_applications",
        "label": "Which country's inventing everything? Rank highest to lowest [World Bank 2022, Total patent applications]"
    },
    {
        "challenge": "female_labor_participation_pct",
        "label": "Where are women rocking the workforce? Rank highest to lowest [World Bank 2023, Female labor force participation %]"
    },
    {
        "challenge": "population_total",
        "label": "Which country has the most people? Rank highest to lowest [World Bank 2023, Total population]"
    },
    {
        "challenge": "population_0_14_pct",
        "label": "Where are there kids everywhere? Rank highest to lowest [World Bank 2023, Population ages 0-14 %]"
    },
    {
        "challenge": "population_65_plus_pct",
        "label": "Which country has the most grandparents? Rank highest to lowest [World Bank 2023, Population ages 65+ %]"
    },
    {
        "challenge": "birth_rate",
        "label": "Where are the baby booms happening? Rank highest to lowest [World Bank 2022, Births per 1,000 people]"
    },
    {
        "challenge": "life_expectancy",
        "label": "Where do people live forever? Rank highest to lowest [World Bank 2022, Life expectancy in years]"
    },
    {
        "challenge": "rural_population_pct",
        "label": "Which country is all countryside? Rank highest to lowest [World Bank 2023, Rural population %]"
    },
    {
        "challenge": "broadband_per_100",
        "label": "Who's got the best home internet game? Rank highest to lowest [World Bank 2022, Fixed broadband per 100 people]"
    },
    {
        "challenge": "mobile_per_100",
        "label": "Where does everyone have 2 phones? Rank highest to lowest [World Bank 2022, Mobile subscriptions per 100]"
    },
    {
        "challenge": "secure_servers_per_1m",
        "label": "Who's got Fort Knox internet security? Rank highest to lowest [World Bank 2022, Secure servers per million]"
    },
    {
        "challenge": "forest_area_pct",
        "label": "Which country is basically one big forest? Rank highest to lowest [World Bank 2021, Forest area %]"
    },
    {
        "challenge": "renewable_energy_pct",
        "label": "Who runs on sunshine and wind? Rank highest to lowest [World Bank 2021, Renewable energy %]"
    },
    {
        "challenge": "electricity_coal_pct",
        "label": "Who ditched coal for electricity? Rank lowest to highest [World Bank 2021, Coal electricity %]"
    },
    {
        "challenge": "electricity_oil_pct",
        "label": "Who's not burning oil for power? Rank lowest to highest [World Bank 2021, Oil electricity %]"
    },
    {
        "challenge": "pollution_index",
        "label": "Where's the air so fresh you could bottle it? Rank lowest to highest [Numbeo 2025, Pollution Index]"
    },
    {
        "challenge": "irrigated_land_km2",
        "label": "Who's watering farms like crazy? Rank highest to lowest [FAO 2021, Irrigated land in km²]"
    },
    {
        "challenge": "soybean_production_tonnes",
        "label": "Who's the soybean superpower? Rank highest to lowest [FAO 2022, Soybean production in tonnes]"
    },
    {
        "challenge": "airports",
        "label": "Which country has airports everywhere? Rank highest to lowest [CIA World Factbook 2024, Total airports]"
    },
    {
        "challenge": "unesco_total_sites",
        "label": "Who's hoarding all the UNESCO sites? Rank highest to lowest [UNESCO 2024, Total World Heritage sites]"
    },
    {
        "challenge": "unesco_cultural_sites",
        "label": "Where's history around every corner? Rank highest to lowest [UNESCO 2024, Cultural heritage sites]"
    },
    {
        "challenge": "unesco_natural_sites",
        "label": "Who's got nature's greatest hits? Rank highest to lowest [UNESCO 2024, Natural heritage sites]"
    },
    {
        "challenge": "unesco_mixed_sites",
        "label": "Where culture meets nature perfectly? Rank highest to lowest [UNESCO 2024, Mixed heritage sites]"
    },
    {
        "challenge": "tertiary_enrollment_pct",
        "label": "Where's everyone in college? Rank highest to lowest [World Bank 2021, Tertiary enrollment %]"
    },
    {
        "challenge": "nobel_laureates",
        "label": "Which country breeds genius? Rank highest to lowest [Nobel Foundation 2024, Total Nobel laureates]"
    },
    {
        "challenge": "crime_index",
        "label": "Where can you walk alone at midnight? Rank lowest to highest [Numbeo 2025, Crime Index]"
    },
    {
        "challenge": "life_evaluation",
        "label": "Where are people loving life most? Rank highest to lowest [World Happiness Report 2024, Life evaluation score]"
    }
];

// Read current data.js
const dataContent = fs.readFileSync('data.js', 'utf8');

// Parse it by extracting just the JSON data
const jsonMatch = dataContent.match(/window\.GAME_DATA = ({[\s\S]*?});/);
if (!jsonMatch) {
    console.error('Could not parse game data');
    process.exit(1);
}

const gameData = JSON.parse(jsonMatch[1]);

// Update the prompts
gameData.categories.countries.prompts = enhancedPrompts;

// Regenerate the file with enhanced prompts
const newContent = `/**
 * Outrank Game Data - v2.3 Enhanced Countries
 * Updated: ${new Date().toISOString()}
 * Enhanced countries with 34 comprehensive indicators + preserved other categories
 * Countries: 40 (enhanced dataset with sources and dates)
 * Movies: ${Object.keys(gameData.categories.movies.items).length}
 * Total Categories: ${Object.keys(gameData.categories).length}
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Add missing methods back to GAME_DATA
window.GAME_DATA.getRandomChallenge = function(category = null) {
    if (category && this.categories[category]) {
        const prompts = this.categories[category].prompts;
        return prompts[Math.floor(Math.random() * prompts.length)];
    }
    
    // If no category specified, get from all categories
    const allCategories = Object.keys(this.categories);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    const prompts = this.categories[randomCategory].prompts;
    return prompts[Math.floor(Math.random() * prompts.length)];
};

window.GAME_DATA.getRandomCountries = function(count = 5) {
    const countryKeys = Object.keys(this.categories.countries.items);
    const shuffled = countryKeys.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Add backward compatibility properties
window.GAME_DATA.countries = window.GAME_DATA.categories.countries.items;
window.GAME_DATA.prompts = window.GAME_DATA.categories.countries.prompts;

console.log('✅ Outrank v2.3 Enhanced - Game data loaded with', Object.keys(window.GAME_DATA.categories).length, 'categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('⚽ Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'challenges');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories).reduce((sum, cat) => sum + Object.keys(window.GAME_DATA.categories[cat].items).length, 0));
console.log('🎯 Total challenges:', Object.keys(window.GAME_DATA.categories).reduce((sum, cat) => sum + window.GAME_DATA.categories[cat].prompts.length, 0));
`;

// Write the updated file
fs.writeFileSync('data.js', newContent);

console.log('✅ Updated all country prompts with:');
console.log('   • Fun, engaging descriptions');
console.log('   • Source attribution');
console.log('   • Year of data');
console.log('   • Specific metric being ranked');
console.log('\\n📋 Sample updated prompts:');
enhancedPrompts.slice(0, 3).forEach(p => {
    console.log(`   ${p.challenge}: "${p.label}"`);
});