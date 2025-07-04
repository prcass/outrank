// Complete Know-It-All Game Logic with Full Dataset (All 33 Categories) - FIXED
console.log("JavaScript file loaded successfully!");

// Game State Variables
var currentPrompt = null;
var drawnCards = [];
var blocks = [];
var bidAmount = 3;
var scannedAnswers = [];
var revealIndex = 0;
var gameOver = false;
var gameState = 'title';
var bidderWins = false;
var gameOverReason = '';

// Player management with chip system and persistent scoring
var players = {
    bidder: '',
    allPlayers: [],
    chips: {},
    scores: {}, // Persistent scores across rounds
    stats: {}   // Win/loss statistics
};
var playerCount = 1;
var currentRound = 1;

// Complete Dataset with All 33 Categories
var SAMPLE_DATA = {
    prompts: [
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
        { challenge: 'land_area', label: 'Rank these countries by land area (largest to smallest)' },
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
    countries: {
        '001': { 
            name: 'United States',
            coffee_consumption: 4.7, chocolate_consumption: 4.4, wine_consumption: 12.1, mcdonalds_per_capita: 39.8,
            sleep_hours: 7.2, happiness_ranking: 24, vacation_days: 12, retirement_age: 66, working_hours: 44.0,
            internet_penetration: 91.8, daily_internet_usage: 6.43, social_media_usage: 73, digital_payment_adoption: 89, ev_adoption: 9, mobile_subscriptions: 130,
            cost_of_living: 64.9, big_mac_price: 5.15, minimum_wage: 7.25,
            nobel_prizes_per_capita: 10.8, olympic_medals_per_capita: 32.1, unesco_sites: 26,
            population_density: 36, average_temperature: 8.5, land_area: 9147420, water_area_percent: 6.76, agricultural_land: 44.9, forest_coverage: 33.9, average_rainfall: 715, recycling_rate: 32.1,
            literacy_rate: 99, birth_rate: 11.1, urban_population: 82.7, life_expectancy: 78.9
        },
        '002': { 
            name: 'China',
            coffee_consumption: 0.05, chocolate_consumption: 0.2, wine_consumption: 1.2, mcdonalds_per_capita: 4.8,
            sleep_hours: 6.7, happiness_ranking: 52, vacation_days: 15, retirement_age: 60, working_hours: 46.1,
            internet_penetration: 75.6, daily_internet_usage: 6.42, social_media_usage: 73, digital_payment_adoption: 86, ev_adoption: 35, mobile_subscriptions: 125,
            cost_of_living: 30.7, big_mac_price: 3.17, minimum_wage: 2.80,
            nobel_prizes_per_capita: 0.02, olympic_medals_per_capita: 2.2, unesco_sites: 59,
            population_density: 153, average_temperature: 8.2, land_area: 9388211, water_area_percent: 2.67, agricultural_land: 54.8, forest_coverage: 23.3, average_rainfall: 645, recycling_rate: 20.2,
            literacy_rate: 96.8, birth_rate: 10.5, urban_population: 65.2, life_expectancy: 77.1
        },
        '003': { 
            name: 'Japan',
            coffee_consumption: 4.1, chocolate_consumption: 2.1, wine_consumption: 2.8, mcdonalds_per_capita: 23.8,
            sleep_hours: 6.2, happiness_ranking: 51, vacation_days: 18, retirement_age: 65, working_hours: 42.9,
            internet_penetration: 84.6, daily_internet_usage: 4.25, social_media_usage: 68, digital_payment_adoption: 32, ev_adoption: 3, mobile_subscriptions: 142,
            cost_of_living: 45.6, big_mac_price: 3.85, minimum_wage: 7.47,
            nobel_prizes_per_capita: 1.8, olympic_medals_per_capita: 20, unesco_sites: 25,
            population_density: 334, average_temperature: 15.4, land_area: 364555, water_area_percent: 1.39, agricultural_land: 12.2, forest_coverage: 68.5, average_rainfall: 1718, recycling_rate: 56.8,
            literacy_rate: 99, birth_rate: 6.8, urban_population: 91.8, life_expectancy: 84.4
        },
        '004': { 
            name: 'Germany',
            coffee_consumption: 7.4, chocolate_consumption: 8.8, wine_consumption: 27.6, mcdonalds_per_capita: 15.7,
            sleep_hours: 7, happiness_ranking: 24, vacation_days: 30, retirement_age: 65.8, working_hours: 35.3,
            internet_penetration: 94.7, daily_internet_usage: 5.25, social_media_usage: 78, digital_payment_adoption: 68, ev_adoption: 18.4, mobile_subscriptions: 129,
            cost_of_living: 58.4, big_mac_price: 5.32, minimum_wage: 12.41,
            nobel_prizes_per_capita: 13.4, olympic_medals_per_capita: 161.4, unesco_sites: 54,
            population_density: 240, average_temperature: 9.3, land_area: 348560, water_area_percent: 2.18, agricultural_land: 47.9, forest_coverage: 32.7, average_rainfall: 700, recycling_rate: 67.1,
            literacy_rate: 99, birth_rate: 9.5, urban_population: 77.5, life_expectancy: 81.2
        },
        '005': { 
            name: 'United Kingdom',
            coffee_consumption: 2.8, chocolate_consumption: 7.6, wine_consumption: 20.8, mcdonalds_per_capita: 21.3,
            sleep_hours: 7.1, happiness_ranking: 20, vacation_days: 25, retirement_age: 66, working_hours: 42.5,
            internet_penetration: 97.8, daily_internet_usage: 5.55, social_media_usage: 84.3, digital_payment_adoption: 71, ev_adoption: 16.5, mobile_subscriptions: 121,
            cost_of_living: 59.2, big_mac_price: 4.89, minimum_wage: 11.05,
            nobel_prizes_per_capita: 20, olympic_medals_per_capita: 121.6, unesco_sites: 35,
            population_density: 280, average_temperature: 9.8, land_area: 241930, water_area_percent: 1.34, agricultural_land: 70.2, forest_coverage: 13.1, average_rainfall: 1220, recycling_rate: 45.7,
            literacy_rate: 99, birth_rate: 10.9, urban_population: 84.2, life_expectancy: 81.8
        },
        '006': { 
            name: 'France',
            coffee_consumption: 5.4, chocolate_consumption: 6.3, wine_consumption: 46.9, mcdonalds_per_capita: 23.6,
            sleep_hours: 7.2, happiness_ranking: 27, vacation_days: 30, retirement_age: 64, working_hours: 35.6,
            internet_penetration: 92.3, daily_internet_usage: 5.4, social_media_usage: 78, digital_payment_adoption: 65, ev_adoption: 16.8, mobile_subscriptions: 110,
            cost_of_living: 58, big_mac_price: 5.78, minimum_wage: 11.65,
            nobel_prizes_per_capita: 10.6, olympic_medals_per_capita: 100.8, unesco_sites: 53,
            population_density: 119, average_temperature: 12.2, land_area: 547557, water_area_percent: 0.86, agricultural_land: 52.7, forest_coverage: 31.0, average_rainfall: 867, recycling_rate: 42.4,
            literacy_rate: 99, birth_rate: 10.9, urban_population: 81.5, life_expectancy: 82.7
        },
        '007': { 
            name: 'India',
            coffee_consumption: 0.09, chocolate_consumption: 0.2, wine_consumption: 0.005, mcdonalds_per_capita: 0.4,
            sleep_hours: 6.9, happiness_ranking: 126, vacation_days: 12, retirement_age: 60, working_hours: 48.7,
            internet_penetration: 43, daily_internet_usage: 4.9, social_media_usage: 32.2, digital_payment_adoption: 87, ev_adoption: 2, mobile_subscriptions: 85,
            cost_of_living: 19.5, big_mac_price: 2.23, minimum_wage: 0.28,
            nobel_prizes_per_capita: 0.05, olympic_medals_per_capita: 0.2, unesco_sites: 42,
            population_density: 492, average_temperature: 25.0, land_area: 2973190, water_area_percent: 9.56, agricultural_land: 60.4, forest_coverage: 24.4, average_rainfall: 1083, recycling_rate: 6.0,
            literacy_rate: 74.4, birth_rate: 16.4, urban_population: 36.6, life_expectancy: 69.4
        },
        '008': { 
            name: 'Italy',
            coffee_consumption: 5.9, chocolate_consumption: 4, wine_consumption: 46.6, mcdonalds_per_capita: 12.7,
            sleep_hours: 6, happiness_ranking: 41, vacation_days: 28, retirement_age: 67, working_hours: 36.2,
            internet_penetration: 89.7, daily_internet_usage: 6.1, social_media_usage: 72, digital_payment_adoption: 56, ev_adoption: 4.2, mobile_subscriptions: 146,
            cost_of_living: 51, big_mac_price: 5.41, minimum_wage: 9.95,
            nobel_prizes_per_capita: 3, olympic_medals_per_capita: 85, unesco_sites: 60,
            population_density: 200, average_temperature: 13.9, land_area: 294140, water_area_percent: 2.39, agricultural_land: 47.1, forest_coverage: 31.8, average_rainfall: 832, recycling_rate: 51.4,
            literacy_rate: 99, birth_rate: 6.8, urban_population: 71.7, life_expectancy: 83.4
        },
        '009': { 
            name: 'Brazil',
            coffee_consumption: 6.2, chocolate_consumption: 2.2, wine_consumption: 1.8, mcdonalds_per_capita: 5.2,
            sleep_hours: 7.1, happiness_ranking: 44, vacation_days: 20, retirement_age: 65, working_hours: 44.2,
            internet_penetration: 82.9, daily_internet_usage: 9.32, social_media_usage: 66.3, digital_payment_adoption: 76, ev_adoption: 4.5, mobile_subscriptions: 89,
            cost_of_living: 25.6, big_mac_price: 4.18, minimum_wage: 1.88,
            nobel_prizes_per_capita: 0.05, olympic_medals_per_capita: 8, unesco_sites: 24,
            population_density: 25, average_temperature: 25.5, land_area: 8358140, water_area_percent: 0.65, agricultural_land: 33.8, forest_coverage: 59.9, average_rainfall: 1761, recycling_rate: 13.1,
            literacy_rate: 93.2, birth_rate: 13.6, urban_population: 87.6, life_expectancy: 75.9
        },
        '010': { 
            name: 'Canada',
            coffee_consumption: 6.5, chocolate_consumption: 4.9, wine_consumption: 16.2, mcdonalds_per_capita: 36.4,
            sleep_hours: 7.3, happiness_ranking: 15, vacation_days: 19, retirement_age: 65, working_hours: 42.2,
            internet_penetration: 94.6, daily_internet_usage: 6.05, social_media_usage: 84, digital_payment_adoption: 79, ev_adoption: 11, mobile_subscriptions: 87,
            cost_of_living: 58.7, big_mac_price: 5.69, minimum_wage: 11.25,
            nobel_prizes_per_capita: 7.1, olympic_medals_per_capita: 75, unesco_sites: 21,
            population_density: 4, average_temperature: -5.4, land_area: 9093510, water_area_percent: 11.76, agricultural_land: 6.9, forest_coverage: 38.7, average_rainfall: 537, recycling_rate: 26.8,
            literacy_rate: 99, birth_rate: 9.9, urban_population: 81.6, life_expectancy: 82.3
        }
    }
};

// Utility Functions
function showScreen(screenId) {
    console.log("Switching to screen:", screenId);
    
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function(screen) {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    var targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log("Screen switched successfully to:", screenId);
    } else {
        console.error("Screen not found:", screenId);
    }
}

function getStatValue(country, challenge) {
    var value = country[challenge];
    if (typeof value === 'number') {
        if (challenge === 'happiness_ranking') {
            return value; // Lower number = happier (ranking)
        }
        return value.toLocaleString();
    }
    return 'Unknown';
}

function getStatDisplay(country, challenge) {
    var value = country[challenge];
    if (typeof value === 'undefined') return 'Unknown';
    
    switch (challenge) {
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
        case 'happiness_ranking':
            return 'Happiness Rank: #' + value;
        case 'vacation_days':
            return 'Vacation: ' + value + ' days/year';
        case 'retirement_age':
            return 'Retirement: ' + value + ' years';
        case 'working_hours':
            return 'Work: ' + value + ' hours/week';
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
        case 'cost_of_living':
            return 'Cost of Living: ' + value + ' index';
        case 'big_mac_price':
            return 'Big Mac: $' + value;
        case 'minimum_wage':
            return 'Min Wage: $' + value + '/hour';
        case 'nobel_prizes_per_capita':
            return 'Nobel: ' + value + ' per capita';
        case 'olympic_medals_per_capita':
            return 'Olympic: ' + value + ' per capita';
        case 'unesco_sites':
            return 'UNESCO Sites: ' + value;
        case 'population_density':
            return 'Density: ' + value + '/km²';
        case 'average_temperature':
            return 'Temp: ' + value + '°C';
        case 'land_area':
            return 'Area: ' + value.toLocaleString() + ' km²';
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
        case 'literacy_rate':
            return 'Literacy: ' + value + '%';
        case 'birth_rate':
            return 'Birth Rate: ' + value + ' per 1000';
        case 'urban_population':
            return 'Urban: ' + value + '%';
        case 'life_expectancy':
            return 'Life Exp: ' + value + ' years';
        default:
            return value.toString();
    }
}

function isWrongOrder(currentCardId, previousCardId) {
    var currentCountry = SAMPLE_DATA.countries[currentCardId];
    var previousCountry = SAMPLE_DATA.countries[previousCardId];
    var challenge = currentPrompt.challenge;
    
    var currentValue = currentCountry[challenge];
    var previousValue = previousCountry[challenge];
    
    // Special case for happiness_ranking - lower number = better ranking
    if (challenge === 'happiness_ranking') {
        return currentValue > previousValue; // Wrong if current rank is higher (worse)
    }
    
    // For all other metrics, higher value = better ranking
    return currentValue > previousValue;
}

// Initialize chips and scoring for all players
function initializePlayerChips() {
    players.chips = {};
    players.allPlayers.forEach(function(playerName) {
        if (!players.chips[playerName]) {
            players.chips[playerName] = {
                3: true,
                5: true,
                7: true,
                extra: {}
            };
        }
        
        // Initialize scores if not exist
        if (!players.scores[playerName]) {
            players.scores[playerName] = 0;
        }
        
        // Initialize stats if not exist
        if (!players.stats[playerName]) {
            players.stats[playerName] = {
                gamesPlayed: 0,
                gamesWon: 0,
                roundsAsBidder: 0,
                successfulBids: 0,
                roundsAsBlocker: 0,
                successfulBlocks: 0,
                pointsFromBlocking: 0,
                chipsWon: 0
            };
        }
    });
}

// Main Game Functions
function simulateQRScan() {
    console.log("Starting QR scan simulation...");
    
    // Pick random challenge
    currentPrompt = SAMPLE_DATA.prompts[Math.floor(Math.random() * SAMPLE_DATA.prompts.length)];
    
    // Draw 10 random cards
    var allCardIds = Object.keys(SAMPLE_DATA.countries);
    drawnCards = [];
    while (drawnCards.length < 10) {
        var randomCard = allCardIds[Math.floor(Math.random() * allCardIds.length)];
        if (drawnCards.indexOf(randomCard) === -1) {
            drawnCards.push(randomCard);
        }
    }
    
    // Reset game state
    blocks = [];
    scannedAnswers = [];
    revealIndex = 0;
    gameOver = false;
    gameState = 'blocker';
    
    updateBlockerScreen();
    showScreen('blockerScreen');
}

function startRealQRScan() {
    alert('Real QR scanning coming soon! Use demo mode for now.');
}

// Player Management Functions
function addPlayer() {
    playerCount++;
    var allPlayersElement = document.getElementById('allPlayers');
    if (!allPlayersElement) {
        console.error('allPlayers element not found');
        return;
    }
    
    var playerHtml = '<div class="form-group" id="playerGroup' + playerCount + '">' +
        '<label>Player ' + playerCount + ':</label>' +
        '<input type="text" id="player' + playerCount + '" placeholder="Enter player name">' +
        '<button onclick="removePlayer(' + playerCount + ')" style="background: var(--error); color: white; border: none; padding: 8px 12px; border-radius: 6px; margin-left: 10px; cursor: pointer;">Remove</button>' +
        '</div>';
    
    allPlayersElement.insertAdjacentHTML('beforeend', playerHtml);
    
    // Add event listener to the new input
    setTimeout(function() {
        var newInput = document.getElementById('player' + playerCount);
        if (newInput) {
            newInput.addEventListener('input', function() {
                updateBidderDropdown();
                updateRoundSummary();
            });
        }
    }, 100);
    
    updateBidderDropdown();
    updateRoundSummary();
}

function removePlayer(playerNum) {
    var group = document.getElementById('playerGroup' + playerNum);
    if (group) {
        group.remove();
        updateBidderDropdown();
        updateRoundSummary();
    }
}

function updateBidderDropdown() {
    var bidderSelect = document.getElementById('bidderSelect');
    if (!bidderSelect) return;
    
    var currentSelection = bidderSelect.value;
    
    // Clear dropdown
    bidderSelect.innerHTML = '<option value="">Select the bidder...</option>';
    
    // Collect all player names
    var allPlayerNames = [];
    for (var i = 1; i <= playerCount; i++) {
        var playerInput = document.getElementById('player' + i);
        if (playerInput && playerInput.value.trim()) {
            allPlayerNames.push(playerInput.value.trim());
        }
    }
    
    // Add options to dropdown
    allPlayerNames.forEach(function(name) {
        var option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        if (name === currentSelection) {
            option.selected = true;
        }
        bidderSelect.appendChild(option);
    });
}

function updateRoundSummary() {
    var bidderSelect = document.getElementById('bidderSelect');
    var summaryDiv = document.getElementById('roundSummary');
    
    if (!bidderSelect || !summaryDiv) return;
    
    var bidderName = bidderSelect.value || 'Not selected';
    var allPlayerNames = [];
    
    // Collect all player names
    for (var i = 1; i <= playerCount; i++) {
        var playerInput = document.getElementById('player' + i);
        if (playerInput && playerInput.value.trim()) {
            allPlayerNames.push(playerInput.value.trim());
        }
    }
    
    var summary = '<strong>Round ' + currentRound + '</strong><br>';
    summary += '<strong>Bidder:</strong> ' + bidderName + '<br>';
    
    if (allPlayerNames.length > 1) {
        var otherPlayers = allPlayerNames.filter(function(name) {
            return name !== bidderName;
        });
        if (otherPlayers.length > 0) {
            summary += '<strong>Other players:</strong> ' + otherPlayers.join(', ');
        }
    } else if (allPlayerNames.length === 1) {
        summary += '<strong>Other players:</strong> None (single player mode)';
    } else {
        summary += '<strong>Other players:</strong> Add more players above';
    }
    
    summaryDiv.innerHTML = summary;
}

function startRoundWithBidder() {
    // Collect all player names
    var allPlayerNames = [];
    for (var i = 1; i <= playerCount; i++) {
        var playerInput = document.getElementById('player' + i);
        if (playerInput && playerInput.value.trim()) {
            allPlayerNames.push(playerInput.value.trim());
        }
    }
    
    if (allPlayerNames.length === 0) {
        alert('Please add at least one player');
        return;
    }
    
    var bidderSelect = document.getElementById('bidderSelect');
    var bidderName = bidderSelect ? bidderSelect.value : '';
    
    if (!bidderName) {
        alert('Please select who will be the bidder for this round');
        return;
    }
    
    // Store player information for this round
    players.bidder = bidderName;
    players.allPlayers = allPlayerNames;
    
    // Initialize chips if not already done
    if (!players.chips || Object.keys(players.chips).length === 0) {
        initializePlayerChips();
    }
    
    // Start the game
    simulateQRScan();
}

// Blocker Screen
function updateBlockerScreen() {
    var promptInfo = document.getElementById('promptInfo');
    var drawnCardsInfo = document.getElementById('drawnCardsInfo');
    var blockerSetup = document.getElementById('blockerSetup');
    
    if (!promptInfo || !drawnCardsInfo || !blockerSetup) {
        console.error('Required elements not found for blocker screen');
        alert('Blocker screen elements missing. Please check HTML structure.');
        return;
    }
    
    // Update prompt info
    promptInfo.innerHTML = 
        '<div class="card-title">' + currentPrompt.label + '</div>' +
        '<div class="card-description">Challenge: ' + currentPrompt.challenge.toUpperCase() + '</div>';
    
    // Hide drawn cards
    drawnCardsInfo.innerHTML = '';
    
    // Update blocker setup with chip system
    var blockerHtml = '<div class="section-header">' +
        '<div class="section-icon">🎯</div>' +
        '<div class="section-title">Place Chip Blocks</div>' +
        '</div>';
    
    // Show each player's available chips (excluding current bidder)
    var otherPlayers = players.allPlayers.filter(function(name) {
        return name !== players.bidder;
    });
    
    if (otherPlayers.length === 0) {
        blockerHtml += '<div class="action-card">' +
            '<div class="card-description">Single player mode - no blocks available</div>' +
            '</div>';
    } else {
        otherPlayers.forEach(function(playerName) {
            blockerHtml += '<div class="action-card" style="margin-bottom: 16px;">' +
                '<div class="card-title">' + playerName + '\'s Chips</div>' +
                '<div class="card-description">Place chips on cards to block the bidder</div>' +
                '<div style="margin-top: 16px;">';
            
            // Show available chips
            [3, 5, 7].forEach(function(points) {
                var isAvailable = players.chips[playerName] && players.chips[playerName][points];
                var chipStyle = isAvailable ? 
                    'background: var(--accent); color: white; cursor: pointer;' : 
                    'background: var(--outline); color: var(--on-surface-variant); cursor: not-allowed; opacity: 0.5;';
                
                blockerHtml += '<div style="display: inline-block; margin: 8px;">' +
                    '<div style="' + chipStyle + ' padding: 12px 16px; border-radius: 12px; text-align: center; font-weight: 600; min-width: 60px;">' +
                    points + ' pts' +
                    '</div>' +
                    (isAvailable ? 
                        '<div style="margin-top: 8px;">' +
                        '<select id="' + playerName + '_' + points + '_card" style="width: 100px; margin-right: 5px;">' +
                        '<option value="">Card...</option>' : '') +
                        (isAvailable ? drawnCards.filter(function(cardId) {
                            // Only show cards that aren't already blocked by someone else
                            return !blocks.some(function(block) {
                                return block.cardId === cardId;
                            });
                        }).map(function(cardId) {
                            var country = SAMPLE_DATA.countries[cardId];
                            return '<option value="' + cardId + '">' + cardId + ' - ' + country.name + '</option>';
                        }).join('') : '') +
                        (isAvailable ? '</select>' +
                        '<button onclick="placeChipBlock(\'' + playerName + '\', ' + points + ')" style="background: var(--primary); color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">Place</button>' +
                        '</div>' : '') +
                    '</div>';
            });
            
            blockerHtml += '</div></div>';
        });
    }
    
    // Show current blocks
    blockerHtml += '<div id="currentBlocks">' +
        '<div class="section-header">' +
        '<div class="section-icon">📋</div>' +
        '<div class="section-title">Placed Blocks</div>' +
        '</div>' +
        '<div id="blocksList">No blocks placed yet</div>' +
        '</div>';
    
    blockerSetup.innerHTML = blockerHtml;
    updateBlocksList();
}

function placeChipBlock(playerName, points) {
    var cardSelect = document.getElementById(playerName + '_' + points + '_card');
    if (!cardSelect) return;
    
    var cardId = cardSelect.value;
    
    if (!cardId) {
        alert('Please select a card to block');
        return;
    }
    
    // Check if card is already blocked by anyone
    var existingCardBlock = blocks.find(function(block) {
        return block.cardId === cardId;
    });
    
    if (existingCardBlock) {
        var country = SAMPLE_DATA.countries[cardId];
        alert(country.name + ' is already blocked by ' + existingCardBlock.playerName + '!');
        return;
    }
    
    // Check if this chip value is already on the table by anyone
    var existingChipBlock = blocks.find(function(block) {
        return block.points === points;
    });
    
    if (existingChipBlock) {
        alert('A ' + points + '-point chip is already on the table (used by ' + existingChipBlock.playerName + ')!');
        return;
    }
    
    // Check if player has this chip
    if (!players.chips[playerName] || !players.chips[playerName][points]) {
        alert(playerName + ' has already used their ' + points + '-point chip');
        return;
    }
    
    // Place the block
    blocks.push({ 
        cardId: cardId, 
        points: points, 
        playerName: playerName 
    });
    
    // Remove the chip from player's inventory
    players.chips[playerName][points] = false;
    
    // Reset select
    cardSelect.value = '';
    
    // Refresh the blocker screen to update all dropdowns and chip availability
    updateBlockerScreen();
}

function updateBlocksList() {
    var blocksList = document.getElementById('blocksList');
    if (!blocksList) return;
    
    if (blocks.length === 0) {
        blocksList.innerHTML = '<p style="color: var(--on-surface-variant); text-align: center;">No blocks placed yet</p>';
        return;
    }
    
    var blocksHtml = '';
    blocks.forEach(function(block, index) {
        var country = SAMPLE_DATA.countries[block.cardId];
        blocksHtml += '<div class="blocker-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 12px; border: 1px solid var(--outline); border-radius: 8px;">' +
            '<div>' +
            '<strong>' + block.cardId + ' - ' + country.name + '</strong>' +
            '<div style="font-size: 14px; color: var(--on-surface-variant);">' + block.playerName + ' placed ' + block.points + ' points</div>' +
            '</div>' +
            '<button onclick="removeChipBlock(' + index + ')" style="background: var(--error); color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">Remove</button>' +
            '</div>';
    });
    
    blocksList.innerHTML = blocksHtml;
}

function removeChipBlock(index) {
    var block = blocks[index];
    
    // Return the chip to the player
    if (players.chips[block.playerName]) {
        players.chips[block.playerName][block.points] = true;
    }
    
    // Remove the block
    blocks.splice(index, 1);
    
    // Refresh the blocker screen
    updateBlockerScreen();
}

function continueToScanning() {
    var bidAmountInput = document.getElementById('bidAmount');
    if (!bidAmountInput) {
        console.error('bidAmount input not found');
        return;
    }
    
    bidAmount = parseInt(bidAmountInput.value);
    if (bidAmount < 1 || bidAmount > 10) {
        alert('Bid amount must be between 1 and 10');
        return;
    }
    
    gameState = 'scanning';
    updateScanScreen();
    showScreen('scanScreen');
}

function updateScanScreen() {
    var scanInfo = document.getElementById('scanInfo');
    var scannedCards = document.getElementById('scannedCards');
    var finishBtn = document.getElementById('finishBtn');
    
    if (!scanInfo || !scannedCards || !finishBtn) {
        console.error('Required elements not found for scan screen');
        return;
    }
    
    var scanInfoContent = '<div class="card-title">Scan Your Cards</div>' +
        '<div class="card-description">' + currentPrompt.label + '</div>' +
        '<p style="margin-top: 12px; text-align: center;">Bid Amount: ' + bidAmount + ' cards</p>' +
        '<p style="text-align: center;">Cards needed: ' + (bidAmount - scannedAnswers.length) + '</p>';
    
    if (blocks.length > 0) {
        scanInfoContent += '<p style="color: var(--error); margin-top: 8px; text-align: center;">⚠️ Blocked cards: ';
        blocks.forEach(function(block, index) {
            if (index > 0) scanInfoContent += ', ';
            var country = SAMPLE_DATA.countries[block.cardId];
            scanInfoContent += country.name + ' (' + block.points + 'pts)';
        });
        scanInfoContent += '</p>';
    }
    
    scanInfo.innerHTML = scanInfoContent;
    
    var cardsList = '';
    scannedAnswers.forEach(function(cardId, index) {
        var country = SAMPLE_DATA.countries[cardId];
        cardsList += '<div class="card revealed" style="margin: 8px; display: inline-block;">';
        cardsList += (index + 1) + '. ' + cardId + ' - ' + country.name;
        cardsList += '</div>';
    });
    scannedCards.innerHTML = cardsList;
    
    // Show finish button when enough cards scanned
    finishBtn.style.display = (scannedAnswers.length >= bidAmount) ? 'block' : 'none';
}

function scanCard() {
    var input = document.getElementById('cardInput');
    if (!input) return;
    
    var cardId = input.value.trim();
    
    // Auto-format to 3 digits
    if (cardId.length === 1) cardId = '00' + cardId;
    if (cardId.length === 2) cardId = '0' + cardId;
    
    if (!SAMPLE_DATA.countries[cardId]) {
        alert('Invalid card ID: ' + cardId);
        return;
    }
    
    if (drawnCards.indexOf(cardId) === -1) {
        alert('Card ' + cardId + ' was not in the drawn cards!');
        return;
    }
    
    // Check if card is blocked
    var isBlocked = blocks.some(function(block) {
        return block.cardId === cardId;
    });
    
    if (isBlocked) {
        alert('Card ' + cardId + ' is blocked and cannot be chosen!');
        return;
    }
    
    if (scannedAnswers.indexOf(cardId) !== -1) {
        alert('Card ' + cardId + ' already scanned!');
        return;
    }
    
    if (scannedAnswers.length >= bidAmount) {
        alert('You have already scanned ' + bidAmount + ' cards!');
        return;
    }
    
    scannedAnswers.push(cardId);
    input.value = '';
    updateScanScreen();
}

function simulateAllCards() {
    // Get unblocked cards that haven't been scanned
    var unblocked = drawnCards.filter(function(cardId) {
        return !blocks.some(function(block) {
            return block.cardId === cardId;
        }) && scannedAnswers.indexOf(cardId) === -1;
    });
    
    // Fill remaining slots with random unblocked cards
    while (scannedAnswers.length < bidAmount && unblocked.length > 0) {
        var randomIndex = Math.floor(Math.random() * unblocked.length);
        var randomCard = unblocked[randomIndex];
        scannedAnswers.push(randomCard);
        unblocked.splice(randomIndex, 1);
    }
    
    updateScanScreen();
}

function finishScanning() {
    if (scannedAnswers.length < bidAmount) {
        alert('Please scan ' + bidAmount + ' cards first!');
        return;
    }
    
    revealIndex = 0;
    gameOver = false;
    gameState = 'reveal';
    updateRevealScreen();
    showScreen('revealScreen');
}

function updateRevealScreen() {
    var revealInfo = document.getElementById('revealInfo');
    var revealProgress = document.getElementById('revealProgress');
    var revealProgressBar = document.getElementById('revealProgressBar');
    var revealCards = document.getElementById('revealCards');
    var revealBtn = document.getElementById('revealBtn');
    
    if (!revealInfo || !revealProgress || !revealProgressBar || !revealCards || !revealBtn) {
        console.error('Required elements not found for reveal screen');
        return;
    }
    
    revealInfo.innerHTML = '<div class="card-title">' + currentPrompt.label + '</div>' +
        '<div class="card-description">Revealing your ranking step by step</div>';
    
    // Update progress
    var progressPercent = Math.round((revealIndex / scannedAnswers.length) * 100);
    revealProgress.textContent = revealIndex + ' of ' + scannedAnswers.length;
    revealProgressBar.style.width = progressPercent + '%';
    
    var cardsHtml = '';
    scannedAnswers.forEach(function(cardId, index) {
        var country = SAMPLE_DATA.countries[cardId];
        var cardClass = 'card';
        var cardContent = (index + 1) + '. ???';
        
        if (index < revealIndex) {
            cardContent = (index + 1) + '. ' + country.name + '<br>' + getStatDisplay(country, currentPrompt.challenge);
            
            if (gameOver && !bidderWins && index === revealIndex - 1) {
                cardClass += ' wrong';
            } else {
                cardClass += ' revealed';
            }
        }
        
        cardsHtml += '<div class="' + cardClass + '" style="margin: 8px; display: inline-block;">' + cardContent + '</div>';
    });
    
    revealCards.innerHTML = cardsHtml;
    
    // Update reveal button
    if (gameOver || revealIndex >= scannedAnswers.length) {
        revealBtn.style.display = 'none';
    } else {
        revealBtn.style.display = 'block';
        revealBtn.textContent = '▶️ Reveal Next Card (' + (revealIndex + 1) + '/' + scannedAnswers.length + ')';
    }
}

function revealNext() {
    if (gameOver || revealIndex >= scannedAnswers.length) {
        return;
    }
    
    var currentCard = scannedAnswers[revealIndex];
    
    // Check ordering (except for first card)
    if (revealIndex > 0) {
        var previousCard = scannedAnswers[revealIndex - 1];
        
        if (isWrongOrder(currentCard, previousCard)) {
            // Wrong order - bidder loses
            gameOver = true;
            bidderWins = false;
            revealIndex++;
            
            updateRevealScreen();
            
            setTimeout(function() {
                gameState = 'complete';
                var currentCountry = SAMPLE_DATA.countries[currentCard];
                var previousCountry = SAMPLE_DATA.countries[previousCard];
                var currentValue = getStatValue(currentCountry, currentPrompt.challenge);
                var previousValue = getStatValue(previousCountry, currentPrompt.challenge);
                
                gameOverReason = 'Wrong order! ' + currentCountry.name + ' (' + currentValue + ') has higher ' + currentPrompt.challenge + ' than ' + previousCountry.name + ' (' + previousValue + ').';
                
                // Bidder failed: All blockers get their chips back + points
                blocks.forEach(function(block) {
                    players.chips[block.playerName][block.points] = true;
                    players.scores[block.playerName] += block.points;
                    players.stats[block.playerName].pointsFromBlocking += block.points;
                    players.stats[block.playerName].successfulBlocks++;
                });
                
                // Update bidder stats
                players.stats[players.bidder].gamesPlayed++;
                players.stats[players.bidder].roundsAsBidder++;
                
                // Update blocker stats
                blocks.forEach(function(block) {
                    players.stats[block.playerName].gamesPlayed++;
                    players.stats[block.playerName].roundsAsBlocker++;
                });
                
                updateResultsScreen();
                showScreen('resultsScreen');
            }, 1500);
            return;
        }
    }
    
    // Card is correct
    revealIndex++;
    
    // Check if all cards revealed successfully
    if (revealIndex >= scannedAnswers.length) {
        updateRevealScreen();
        setTimeout(function() {
            gameState = 'complete';
            bidderWins = true;
            gameOverReason = 'Perfect ranking! All cards in correct order.';
            
            // Bidder succeeded: Bidder gets all the blocked chips
            var chipsWon = [];
            blocks.forEach(function(block) {
                if (!players.chips[players.bidder].extra[block.points]) {
                    players.chips[players.bidder].extra[block.points] = 0;
                }
                players.chips[players.bidder].extra[block.points]++;
                chipsWon.push(block.points + '-point chip from ' + block.playerName);
                players.stats[block.playerName].gamesPlayed++;
                players.stats[block.playerName].roundsAsBlocker++;
            });
            
            // Award points for successful bidding - just the bid amount
            var biddingPoints = bidAmount;
            players.scores[players.bidder] += biddingPoints;
            
            // Update bidder stats
            players.stats[players.bidder].gamesPlayed++;
            players.stats[players.bidder].roundsAsBidder++;
            players.stats[players.bidder].successfulBids++;
            players.stats[players.bidder].gamesWon++;
            players.stats[players.bidder].chipsWon += blocks.length;
            
            if (chipsWon.length > 0) {
                gameOverReason += ' ' + players.bidder + ' wins ' + biddingPoints + ' points and keeps ' + chipsWon.length + ' chips!';
            } else {
                gameOverReason += ' ' + players.bidder + ' wins ' + biddingPoints + ' points!';
            }
            
            updateResultsScreen();
            showScreen('resultsScreen');
        }, 1000);
        return;
    }
    
    updateRevealScreen();
}

function updateResultsScreen() {
    var resultsTitle = document.getElementById('resultsTitle');
    var resultsHeader = document.getElementById('resultsHeader');
    var resultsContent = document.getElementById('resultsContent');
    var finalRanking = document.getElementById('finalRanking');
    
    if (!resultsTitle || !resultsHeader || !resultsContent || !finalRanking) {
        console.error('Required elements not found for results screen');
        return;
    }
    
    var title = bidderWins ? '🎉 ' + players.bidder + ' Wins!' : '😞 ' + players.bidder + ' Loses!';
    resultsTitle.textContent = title;
    
    // Update header color
    if (bidderWins) {
        resultsHeader.style.background = 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)';
    } else {
        resultsHeader.style.background = 'linear-gradient(135deg, var(--error) 0%, #dc2626 100%)';
    }
    
    var content = '<div class="card-title">Round ' + currentRound + ' Results</div>' +
        '<div class="card-description">' + gameOverReason + '</div>';
    
    resultsContent.innerHTML = content;
    
    var rankingHtml = '';
    scannedAnswers.forEach(function(cardId, index) {
        var country = SAMPLE_DATA.countries[cardId];
        var statDisplay = getStatDisplay(country, currentPrompt.challenge);
        var isRevealed = index < revealIndex;
        var cardClass = 'card';
        
        if (isRevealed) {
            if (index === revealIndex - 1 && !bidderWins) {
                cardClass += ' wrong';
            } else {
                cardClass += ' revealed';
            }
        }
        
        rankingHtml += '<div class="' + cardClass + '" style="margin: 8px; display: inline-block;">';
        rankingHtml += (index + 1) + '. ' + country.name + '<br>' + statDisplay;
        if (!isRevealed) rankingHtml += '<br>(Not revealed)';
        rankingHtml += '</div>';
    });
    
    finalRanking.innerHTML = rankingHtml;
}

