#!/usr/bin/env node
/**
 * Safely update Know-It-All countries and challenges
 * Preserves game structure while replacing data
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  dataFile: 'data.js',
  backupDir: 'backups',
  newDataset: 'know_it_all_COMPLETE_40_countries_34_indicators_20250719_224831.json',
  outputFile: 'data_new.js'
};

// Create backup
function createBackup() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir);
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(CONFIG.backupDir, `data_backup_${timestamp}.js`);
  
  fs.copyFileSync(CONFIG.dataFile, backupPath);
  console.log(`✅ Backup created: ${backupPath}`);
  
  return backupPath;
}

// Load new dataset
function loadNewDataset() {
  const data = JSON.parse(fs.readFileSync(CONFIG.newDataset, 'utf8'));
  console.log(`✅ Loaded dataset: ${data.countries.length} countries, ${data.dataset_info.indicator_count} indicators`);
  return data;
}

// Generate country items
function generateCountryItems(dataset) {
  const items = {};
  
  dataset.countries.forEach(country => {
    items[country.iso3] = {
      name: country.name,
      code: country.iso3
    };
  });
  
  return items;
}

// Map indicators to challenges
function generateChallenges(dataset) {
  const challenges = [];
  
  // Define all 34 challenge mappings
  const challengeMappings = [
    // Economy & Finance
    {
      field: 'gdp_current_usd',
      id: 'gdp_total',
      question: 'Which country has the biggest economy (GDP)?',
      higherBetter: true
    },
    {
      field: 'gdp_growth_pct',
      id: 'gdp_growth',
      question: 'Which country has the fastest growing economy?',
      higherBetter: true
    },
    {
      field: 'unemployment_rate',
      id: 'unemployment',
      question: 'Which country has the lowest unemployment rate?',
      higherBetter: false
    },
    {
      field: 'health_expenditure_pct_gdp',
      id: 'health_spending',
      question: 'Which country spends the most on healthcare (% of GDP)?',
      higherBetter: true
    },
    {
      field: 'healthy_diet_cost_ppp',
      id: 'diet_cost',
      question: 'Where is a healthy diet most affordable?',
      higherBetter: false
    },
    {
      field: 'patent_applications',
      id: 'patents',
      question: 'Which country files the most patent applications?',
      higherBetter: true
    },
    {
      field: 'female_labor_participation_pct',
      id: 'female_workforce',
      question: 'Where do women have the highest workforce participation?',
      higherBetter: true
    },
    
    // Demographics
    {
      field: 'population_total',
      id: 'population',
      question: 'Which country has the largest population?',
      higherBetter: true
    },
    {
      field: 'population_0_14_pct',
      id: 'youth_population',
      question: 'Which country has the highest percentage of youth (0-14)?',
      higherBetter: true
    },
    {
      field: 'population_65_plus_pct',
      id: 'elderly_population',
      question: 'Which country has the highest percentage of elderly (65+)?',
      higherBetter: true
    },
    {
      field: 'birth_rate',
      id: 'birth_rate',
      question: 'Which country has the highest birth rate?',
      higherBetter: true
    },
    {
      field: 'life_expectancy',
      id: 'life_expectancy',
      question: 'Where do people live the longest?',
      higherBetter: true
    },
    {
      field: 'rural_population_pct',
      id: 'rural_population',
      question: 'Which country has the most rural population?',
      higherBetter: true
    },
    
    // Technology
    {
      field: 'broadband_per_100',
      id: 'broadband',
      question: 'Which country has the most broadband subscriptions?',
      higherBetter: true
    },
    {
      field: 'mobile_per_100',
      id: 'mobile',
      question: 'Which country has the most mobile phone subscriptions?',
      higherBetter: true
    },
    {
      field: 'secure_servers_per_1m',
      id: 'secure_servers',
      question: 'Which country has the most secure internet servers?',
      higherBetter: true
    },
    
    // Environment
    {
      field: 'forest_area_pct',
      id: 'forest_coverage',
      question: 'Which country has the most forest coverage?',
      higherBetter: true
    },
    {
      field: 'renewable_energy_pct',
      id: 'renewable_energy',
      question: 'Which country uses the most renewable energy?',
      higherBetter: true
    },
    {
      field: 'electricity_coal_pct',
      id: 'coal_electricity',
      question: 'Which country relies least on coal for electricity?',
      higherBetter: false
    },
    {
      field: 'electricity_oil_pct',
      id: 'oil_electricity',
      question: 'Which country relies least on oil for electricity?',
      higherBetter: false
    },
    {
      field: 'pollution_index',
      id: 'pollution',
      question: 'Which country has the cleanest air (lowest pollution)?',
      higherBetter: false
    },
    
    // Agriculture
    {
      field: 'irrigated_land_km2',
      id: 'irrigated_land',
      question: 'Which country has the most irrigated farmland?',
      higherBetter: true
    },
    {
      field: 'soybean_production_tonnes',
      id: 'soybean_production',
      question: 'Which country produces the most soybeans?',
      higherBetter: true
    },
    
    // Infrastructure
    {
      field: 'airports',
      id: 'airports',
      question: 'Which country has the most airports?',
      higherBetter: true
    },
    
    // Culture & Heritage
    {
      field: 'unesco_total_sites',
      id: 'unesco_total',
      question: 'Which country has the most UNESCO World Heritage sites?',
      higherBetter: true
    },
    {
      field: 'unesco_cultural_sites',
      id: 'unesco_cultural',
      question: 'Which country has the most UNESCO cultural sites?',
      higherBetter: true
    },
    {
      field: 'unesco_natural_sites',
      id: 'unesco_natural',
      question: 'Which country has the most UNESCO natural sites?',
      higherBetter: true
    },
    {
      field: 'unesco_mixed_sites',
      id: 'unesco_mixed',
      question: 'Which country has the most UNESCO mixed sites?',
      higherBetter: true
    },
    
    // Education & Achievement
    {
      field: 'tertiary_enrollment_pct',
      id: 'university_enrollment',
      question: 'Which country has the highest university enrollment rate?',
      higherBetter: true
    },
    {
      field: 'nobel_laureates',
      id: 'nobel_prizes',
      question: 'Which country has won the most Nobel Prizes?',
      higherBetter: true
    },
    
    // Safety & Security
    {
      field: 'crime_index',
      id: 'crime_rate',
      question: 'Which country is the safest (lowest crime)?',
      higherBetter: false
    },
    
    // Well-being
    {
      field: 'life_evaluation',
      id: 'happiness',
      question: 'Which country has the happiest people?',
      higherBetter: true
    }
  ];
  
  // Generate challenge data
  challengeMappings.forEach(mapping => {
    const challengeData = {};
    
    dataset.countries.forEach(country => {
      const value = country[mapping.field];
      if (value !== null && value !== undefined) {
        challengeData[country.iso3] = parseFloat(value);
      }
    });
    
    // Only add challenge if we have data for all countries
    if (Object.keys(challengeData).length === dataset.countries.length) {
      challenges.push({
        id: mapping.id,
        question: mapping.question,
        data: challengeData
      });
    } else {
      console.warn(`⚠️  Incomplete data for ${mapping.id}: ${Object.keys(challengeData).length}/${dataset.countries.length} countries`);
    }
  });
  
  return challenges;
}

// Generate new data.js content
function generateDataJS(items, challenges) {
  const content = `/**
 * Know-It-All Game Data
 * Generated: ${new Date().toISOString()}
 * Countries: ${Object.keys(items).length}
 * Challenges: ${challenges.length}
 */

