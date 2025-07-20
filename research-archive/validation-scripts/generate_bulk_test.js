#!/usr/bin/env node

/**
 * Generate large-scale test data for bulk update demonstration
 */

const fs = require('fs');

// Generate test updates for many items
function generateBulkTestData() {
    const updates = {};
    
    // Generate updates for all countries (40 countries × 5 properties = 200 updates)
    const countries = ['USA', 'CHN', 'JPN', 'GER', 'GBR', 'FRA', 'IND', 'ITA', 'BRA', 'CAN', 
                     'RUS', 'KOR', 'AUS', 'ESP', 'MEX', 'IDN', 'NLD', 'SAU', 'TUR', 'TWN',
                     'BEL', 'ARG', 'IRL', 'ISR', 'THA', 'EGY', 'ZAF', 'POL', 'SWE', 'PHL',
                     'NGA', 'MYS', 'CHL', 'PER', 'BGD', 'VNM', 'GRC', 'PRT', 'NOR', 'NZL'];
    
    countries.forEach(country => {
        updates[country] = {
            "coffee_consumption": Math.round((Math.random() * 10 + 1) * 100) / 100,
            "happiness_ranking": Math.floor(Math.random() * 150 + 1),
            "life_expectancy": Math.round((Math.random() * 20 + 70) * 10) / 10,
            "internet_penetration": Math.round((Math.random() * 40 + 60) * 10) / 10,
            "population_density": Math.floor(Math.random() * 500 + 10)
        };
    });
    
    // Generate updates for movies (40 movies × 4 properties = 160 updates)
    const movies = ['AVATAR', 'TITANIC', 'AVENGERS_ENDGAME', 'STAR_WARS', 'JURASSIC_PARK',
                   'LION_KING', 'AVENGERS_INFINITY_WAR', 'FROZEN_2', 'BLACK_PANTHER', 'HARRY_POTTER_1',
                   'STAR_WARS_LAST_JEDI', 'ROGUE_ONE', 'BEAUTY_AND_BEAST', 'FINDING_DORY', 'STAR_WARS_FORCE_AWAKENS',
                   'INCREDIBLES_2', 'IRON_MAN_3', 'MINIONS', 'CAPTAIN_AMERICA_CIVIL_WAR', 'AQUAMAN',
                   'SPIDER_MAN_HOMECOMING', 'CAPTAIN_MARVEL', 'TRANSFORMERS_3', 'IRON_MAN', 'HARRY_POTTER_8',
                   'FROZEN', 'IRON_MAN_2', 'MINIONS_RISE_OF_GRU', 'CAPTAIN_AMERICA_WINTER_SOLDIER', 'DESPICABLE_ME_2',
                   'THOR_RAGNAROK', 'WONDER_WOMAN', 'DESPICABLE_ME_3', 'JURASSIC_WORLD_FALLEN_KINGDOM', 'GUARDIANS_2',
                   'SPIDER_MAN_2', 'FINDING_NEMO', 'SHREK_2', 'HARRY_POTTER_4', 'SPIDER_MAN_3'];
    
    movies.forEach(movie => {
        updates[movie] = {
            "imdb_rating": Math.round((Math.random() * 3 + 6) * 10) / 10,
            "box_office_gross": Math.round((Math.random() * 2000 + 500) * 10) / 10,
            "production_budget": Math.floor(Math.random() * 200 + 50),
            "runtime_minutes": Math.floor(Math.random() * 60 + 120)
        };
    });
    
    console.log(`Generated ${Object.keys(updates).length} items with multiple properties each`);
    
    // Calculate total updates
    let totalUpdates = 0;
    for (const item in updates) {
        totalUpdates += Object.keys(updates[item]).length;
    }
    
    console.log(`Total individual data points to update: ${totalUpdates}`);
    
    return updates;
}

// Generate and save the test data
const bulkUpdates = generateBulkTestData();
fs.writeFileSync('./bulk_test_updates.json', JSON.stringify(bulkUpdates, null, 2));

console.log('\n✅ Generated bulk_test_updates.json');
console.log('📊 This simulates receiving validated corrections from AI for hundreds of data points');
console.log('🚀 Run: node targeted_update.js bulk_test_updates.json');