function resetGame() {
    // Reset basic game state
    currentPrompt = null;
    drawnCards = [];
    blocks = [];
    bidAmount = 3;
    scannedAnswers = [];
    revealIndex = 0;
    gameOver = false;
    gameState = 'title';
    bidderWins = false;
    gameOverReason = '';
    
    // Ask if they want to start a new round or change players
    if (players.allPlayers && players.allPlayers.length > 0) {
        var nextRound = confirm('Start Round ' + (currentRound + 1) + ' with the same players?\n\nClick OK to keep same players\nClick Cancel to change players');
        
        if (nextRound) {
            // Start next round with same players
            currentRound++;
            showScreen('playerScreen');
        } else {
            // Reset everything and go to title
            currentRound = 1;
            players = {
                bidder: '',
                allPlayers: [],
                chips: {}
            };
            playerCount = 1;
            showScreen('titleScreen');
        }
    } else {
        // No players set, go to title
        showScreen('titleScreen');
    }
}

function nextRound() {
    // Start next round with same players
    currentRound++;
    resetGame();
    showScreen('playerScreen');
}

function newGame() {
    // Reset everything including players
    currentRound = 1;
    players = {
        bidder: '',
        allPlayers: [],
        chips: {}
    };
    playerCount = 1;
    resetGame();
    showScreen('titleScreen');
}

