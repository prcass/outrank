// data.js - All game data separated from logic
console.log("Loading game data...");

// Game data structure
window.GAME_DATA = {
    // Challenge prompts - start with original 3, easy to add more
    prompts: [
        { challenge: 'gdp', label: 'Rank these countries by GDP (highest to lowest)' },
        { challenge: 'population', label: 'Rank these countries by population (highest to lowest)' },
        { challenge: 'area', label: 'Rank these countries by area (largest to smallest)' },
        
        // Add a few from your CSV to test
        { challenge: 'coffee_consumption', label: 'Rank these countries by coffee consumption (highest to lowest)' },
        { challenge: 'happiness_ranking', label: 'Rank these countries by happiness (happiest to least happy)' },
        { challenge: 'life_expectancy', label: 'Rank these countries by life expectancy (highest to lowest)' }
    ],
    
    // Country data - combining original with your CSV data
    countries: {
        '001': { 
            name: 'USA',
            // Original data (keep working)
            gdp: 21427700, 
            population: 331002651, 
            area: 9833517,
            // New data from your CSV
            coffee_consumption: 4.7,
            happiness_ranking: 24,
            life_expectancy: 78.9,
            internet_penetration: 91.8,
            recycling_rate: 32.1
        },
        '002': { 
            name: 'China',
            gdp: 14342300, 
            population: 1439323776, 
            area: 9596961,
            coffee_consumption: 0.05,
            happiness_ranking: 52,
            life_expectancy: 77.1,
            internet_penetration: 75.6,
            recycling_rate: 20.2
        },
        '003': { 
            name: 'Japan',
            gdp: 5081770, 
            population: 125836021, 
            area: 377975,
            coffee_consumption: 4.1,
            happiness_ranking: 51,
            life_expectancy: 84.4,
            internet_penetration: 84.6,
            recycling_rate: 56.8
        },
        '004': { 
            name: 'Germany',
            gdp: 3845630, 
            population: 83783942, 
            area: 357114,
            coffee_consumption: 7.4,
            happiness_ranking: 24,
            life_expectancy: 81.2,
            internet_penetration: 94.7,
            recycling_rate: 67.1
        },
        '005': { 
            name: 'India',
            gdp: 2875140, 
            population: 1380004385, 
            area: 3287263,
            coffee_consumption: 0.09,
            happiness_ranking: 126,
            life_expectancy: 69.4,
            internet_penetration: 43,
            recycling_rate: 6.0
        },
        '006': { 
            name: 'UK',
            gdp: 2829110, 
            population: 67886011, 
            area: 242495,
            coffee_consumption: 2.8,
            happiness_ranking: 20,
            life_expectancy: 81.8,
            internet_penetration: 97.8,
            recycling_rate: 45.7
        },
        '007': { 
            name: 'France',
            gdp: 2715520, 
            population: 65273511, 
            area: 551695,
            coffee_consumption: 5.4,
            happiness_ranking: 27,
            life_expectancy: 82.7,
            internet_penetration: 92.3,
            recycling_rate: 42.4
        },
        '008': { 
            name: 'Italy',
            gdp: 2001244, 
            population: 60461826, 
            area: 301340,
            coffee_consumption: 5.9,
            happiness_ranking: 41,
            life_expectancy: 83.4,
            internet_penetration: 89.7,
            recycling_rate: 51.4
        },
        '009': { 
            name: 'Brazil',
            gdp: 1839758, 
            population: 212559417, 
            area: 8515767,
            coffee_consumption: 6.2,
            happiness_ranking: 44,
            life_expectancy: 75.9,
            internet_penetration: 82.9,
            recycling_rate: 13.1
        },
        '010': { 
            name: 'Canada',
            gdp: 1736426, 
            population: 37742154, 
            area: 9984670,
            coffee_consumption: 6.5,
            happiness_ranking: 15,
            life_expectancy: 82.3,
            internet_penetration: 94.6,
            recycling_rate: 26.8
        }
    },
    
    // Helper functions for data
    getStatDisplay: function(country, challenge) {
        var value = country[challenge];
        if (!value && value !== 0) return 'Unknown';
        
        switch (challenge) {
            case 'gdp':
                return 'GDP: $' + value.toLocaleString() + 'M';
            case 'population':
                return 'Pop: ' + value.toLocaleString();
            case 'area':
                return 'Area: ' + value.toLocaleString() + ' km²';
            case 'coffee_consumption':
                return 'Coffee: ' + value + ' kg/year';
            case 'happiness_ranking':
                return 'Happiness Rank: #' + value;
            case 'life_expectancy':
                return 'Life Expectancy: ' + value + ' years';
            case 'internet_penetration':
                return 'Internet: ' + value + '%';
            case 'recycling_rate':
                return 'Recycling: ' + value + '%';
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
};

console.log("Game data loaded successfully!");
console.log("Available challenges:", window.GAME_DATA.prompts.length);
console.log("Available countries:", Object.keys(window.GAME_DATA.countries).length);
