#!/usr/bin/env node
/**
 * Update Outrank game with new Know-It-All dataset
 * Converts our 40 countries and 34 indicators to Outrank format
 */

const fs = require('fs');

// Configuration
const CONFIG = {
  dataFile: 'data.js',
  newDataset: 'know_it_all_COMPLETE_40_countries_34_indicators_20250719_224831.json',
  outputFile: 'data_updated.js'
};

// Load and parse our new dataset
function loadNewDataset() {
  console.log('📊 Loading Know-It-All dataset...');
  const data = JSON.parse(fs.readFileSync(CONFIG.newDataset, 'utf8'));
  console.log(`✅ Loaded: ${data.countries.length} countries, ${data.dataset_info.indicator_count} indicators`);
  return data;
}

// Generate new prompts/challenges
function generatePrompts() {
  return [
    // Economy & Finance (7 challenges)
    {
      challenge: "gdp_total",
      label: "Which country has the biggest economy (GDP)? Rank highest to lowest"
    },
    {
      challenge: "gdp_growth",
      label: "Which country has the fastest growing economy? Rank highest to lowest"
    },
    {
      challenge: "unemployment_rate",
      label: "Which country has the lowest unemployment? Rank lowest to highest"
    },
    {
      challenge: "health_spending",
      label: "Which country spends the most on healthcare (% GDP)? Rank highest to lowest"
    },
    {
      challenge: "diet_cost",
      label: "Where is a healthy diet most affordable? Rank lowest to highest cost"
    },
    {
      challenge: "patents",
      label: "Which country files the most patents? Rank highest to lowest"
    },
    {
      challenge: "female_workforce",
      label: "Where do women have highest workforce participation? Rank highest to lowest"
    },
    
    // Demographics (6 challenges)
    {
      challenge: "population_total",
      label: "Which country has the most people? Rank highest to lowest"
    },
    {
      challenge: "youth_population",
      label: "Which country has the most kids (0-14)? Rank highest to lowest %"
    },
    {
      challenge: "elderly_population",
      label: "Which country has the most elderly (65+)? Rank highest to lowest %"
    },
    {
      challenge: "birth_rate",
      label: "Where are the most babies born? Rank highest to lowest birth rate"
    },
    {
      challenge: "life_expectancy",
      label: "Where do people live longest? Rank highest to lowest years"
    },
    {
      challenge: "rural_population",
      label: "Which country is most rural? Rank highest to lowest % rural"
    },
    
    // Technology (3 challenges)
    {
      challenge: "broadband",
      label: "Who has the most home internet? Rank highest to lowest broadband"
    },
    {
      challenge: "mobile_phones",
      label: "Where does everyone have phones? Rank highest to lowest mobile subs"
    },
    {
      challenge: "secure_servers",
      label: "Who has the most secure internet? Rank highest to lowest servers"
    },
    
    // Environment (6 challenges)
    {
      challenge: "forest_coverage",
      label: "Which country is basically one big forest? Rank highest to lowest %"
    },
    {
      challenge: "renewable_energy",
      label: "Who runs on clean energy? Rank highest to lowest renewable %"
    },
    {
      challenge: "coal_dependence",
      label: "Who uses the least coal? Rank lowest to highest coal electricity"
    },
    {
      challenge: "oil_dependence",
      label: "Who uses the least oil? Rank lowest to highest oil electricity"
    },
    {
      challenge: "air_quality",
      label: "Where's the cleanest air? Rank lowest to highest pollution index"
    },
    
    // Agriculture (2 challenges)
    {
      challenge: "irrigated_farming",
      label: "Who waters the most farmland? Rank highest to lowest irrigated land"
    },
    {
      challenge: "soybean_power",
      label: "Who's the soybean superpower? Rank highest to lowest production"
    },
    
    // Infrastructure (1 challenge)
    {
      challenge: "airports_everywhere",
      label: "Which country has airports everywhere? Rank highest to lowest count"
    },
    
    // Culture & Heritage (4 challenges)
    {
      challenge: "world_heritage",
      label: "Who's hoarding UNESCO sites? Rank highest to lowest total sites"
    },
    {
      challenge: "cultural_treasures",
      label: "Where are the most historic sites? Rank highest to lowest cultural"
    },
    {
      challenge: "natural_wonders",
      label: "Who has the most stunning nature? Rank highest to lowest natural"
    },
    {
      challenge: "mixed_heritage",
      label: "Where culture meets nature? Rank highest to lowest mixed sites"
    },
    
    // Education & Achievement (2 challenges)
    {
      challenge: "university_nation",
      label: "Where's everyone in college? Rank highest to lowest enrollment"
    },
    {
      challenge: "nobel_genius",
      label: "Which country breeds Nobel winners? Rank highest to lowest laureates"
    },
    
    // Safety & Security (1 challenge)
    {
      challenge: "safest_streets",
      label: "Where can you walk alone at night? Rank lowest to highest crime"
    },
    
    // Well-being (1 challenge)
    {
      challenge: "happiness_champions",
      label: "Where are people loving life most? Rank highest to lowest happiness"
    }
  ];
}