// Scoring and statistics functions
function updateScoresScreen() {
    updateLeaderboard();
    updatePlayerStats();
    updateChipInventory();
}

function updateLeaderboard() {
    var leaderboard = document.getElementById('leaderboard');
    if (!leaderboard) return;
    
    if (Object.keys(players.scores).length === 0) {
        leaderboard.innerHTML = '<div class="no-scores-message">No games played yet!<br>Play some rounds to see the leaderboard.</div>';
        return;
    }
    
    // Sort players by score
    var sortedPlayers = Object.keys(players.scores).sort(function(a, b) {
        return players.scores[b] - players.scores[a];
    });
    
    var tableHtml = '<table class="scores-table">' +
        '<thead>' +
        '<tr>' +
        '<th class="rank">#</th>' +
        '<th>Player</th>' +
        '<th>Score</th>' +
        '<th>Win Rate</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>';
    
    sortedPlayers.forEach(function(playerName, index) {
        var rank = index + 1;
        var rankClass = '';
        if (rank === 1) rankClass = 'first';
        else if (rank === 2) rankClass = 'second';
        else if (rank === 3) rankClass = 'third';
        
        var gamesPlayed = players.stats[playerName] ? players.stats[playerName].gamesPlayed : 0;
        var gamesWon = players.stats[playerName] ? players.stats[playerName].gamesWon : 0;
        var winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
        
        tableHtml += '<tr>' +
            '<td class="rank ' + rankClass + '">' + rank + '</td>' +
            '<td><strong>' + playerName + '</strong></td>' +
            '<td>' + players.scores[playerName] + ' pts</td>' +
            '<td>' + winRate + '%</td>' +
            '</tr>';
    });
    
    tableHtml += '</tbody></table>';
    leaderboard.innerHTML = tableHtml;
}

