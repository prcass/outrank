// data.js - Complete game data with all 33 categories
console.log("Loading complete game data...");

// Game data structure
window.GAME_DATA = {
    // All 33 challenge prompts from your CSV
    prompts: [
        // Original challenges (keep working)
        { challenge: 'gdp', label: 'Rank these countries by GDP (highest to lowest)' },
        { challenge: 'population', label: 'Rank these countries by population (highest to lowest)' },
        { challenge: 'area', label: 'Rank these countries by area (largest to smallest)' },
        
        // Consumption & Lifestyle
        { challenge: 'coffee_consumption', label: 'Rank these countries by coffee consumption (highest to lowest)' },
        { challenge: 'chocolate_consumption', label: 'Rank these countries by chocolate consumption (highest to lowest)' },
        { challenge: 'wine_consumption', label: 'Rank these countries by wine consumption (highest to lowest)' },
        { challenge: 'mcdonalds_per_capita', label: 'Rank these countries by McDonald\'s per capita (highest to lowest)' },
        { challenge: 'sleep_hours', label: 'Rank these countries by average sleep hours (most to least)' },
        
        // Happiness & Work-Life Balance
        { challenge: 'happiness_ranking', label: 'Rank these countries by happiness (happiest to least happy)' },
        { challenge: 'vacation_days', label: 'Rank these countries by vacation days per year (most to least)' },
        { challenge: 'retirement_age', label: 'Rank these countries by retirement age (highest to lowest)' },
        { challenge: 'working_hours', label: 'Rank these countries by average working hours per week (most to least)' },
        
        // Technology & Digital Life
        { challenge: 'internet_penetration', label: 'Rank these countries by internet penetration rate (highest to lowest)' },
        { challenge: 'daily_internet_usage', label: 'Rank these countries by daily internet usage hours (most to least)' },
        { challenge: 'social_media_usage', label: 'Rank these countries by social media usage rate (highest to lowest)' },
        { challenge: 'digital_payment_adoption', label: 'Rank these countries by digital payment adoption (highest to lowest)' },
        { challenge: 'ev_adoption', label: 'Rank these countries by electric vehicle adoption (highest to lowest)' },
        { challenge: 'mobile_subscriptions', label: 'Rank these countries by mobile subscriptions per 100 people (highest to lowest)' },
        
        // Economics & Living Standards
        { challenge: 'cost_of_living', label: 'Rank these countries by cost of living index (highest to lowest)' },
        { challenge: 'big_mac_price', label: 'Rank these countries by Big Mac price (most to least expensive)' },
        { challenge: 'minimum_wage', label: 'Rank these countries by minimum wage (highest to lowest)' },
        
        // Achievements & Culture
        { challenge: 'nobel_prizes_per_capita', label: 'Rank these countries by Nobel Prizes per capita (highest to lowest)' },
        { challenge: 'olympic_medals_per_capita', label: 'Rank these countries by Olympic medals per capita (highest to lowest)' },
        { challenge: 'unesco_sites', label: 'Rank these countries by UNESCO World Heritage Sites (most to least)' },
        
        // Geography & Environment
        { challenge: 'population_density', label: 'Rank these countries by population density (highest to lowest)' },
        { challenge: 'average_temperature', label: 'Rank these countries by average temperature (hottest to coldest)' },
        { challenge: 'water_area_percent', label: 'Rank these countries by water area percentage (highest to lowest)' },
        { challenge: 'agricultural_land', label: 'Rank these countries by agricultural land percentage (highest to lowest)' },
        { challenge: 'forest_coverage', label: 'Rank these countries by forest coverage percentage (highest to lowest)' },
        { challenge: 'average_rainfall', label: 'Rank these countries by average rainfall (highest to lowest)' },
        { challenge: 'recycling_rate', label: 'Rank these countries by recycling rate (highest to lowest)' },
        
        // Demographics & Social
        { challenge: 'literacy_rate', label: 'Rank these countries by literacy rate (highest to lowest)' },
        { challenge: 'birth_rate', label: 'Rank these countries by birth rate (highest to lowest)' },
        { challenge: 'urban_population', label: 'Rank these countries by urban population percentage (highest to lowest)' },
        { challenge: 'life_expectancy', label: 'Rank these countries by life expectancy (highest to lowest)' }
    ],
    
    // Complete country data with all 33 metrics
    countries: {
        '001': { 
            name: 'United States',
            // Original data
            gdp: 21427700, population: 331002651, area: 9833517,
            // All CSV data
            coffee_consumption: 4.7, chocolate_consumption: 4.4, wine_consumption: 12.1, mcdonalds_per_capita: 39.8,
            sleep_hours: 7.2, happiness_ranking: 24, vacation_days: 12, retirement_age: 66, working_hours: 44.0,
            internet_penetration: 91.8, daily_internet_usage: 6.43, social_media_usage: 73, digital_payment_adoption: 89, ev_adoption: 9, mobile_subscriptions: 130,
            cost_of_living: 64.9, big_mac_price: 5.15, minimum_wage: 7.25,
            nobel_prizes_per_capita: 10.8, olympic_medals_per_capita: 32.1, unesco_sites: 26,
            population_density: 36, average_temperature: 8.5, water_area_percent: 6.76, agricultural_land: 44.9, forest_coverage: 33.9, average_rainfall: 715, recycling_rate: 32.1,
            literacy_rate: 99, birth_rate: 11.1, urban_population: 82.7, life_expectancy: 78.9
        },
        '002': { 
            name: 'China',
            gdp: 14342300, population: 1439323776, area: 9596961,
            coffee_consumption: 0.05, chocolate_consumption: 0.2, wine_consumption: 1.2, mcdonalds_per_capita: 4.8,
            sleep_hours: 6.7, happiness_ranking: 52, vacation_days: 15, retirement_age: 60, working_hours: 46.1,
            internet_penetration: 75.6, daily_internet_usage: 6.42, social_media_usage: 73, digital_payment_adoption: 86, ev_adoption: 35, mobile_subscriptions: 125,
            cost_of_living: 30.7, big_mac_price: 3.17, minimum_wage: 2.80,
            nobel_prizes_per_capita: 0.02, olympic_medals_per_capita: 2.2, unesco_sites: 59,
            population_density: 153, average_temperature: 8.2, water_area_percent: 2.67, agricultural_land: 54.8, forest_coverage: 23.3, average_rainfall: 645, recycling_rate: 20.2,
            literacy_rate: 96.8, birth_rate: 10.5, urban_population: 65.2, life_expectancy: 77.1
        },
        '003': { 
            name: 'Japan',
            gdp: 5081770, population: 125836021, area: 377975,
            coffee_consumption: 4.1, chocolate_consumption: 2.1, wine_consumption: 2.8, mcdonalds_per_capita: 23.8,
            sleep_hours: 6.2, happiness_ranking: 51, vacation_days: 18, retirement_age: 65, working_hours: 42.9,
            internet_penetration: 84.6, daily_internet_usage: 4.25, social_media_usage: 68, digital_payment_adoption: 32, ev_adoption: 3, mobile_subscriptions: 142,
            cost_of_living: 45.6, big_mac_price: 3.85, minimum_wage: 7.47,
            nobel_prizes_per_capita: 1.8, olympic_medals_per_capita: 20, unesco_sites: 25,
            population_density: 334, average_temperature: 15.4, water_area_percent: 1.39, agricultural_land: 12.2, forest_coverage: 68.5, average_rainfall: 1718, recycling_rate: 56.8,
            literacy_rate: 99, birth_rate: 6.8, urban_population: 91.8, life_expectancy: 84.4
        },
        '004': { 
            name: 'Germany',
            gdp: 3845630, population: 83783942, area: 357114,
            coffee_consumption: 7.4, chocolate_consumption: 8.8, wine_consumption: 27.6, mcdonalds_per_capita: 15.7,
            sleep_hours: 7, happiness_ranking: 24, vacation_days: 30, retirement_age: 65.8, working_hours: 35.3,
            internet_penetration: 94.7, daily_internet_usage: 5.25, social_media_usage: 78, digital_payment_adoption: 68, ev_adoption: 18.4, mobile_subscriptions: 129,
            cost_of_living: 58.4, big_mac_price: 5.32, minimum_wage: 12.41,
            nobel_prizes_per_capita: 13.4, olympic_medals_per_capita: 161.4, unesco_sites: 54,
            population_density: 240, average_temperature: 9.3, water_area_percent: 2.18, agricultural_land: 47.9, forest_coverage: 32.7, average_rainfall: 700, recycling_rate: 67.1,
            literacy_rate: 99, birth_rate: 9.5, urban_population: 77.5, life_expectancy: 81.2
        },
        '005': { 
            name: 'United Kingdom',
            gdp: 2829110, population: 67886011, area: 242495,
            coffee_consumption: 2.8, chocolate_consumption: 7.6, wine_consumption: 20.8, mcdonalds_per_capita: 21.3,
            sleep_hours: 7.1, happiness_ranking: 20, vacation_days: 25, retirement_age: 66, working_hours: 42.5,
            internet_penetration: 97.8, daily_internet_usage: 5.55, social_media_usage: 84.3, digital_payment_adoption: 71, ev_adoption: 16.5, mobile_subscriptions: 121,
            cost_of_living: 59.2, big_mac_price: 4.89, minimum_wage: 11.05,
            nobel_prizes_per_capita: 20, olympic_medals_per_capita: 121.6, unesco_sites: 35,
            population_density: 280, average_temperature: 9.8, water_area_percent: 1.34, agricultural_land: 70.2, forest_coverage: 13.1, average_rainfall: 1220, recycling_rate: 45.7,
            literacy_rate: 99, birth_rate: 10.9, urban_population: 84.2, life_expectancy: 81.8
        },
        '006': { 
            name: 'France',
            gdp: 2715520, population: 65273511, area: 551695,
            coffee_consumption: 5.4, chocolate_consumption: 6.3, wine_consumption: 46.9, mcdonalds_per_capita: 23.6,
            sleep_hours: 7.2, happiness_ranking: 27, vacation_days: 30, retirement_age: 64, working_hours: 35.6,
            internet_penetration: 92.3, daily_internet_usage: 5.4, social_media_usage: 78, digital_payment_adoption: 65, ev_adoption: 16.8, mobile_subscriptions: 110,
            cost_of_living: 58, big_mac_price: 5.78, minimum_wage: 11.65,
            nobel_prizes_per_capita: 10.6, olympic_medals_per_capita: 100.8, unesco_sites: 53,
            population_density: 119, average_temperature: 12.2, water_area_percent: 0.86, agricultural_land: 52.7, forest_coverage: 31.0, average_rainfall: 867, recycling_rate: 42.4,
            literacy_rate: 99, birth_rate: 10.9, urban_population: 81.5, life_expectancy: 82.7
        },
        '007': { 
            name: 'India',
            gdp: 2875140, population: 1380004385, area: 3287263,
            coffee_consumption: 0.09, chocolate_consumption: 0.2, wine_consumption: 0.005, mcdonalds_per_capita: 0.4,
            sleep_hours: 6.9, happiness_ranking: 126, vacation_days: 12, retirement_age: 60, working_hours: 48.7,
            internet_penetration: 43, daily_internet_usage: 4.9, social_media_usage: 32.2, digital_payment_adoption: 87, ev_adoption: 2, mobile_subscriptions: 85,
            cost_of_living: 19.5, big_mac_price: 2.23, minimum_wage: 0.28,
            nobel_prizes_per_capita: 0.05, olympic_medals_per_capita: 0.2, unesco_sites: 42,
            population_density: 492, average_temperature: 25.0, water_area_percent: 9.56, agricultural_land: 60.4, forest_coverage: 24.4, average_rainfall: 1083, recycling_rate: 6.0,
            literacy_rate: 74.4, birth_rate: 16.4, urban_population: 36.6, life_expectancy: 69.4
        },
        '008': { 
            name: 'Italy',
            gdp: 2001244, population: 60461826, area: 301340,
            coffee_consumption: 5.9, chocolate_consumption: 4, wine_consumption: 46.6, mcdonalds_per_capita: 12.7,
            sleep_hours: 6, happiness_ranking: 41, vacation_days: 28, retirement_age: 67, working_hours: 36.2,
            internet_penetration: 89.7, daily_internet_usage: 6.1, social_media_usage: 72, digital_payment_adoption: 56, ev_adoption: 4.2, mobile_subscriptions: 146,
            cost_of_living: 51, big_mac_price: 5.41, minimum_wage: 9.95,
            nobel_prizes_per_capita: 3, olympic_medals_per_capita: 85, unesco_sites: 60,
            population_density: 200, average_temperature: 13.9, water_area_percent: 2.39, agricultural_land: 47.1, forest_coverage: 31.8, average_rainfall: 832, recycling_rate: 51.4,
            literacy_rate: 99, birth_rate: 6.8, urban_population: 71.7, life_expectancy: 83.4
        },
        '009': { 
            name: 'Brazil',
            gdp: 1839758, population: 212559417, area: 8515767,
            coffee_consumption: 6.2, chocolate_consumption: 2.2, wine_consumption: 1.8, mcdonalds_per_capita: 5.2,
            sleep_hours: 7.1, happiness_ranking: 44, vacation_days: 20, retirement_age: 65, working_hours: 44.2,
            internet_penetration: 82.9, daily_internet_usage: 9.32, social_media_usage: 66.3, digital_payment_adoption: 76, ev_adoption: 4.5, mobile_subscriptions: 89,
            cost_of_living: 25.6, big_mac_price: 4.18, minimum_wage: 1.88,
            nobel_prizes_per_capita: 0.05, olympic_medals_per_capita: 8, unesco_sites: 24,
            population_density: 25, average_temperature: 25.5, water_area_percent: 0.65, agricultural_land: 33.8, forest_coverage: 59.9, average_rainfall: 1761, recycling_rate: 13.1,
            literacy_rate: 93.2, birth_rate: 13.6, urban_population: 87.6, life_expectancy: 75.9
        },
        '010': { 
            name: 'Canada',
            gdp: 1736426, population: 37742154, area: 9984670,
            coffee_consumption: 6.5, chocolate_consumption: 4.9, wine_consumption: 16.2, mcdonalds_per_capita: 36.4,
            sleep_hours: 7.3, happiness_ranking: 15, vacation_days: 19, retirement_age: 65, working_hours: 42.2,
            internet_penetration: 94.6, daily_internet_usage: 6.05, social_media_usage: 84, digital_payment_adoption: 79, ev_adoption: 11, mobile_subscriptions: 87,
            cost_of_living: 58.7, big_mac_price: 5.69, minimum_wage: 11.25,
            nobel_prizes_per_capita: 7.1, olympic_medals_per_capita: 75, unesco_sites: 21,
            population_density: 4, average_temperature: -5.4, water_area_percent: 11.76, agricultural_land: 6.9, forest_coverage: 38.7, average_rainfall: 537, recycling_rate: 26.8,
            literacy_rate: 99, birth_rate: 9.9, urban_population: 81.6, life_expectancy: 82.3
        }
    },
    
    // Helper functions for data
    getStatDisplay: function(country, challenge) {
        var value = country[challenge];
        if (typeof value === 'undefined') return 'Unknown';
        
        switch (challenge) {
            // Original challenges
            case 'gdp':
                return 'GDP: $' + value.toLocaleString() + 'M';
            case 'population':
                return 'Pop: ' + value.toLocaleString();
            case 'area':
                return 'Area: ' + value.toLocaleString() + ' km²';
                
            // Consumption & Lifestyle
            case 'coffee_consumption':
                return 'Coffee: ' + value + ' kg/year';
            case 'chocolate_consumption':
                return 'Chocolate: ' + value + ' kg/year';
            case 'wine_consumption':
                return 'Wine: ' + value + ' L/year';
            case 'mcdonalds_per_capita':
                return 'McDonald\'s: ' + value + ' per million';
            case 'sleep_hours':
                return 'Sleep: ' + value + ' hours/night';
                
            // Happiness & Work-Life
            case 'happiness_ranking':
                return 'Happiness Rank: #' + value;
            case 'vacation_days':
                return 'Vacation: ' + value + ' days/year';
            case 'retirement_age':
                return 'Retirement: ' + value + ' years';
            case 'working_hours':
                return 'Work: ' + value + ' hours/week';
                
            // Technology & Digital
            case 'internet_penetration':
                return 'Internet: ' + value + '%';
            case 'daily_internet_usage':
                return 'Internet: ' + value + ' hours/day';
            case 'social_media_usage':
                return 'Social Media: ' + value + '%';
            case 'digital_payment_adoption':
                return 'Digital Payment: ' + value + '%';
            case 'ev_adoption':
                return 'EV Adoption: ' + value + '%';
            case 'mobile_subscriptions':
                return 'Mobile: ' + value + ' per 100';
                
            // Economics
            case 'cost_of_living':
                return 'Cost of Living: ' + value + ' index';
            case 'big_mac_price':
                return 'Big Mac: $' + value;
            case 'minimum_wage':
                return 'Min Wage: $' + value + '/hour';
                
            // Achievements & Culture
            case 'nobel_prizes_per_capita':
                return 'Nobel: ' + value + ' per capita';
            case 'olympic_medals_per_capita':
                return 'Olympic: ' + value + ' per capita';
            case 'unesco_sites':
                return 'UNESCO Sites: ' + value;
                
            // Geography & Environment
            case 'population_density':
                return 'Density: ' + value + '/km²';
            case 'average_temperature':
                return 'Temp: ' + value + '°C';
            case 'water_area_percent':
                return 'Water: ' + value + '%';
            case 'agricultural_land':
                return 'Agriculture: ' + value + '%';
            case 'forest_coverage':
                return 'Forest: ' + value + '%';
            case 'average_rainfall':
                return 'Rainfall: ' + value + ' mm/year';
            case 'recycling_rate':
                return 'Recycling: ' + value + '%';
                
            // Demographics & Social
            case 'literacy_rate':
                return 'Literacy: ' + value + '%';
            case 'birth_rate':
                return 'Birth Rate: ' + value + ' per 1000';
            case 'urban_population':
                return 'Urban: ' + value + '%';
            case 'life_expectancy':
                return 'Life Exp: ' + value + ' years';
                
            default:
                return challenge + ': ' + value;
        }
    },
    
    // Logic for determining wrong order
    isWrongOrder: function(currentCountry, previousCountry, challenge) {
        var currentValue = currentCountry[challenge];
        var previousValue = previousCountry[challenge];
        
        // Special case: happiness_ranking (lower number = better)
        if (challenge === 'happiness_ranking') {
            return currentValue > previousValue;
        }
        
        // All other cases: higher number = better
        return currentValue > previousValue;
    },
    
    // Get random challenge
    getRandomChallenge: function() {
        var randomIndex = Math.floor(Math.random() * this.prompts.length);
        return this.prompts[randomIndex];
    },
    
    // Get all country IDs
    getAllCountryIds: function() {
        return Object.keys(this.countries);
    },
    
    // Get random countries for a game
    getRandomCountries: function(count) {
        var allIds = this.getAllCountryIds();
        var selected = [];
        
        while (selected.length < count && allIds.length > 0) {
            var randomIndex = Math.floor(Math.random() * allIds.length);
            var randomId = allIds[randomIndex];
            selected.push(randomId);
            allIds.splice(randomIndex, 1); // Remove to avoid duplicates
        }
        
        return selected;
    }

 // ... existing country data ...
    },
    
    // Add these functions here, BEFORE the closing };
    getRandomChallenge: function() {
        var randomIndex = Math.floor(Math.random() * this.prompts.length);
        return this.prompts[randomIndex];
    },
    
    getRandomCountries: function(count) {
        var allIds = Object.keys(this.countries);
        var selected = [];
        
        while (selected.length < count && allIds.length > 0) {
            var randomIndex = Math.floor(Math.random() * allIds.length);
            var randomId = allIds[randomIndex];
            selected.push(randomId);
            allIds.splice(randomIndex, 1);
        }
        
        return selected;
    },
    
    getStatDisplay: function(country, challenge) {
        var value = country[challenge];
        if (typeof value === 'undefined') return 'Unknown';
        
        switch (challenge) {
            case 'gdp': return 'GDP: $' + value.toLocaleString() + 'M';
            case 'population': return 'Pop: ' + value.toLocaleString();
            case 'area': return 'Area: ' + value.toLocaleString() + ' km²';
            case 'coffee_consumption': return 'Coffee: ' + value + ' kg/year';
            case 'chocolate_consumption': return 'Chocolate: ' + value + ' kg/year';
            case 'happiness_ranking': return 'Happiness Rank: #' + value;
            case 'life_expectancy': return 'Life Exp: ' + value + ' years';
            case 'internet_penetration': return 'Internet: ' + value + '%';
            case 'recycling_rate': return 'Recycling: ' + value + '%';
            default: return challenge + ': ' + value;
        }
    }
};  // This closing brace should be at the very end   


console.log("Complete game data loaded successfully!");
console.log("Available challenges:", window.GAME_DATA.prompts.length);
console.log("Available countries:", Object.keys(window.GAME_DATA.countries).length);
