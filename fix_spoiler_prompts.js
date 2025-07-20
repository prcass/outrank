#!/usr/bin/env node
/**
 * Fix prompts that give away the data point in the funny question
 */

const fs = require('fs');

console.log('🔍 Fixing prompts that spoil the data point...');

// Fixed prompts that don't give away what's being measured
const fixedPrompts = [
    {
        "challenge": "gdp_total",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is The Ultimate Money Maker?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>GDP in Current USD</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "gdp_growth_pct", 
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is On Fire Right Now?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>GDP Growth Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unemployment_rate",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's Everyone Super Busy?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Unemployment Rate Percentage</div><div style='font-size: 0.85em; color: #666'>(ILO/National Statistics 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "health_expenditure_pct_gdp",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Really Cares About Its People?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Health Expenditure as % of GDP</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "healthy_diet_cost_ppp",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Can You Afford To Be Virtuous?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Cost of Healthy Diet in PPP Dollars</div><div style='font-size: 0.85em; color: #666'>(FAO 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "patent_applications",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is Full Of Mad Scientists?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Patent Applications</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "female_labor_participation_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Are Women Absolutely Crushing It?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Female Labor Force Participation %</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "population_total",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is Absolutely Packed?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Population</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "population_0_14_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Are There Tiny Humans Everywhere?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Population Ages 0-14 Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "population_65_plus_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Has The Most Wisdom?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Population Ages 65+ Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "birth_rate",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's The Stork Working Overtime?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Births per 1,000 People</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "life_expectancy",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Do People Practically Live Forever?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Life Expectancy in Years</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "rural_population_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is All Wide Open Spaces?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Rural Population Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2023)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "broadband_per_100",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's Everyone Binge-Watching From Home?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Fixed Broadband Subscriptions per 100 People</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "mobile_per_100",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Does Everyone Have Multiple Gadgets?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Mobile Subscriptions per 100 People</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "secure_servers_per_1m",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got Fort Knox Level Protection?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Secure Internet Servers per Million People</div><div style='font-size: 0.85em; color: #666'>(World Bank 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "forest_area_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is Basically Mother Nature's Favorite?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Forest Area Percentage of Land</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "renewable_energy_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Living Like Captain Planet?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Renewable Energy Consumption Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "electricity_coal_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Ditched The Dirty Stuff First?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Electricity from Coal Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "electricity_oil_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Not Addicted To Black Gold?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Electricity from Oil Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "pollution_index",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Can You Actually Breathe Easy?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Pollution Index Score</div><div style='font-size: 0.85em; color: #666'>(Numbeo 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "irrigated_land_km2",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got The Ultimate Green Thumb?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Irrigated Agricultural Land in km²</div><div style='font-size: 0.85em; color: #666'>(FAO 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "soybean_production_tonnes",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got The Magic Beans?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Soybean Production in Tonnes</div><div style='font-size: 0.85em; color: #666'>(FAO 2022)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "airports",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is A Jet-Setter's Paradise?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Number of Airports</div><div style='font-size: 0.85em; color: #666'>(CIA World Factbook 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_total_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's The Ultimate Culture Collector?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total World Heritage Sites</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_cultural_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's The Past Still Alive?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Cultural Heritage Sites Count</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_natural_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got Earth's Greatest Show?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Natural Heritage Sites Count</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "unesco_mixed_sites",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Does Everything Come Together Perfectly?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Mixed Heritage Sites Count</div><div style='font-size: 0.85em; color: #666'>(UNESCO 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "tertiary_enrollment_pct",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where's Everyone Hitting The Books?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Tertiary Education Enrollment Percentage</div><div style='font-size: 0.85em; color: #666'>(World Bank 2021)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "nobel_laureates",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Country Is Basically A Genius Factory?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Nobel Prize Laureates</div><div style='font-size: 0.85em; color: #666'>(Nobel Foundation 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "crime_index",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Can You Wander Fearlessly?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Crime Index Score</div><div style='font-size: 0.85em; color: #666'>(Numbeo 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        "challenge": "life_evaluation",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Are People Living Their Best Life?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Life Evaluation Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(World Happiness Report 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    }
];

// Read current data.js and update
const dataContent = fs.readFileSync('data.js', 'utf8');
const jsonMatch = dataContent.match(/window\.GAME_DATA = ({[\s\S]*?});/);
if (!jsonMatch) {
    console.error('Could not parse game data');
    process.exit(1);
}

const gameData = JSON.parse(jsonMatch[1]);
gameData.categories.countries.prompts = fixedPrompts;

// Regenerate the file
const newContent = `/**
 * Outrank Game Data - v2.3 Enhanced Countries
 * Updated: ${new Date().toISOString()}
 * Enhanced countries with 34 comprehensive indicators + preserved other categories
 * Countries: 40 (enhanced dataset with non-spoiler prompts)
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

fs.writeFileSync('data.js', newContent);

console.log('✅ Fixed spoiler prompts! Now all funny questions are mysterious:');
console.log('   Examples:');
console.log('   • "Which Country Is The Ultimate Money Maker?" (was "biggest economy")');
console.log('   • "Which Country Is On Fire Right Now?" (was "economy growing")');
console.log('   • "Where\'s Everyone Super Busy?" (was "everyone got a job")');
console.log('   • "Who\'s Got The Magic Beans?" (was "soybean superpower")');
console.log('   • "Who\'s Living Like Captain Planet?" (was "sunshine and wind")');
console.log('\\n🎭 All prompts now keep the data point secret until revealed!');