function updatePlayerStats() {
    var playerStats = document.getElementById('playerStats');
    if (!playerStats) return;
    
    if (Object.keys(players.stats).length === 0) {
        playerStats.innerHTML = '<div class="no-scores-message">No statistics available yet!</div>';
        return;
    }
    
    var statsHtml = '';
    Object.keys(players.stats).forEach(function(playerName) {
        var stats = players.stats[playerName];
        var bidSuccessRate = stats.roundsAsBidder > 0 ? Math.round((stats.successfulBids / stats.roundsAsBidder) * 100) : 0;
        var blockSuccessRate = stats.roundsAsBlocker > 0 ? Math.round((stats.successfulBlocks / stats.roundsAsBlocker) * 100) : 0;
        
        statsHtml += '<div class="player-stat-item">' +
            '<div class="player-stat-name">' + playerName + '</div>' +
            '<div class="player-stat-value">' +
            'Games: ' + stats.gamesPlayed + ' | ' +
            'Bid Success: ' + bidSuccessRate + '% | ' +
            'Block Success: ' + blockSuccessRate + '%' +
            '</div>' +
            '</div>';
    });
    
    playerStats.innerHTML = statsHtml;
}

function updateChipInventory() {
    var chipInventory = document.getElementById('chipInventory');
    if (!chipInventory) return;
    
    if (Object.keys(players.chips).length === 0) {
        chipInventory.innerHTML = '<div class="no-scores-message">No chip data available!</div>';
        return;
    }
    
    var inventoryHtml = '';
    Object.keys(players.chips).forEach(function(playerName) {
        var chips = players.chips[playerName];
        
        inventoryHtml += '<div class="chip-inventory-item">' +
            '<div class="chip-inventory-player">' + playerName + '</div>' +
            '<div class="chip-inventory-chips">';
        
        // Show base chips
        [3, 5, 7].forEach(function(points) {
            if (chips[points]) {
                inventoryHtml += '<span class="chip-badge points-' + points + '">' + points + 'pt</span>';
            }
        });
        
        // Show extra chips
        if (chips.extra) {
            Object.keys(chips.extra).forEach(function(points) {
                var count = chips.extra[points];
                if (count > 0) {
                    inventoryHtml += '<span class="chip-badge points-' + points + '">+' + count + ' × ' + points + 'pt</span>';
                }
            });
        }
        
        inventoryHtml += '</div></div>';
    });
    
    chipInventory.innerHTML = inventoryHtml;
}