// Convert our dataset to Outrank country format
function generateCountries(dataset) {
  const countries = {};
  
  dataset.countries.forEach(country => {
    const iso3 = country.iso3;
    
    countries[iso3] = {
      name: country.name,
      
      // Economy & Finance
      gdp_total: country.gdp_current_usd ? parseInt(country.gdp_current_usd) : null,
      gdp_growth: country.gdp_growth_pct || null,
      unemployment_rate: country.unemployment_rate || null,
      health_spending: country.health_expenditure_pct_gdp || null,
      diet_cost: country.healthy_diet_cost_ppp || null,
      patents: country.patent_applications || null,
      female_workforce: country.female_labor_participation_pct || null,
      
      // Demographics
      population_total: country.population_total ? parseInt(country.population_total) : null,
      youth_population: country.population_0_14_pct || null,
      elderly_population: country.population_65_plus_pct || null,
      birth_rate: country.birth_rate || null,
      life_expectancy: country.life_expectancy || null,
      rural_population: country.rural_population_pct || null,
      
      // Technology
      broadband: country.broadband_per_100 || null,
      mobile_phones: country.mobile_per_100 || null,
      secure_servers: country.secure_servers_per_1m || null,
      
      // Environment
      forest_coverage: country.forest_area_pct || null,
      renewable_energy: country.renewable_energy_pct || null,
      coal_dependence: country.electricity_coal_pct || null,
      oil_dependence: country.electricity_oil_pct || null,
      air_quality: country.pollution_index || null,
      
      // Agriculture
      irrigated_farming: country.irrigated_land_km2 || null,
      soybean_power: country.soybean_production_tonnes || null,
      
      // Infrastructure
      airports_everywhere: country.airports || null,
      
      // Culture & Heritage
      world_heritage: country.unesco_total_sites || null,
      cultural_treasures: country.unesco_cultural_sites || null,
      natural_wonders: country.unesco_natural_sites || null,
      mixed_heritage: country.unesco_mixed_sites || null,
      
      // Education & Achievement
      university_nation: country.tertiary_enrollment_pct || null,
      nobel_genius: country.nobel_laureates || null,
      
      // Safety & Security
      safest_streets: country.crime_index || null,
      
      // Well-being
      happiness_champions: country.life_evaluation || null
    };
  });
  
  return countries;
}

// Read existing data.js to preserve structure
function readExistingData() {
  console.log('📖 Reading existing Outrank data structure...');
  const content = fs.readFileSync(CONFIG.dataFile, 'utf8');
  
  // Check if it has movies category to preserve
  const hasMovies = content.includes('"movies"');
  console.log(`📽️  Movies category detected: ${hasMovies ? 'Yes' : 'No'}`);
  
  return { hasMovies, content };
}

// Generate the new data.js content
function generateNewDataJS(prompts, countries, preserveMovies = false) {
  const timestamp = new Date().toISOString();
  
  let content = `/**
 * Outrank Game Data
 * Updated with Know-It-All dataset: ${timestamp}
 * Countries: ${Object.keys(countries).length}
 * Challenges: ${prompts.length}
 */

window.GAME_DATA = {
    prompts: [
`;

  // Add prompts
  prompts.forEach((prompt, index) => {
    const comma = index < prompts.length - 1 ? ',' : '';
    content += `        {
            challenge: "${prompt.challenge}",
            label: "${prompt.label}"
        }${comma}
`;
  });

  content += `    ],
    
    countries: {
`;

  // Add countries
  const countryKeys = Object.keys(countries);
  countryKeys.forEach((iso3, index) => {
    const country = countries[iso3];
    const comma = index < countryKeys.length - 1 ? ',' : '';
    
    content += `        "${iso3}": {
            name: "${country.name}"`;
    
    // Add all the data fields
    Object.keys(country).forEach(key => {
      if (key !== 'name' && country[key] !== null) {
        const value = typeof country[key] === 'string' ? `"${country[key]}"` : country[key];
        content += `,\n            ${key}: ${value}`;
      }
    });
    
    content += `\n        }${comma}
`;
  });

  content += `    }
};`;

  return content;
}

// Main update function
async function updateOutrankData() {
  console.log('🎮 Updating Outrank with Know-It-All Data');
  console.log('=' * 50);
  
  try {
    // Load new dataset
    const dataset = loadNewDataset();
    
    // Generate new prompts and countries
    console.log('🔄 Generating prompts...');
    const prompts = generatePrompts();
    
    console.log('🔄 Converting countries...');
    const countries = generateCountries(dataset);
    
    // Read existing structure
    const existing = readExistingData();
    
    // Generate new content
    console.log('📝 Generating new data.js...');
    const newContent = generateNewDataJS(prompts, countries, existing.hasMovies);
    
    // Write to output file
    fs.writeFileSync(CONFIG.outputFile, newContent);
    
    console.log(`\n✅ Update Complete!`);
    console.log(`📁 New file: ${CONFIG.outputFile}`);
    console.log(`🌍 Countries: ${Object.keys(countries).length}`);
    console.log(`🎯 Challenges: ${prompts.length}`);
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review the generated file');
    console.log('2. Test with a browser');
    console.log('3. If good: mv data_updated.js data.js');
    console.log('4. If issues: Use rollback_to_original.sh');
    
    // Show some sample data
    console.log('\n📊 Sample Countries:');
    Object.keys(countries).slice(0, 3).forEach(iso3 => {
      console.log(`   ${iso3}: ${countries[iso3].name}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating Outrank data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateOutrankData();
}

module.exports = { updateOutrankData };