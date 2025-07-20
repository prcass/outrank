#!/usr/bin/env node
/**
 * Format country prompts with multi-line centered display
 */

const fs = require('fs');

console.log('🎨 Formatting country prompts with multi-line display...');

// Define prompts with new multi-line format
const formattedPrompts = [
    {
        "challenge": "gdp_total",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country has the biggest economy?</div><div style='font-size: 0.9em; margin-bottom: 6px'>GDP in current USD</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "gdp_growth_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country's economy is growing like a rocket?</div><div style='font-size: 0.9em; margin-bottom: 6px'>GDP growth percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unemployment_rate",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's everyone got a job?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Unemployment rate percentage</div><div style='font-size: 0.85em; color: #666'>(ILO/National Statistics 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "health_expenditure_pct_gdp",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's spending big on keeping people healthy?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Health expenditure as % of GDP</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "healthy_diet_cost_ppp",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's eating healthy cheapest?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Cost of healthy diet in PPP dollars</div><div style='font-size: 0.85em; color: #666'>(FAO 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "patent_applications",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country's inventing everything?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Total patent applications</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "female_labor_participation_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where are women rocking the workforce?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Female labor force participation %</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "population_total",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country has the most people?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Total population</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "population_0_14_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where are there kids everywhere?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Population ages 0-14 percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "population_65_plus_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country has the most grandparents?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Population ages 65+ percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "birth_rate",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where are the baby booms happening?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Births per 1,000 people</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "life_expectancy",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where do people live forever?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Life expectancy in years</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "rural_population_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country is all countryside?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Rural population percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "broadband_per_100",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's got the best home internet game?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Fixed broadband subscriptions per 100 people</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "mobile_per_100",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where does everyone have 2 phones?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Mobile subscriptions per 100 people</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "secure_servers_per_1m",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's got Fort Knox internet security?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Secure internet servers per million people</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "forest_area_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country is basically one big forest?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Forest area percentage of land</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "renewable_energy_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who runs on sunshine and wind?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Renewable energy consumption percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "electricity_coal_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who ditched coal for electricity?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Electricity from coal percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "electricity_oil_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's not burning oil for power?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Electricity from oil percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "pollution_index",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's the air so fresh you could bottle it?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Pollution Index score</div><div style='font-size: 0.85em; color: #666'>(Numbeo 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "irrigated_land_km2",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's watering farms like crazy?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Irrigated agricultural land in km²</div><div style='font-size: 0.85em; color: #666'>(FAO 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "soybean_production_tonnes",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's the soybean superpower?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Soybean production in tonnes</div><div style='font-size: 0.85em; color: #666'>(FAO 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "airports",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country has airports everywhere?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Total number of airports</div><div style='font-size: 0.85em; color: #666'>(CIA World Factbook 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_total_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's hoarding all the UNESCO sites?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Total World Heritage sites</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_cultural_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's history around every corner?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Cultural heritage sites count</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_natural_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's got nature's greatest hits?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Natural heritage sites count</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_mixed_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where culture meets nature perfectly?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Mixed heritage sites count</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "tertiary_enrollment_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's everyone in college?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Tertiary education enrollment percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "nobel_laureates",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which country breeds genius?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Total Nobel Prize laureates</div><div style='font-size: 0.85em; color: #666'>(Nobel Foundation 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "crime_index",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where can you walk alone at midnight?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Crime Index score</div><div style='font-size: 0.85em; color: #666'>(Numbeo 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "life_evaluation",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where are people loving life most?</div><div style='font-size: 0.9em; margin-bottom: 6px'>Life evaluation score (0-10)</div><div style='font-size: 0.85em; color: #666'>(World Happiness Report 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
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
gameData.categories.countries.prompts = formattedPrompts;

// Regenerate the file with formatted prompts
const newContent = `/**
 * Outrank Game Data - v2.3 Enhanced Countries
 * Updated: ${new Date().toISOString()}
 * Enhanced countries with 34 comprehensive indicators + preserved other categories
 * Countries: 40 (enhanced dataset with formatted multi-line prompts)
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

console.log('✅ Formatted all country prompts with multi-line display');
console.log('   • Centered funny sentences (bold, larger)');
console.log('   • Data description (smaller font)');
console.log('   • Source and year (gray, parentheses)');
console.log('   • Ranking instructions (italic)');
console.log('\\n📋 Format structure:');
console.log('   Line 1: Fun question (bold, 1.1em)');
console.log('   Line 2: Data description (0.9em)');
console.log('   Line 3: (Source Year) (0.85em, gray)');
console.log('   Line 4: Rank instruction (0.9em, italic)');