function clearScores() {
    var confirmed = confirm('Are you sure you want to clear all scores and statistics?\n\nThis cannot be undone!');
    if (confirmed) {
        // Reset all scoring data
        players.scores = {};
        players.stats = {};
        
        // Reset chips to defaults for current players
        if (players.allPlayers.length > 0) {
            initializePlayerChips();
        }
        
        // Update the scores screen
        updateScoresScreen();
        
        alert('All scores and statistics have been cleared!');
    }
}

// Initialize event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, setting up event listeners...");
    
    // Add event listeners for existing elements
    var bidderSelect = document.getElementById('bidderSelect');
    if (bidderSelect) {
        bidderSelect.addEventListener('change', updateRoundSummary);
    }
    
    var cardInput = document.getElementById('cardInput');
    if (cardInput) {
        cardInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                scanCard();
            }
        });
    }
    
    var bidAmountInput = document.getElementById('bidAmount');
    if (bidAmountInput) {
        bidAmountInput.value = bidAmount;
    }
    
    // Initialize first player input event listener
    var player1Input = document.getElementById('player1');
    if (player1Input) {
        player1Input.addEventListener('input', function() {
            updateBidderDropdown();
            updateRoundSummary();
        });
    }
    
    // Update scores screen if it's active
    var scoresScreen = document.getElementById('scoresScreen');
    if (scoresScreen && scoresScreen.classList.contains('active')) {
        updateScoresScreen();
    }
    
    console.log("Event listeners setup complete");
});

// Test function for debugging
function testButton() {
    alert("JavaScript is working!");
}