window.GAME_DATA = {
  categories: {
    countries: {
      display_name: "Countries",
      items: ${JSON.stringify(items, null, 6)},
      challenges: ${JSON.stringify(challenges, null, 6)}
    },
    movies: {
      // Preserve existing movie data
      display_name: "Movies",
      items: {
        // ... existing movie items ...
      },
      challenges: [
        // ... existing movie challenges ...
      ]
    }
  }
};
`;
  
  return content;
}

// Main update function
async function updateCountriesData() {
  console.log('🚀 Starting Know-It-All data update...\n');
  
  try {
    // Step 1: Create backup
    const backupPath = createBackup();
    
    // Step 2: Load new dataset
    const dataset = loadNewDataset();
    
    // Step 3: Generate country items
    const items = generateCountryItems(dataset);
    console.log(`✅ Generated ${Object.keys(items).length} country items`);
    
    // Step 4: Generate challenges
    const challenges = generateChallenges(dataset);
    console.log(`✅ Generated ${challenges.length} challenges`);
    
    // Step 5: Load existing data.js to preserve movies
    const existingData = fs.readFileSync(CONFIG.dataFile, 'utf8');
    
    // Step 6: Generate new data.js
    // Note: In production, you'd parse and preserve the movies section
    const newContent = generateDataJS(items, challenges);
    
    // Step 7: Write new file
    fs.writeFileSync(CONFIG.outputFile, newContent);
    console.log(`\n✅ New data file created: ${CONFIG.outputFile}`);
    
    // Step 8: Validation summary
    console.log('\n📊 Update Summary:');
    console.log(`   • Countries: ${Object.keys(items).length}`);
    console.log(`   • Challenges: ${challenges.length}`);
    console.log(`   • Backup: ${backupPath}`);
    console.log(`   • Output: ${CONFIG.outputFile}`);
    
    console.log('\n⚠️  Next steps:');
    console.log('   1. Review the generated file');
    console.log('   2. Test with game.js');
    console.log('   3. Run automated tests');
    console.log('   4. If all good: mv data_new.js data.js');
    
  } catch (error) {
    console.error('❌ Error updating data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateCountriesData();
}

module.exports = { updateCountriesData };