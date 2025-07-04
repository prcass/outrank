// SUPER MINIMAL TEST - Your exact original code
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

// Sample Data - EXACTLY as you had it originally
var SAMPLE_DATA = {
    prompts: [
        { challenge: 'gdp', label: 'Rank these countries by GDP (highest to lowest)' },
        { challenge: 'population', label: 'Rank these countries by population (highest to lowest)' },
        { challenge: 'area', label: 'Rank these countries by area (largest to smallest)' }
    ],
    countries: {
        '001': { name: 'USA', gdp: 21427700, population: 331002651, area: 9833517 },
        '002': { name: 'China', gdp: 14342300, population: 1439323776, area: 9596961 },
        '003': { name: 'Japan', gdp: 5081770, population: 125836021, area: 377975 },
        '004': { name: 'Germany', gdp: 3845630, population: 83783942, area: 357114 },
        '005': { name: 'India', gdp: 2875140, population: 1380004385, area: 3287263 },
        '006': { name: 'UK', gdp: 2829110, population: 67886011, area: 242495 },
        '007': { name: 'France', gdp: 2715520, population: 65273511, area: 551695 },
        '008': { name: 'Italy', gdp: 2001244, population: 60461826, area: 301340 },
        '009': { name: 'Brazil', gdp: 1839758, population: 212559417, area: 8515767 },
        '010': { name: 'Canada', gdp: 1736426, population: 37742154, area: 9984670 }
    }
};

// Test function - ADD THIS to test if JS is working
function testButton() {
    alert("JavaScript is working! Original code restored.");
}

// All your original functions exactly as they were...
function showScreen(screenId) {
    console.log("Switching to screen:", screenId);
    
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function(screen) {
        screen.classList.remove('active');
    });
    
    var targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        console.log("Screen switched successfully to:", screenId);
    } else {
        console.error("Screen not found:", screenId);
    }
}

function getStatValue(country, challenge) {
    if (challenge === 'gdp') {
        return country.gdp.toLocaleString();
    } else if (challenge === 'population') {
        return country.population.toLocaleString();
    } else if (challenge === 'area') {
        return country.area.toLocaleString();
    }
    return 'Unknown';
}

function getStatDisplay(country, challenge) {
    if (challenge === 'gdp') {
        return 'GDP: $' + country.gdp.toLocaleString() + 'M';
    } else if (challenge === 'population') {
        return 'Pop: ' + country.population.toLocaleString();
    } else if (challenge === 'area') {
        return 'Area: ' + country.area.toLocaleString() + ' km²';
    }
    return 'Unknown';
}

function isWrongOrder(currentCardId, previousCardId) {
    var currentCountry = SAMPLE_DATA.countries[currentCardId];
    var previousCountry = SAMPLE_DATA.countries[previousCardId];
    var challenge = currentPrompt.challenge;
    
    if (challenge === 'gdp') {
        return currentCountry.gdp > previousCountry.gdp;
    } else if (challenge === 'population') {
        return currentCountry.population > previousCountry.population;
    } else if (challenge === 'area') {
        return currentCountry.area > previousCountry.area;
    }
    return false;
}

function simulateQRScan() {
    console.log("Starting QR scan simulation...");
    currentPrompt = SAMPLE_DATA.prompts[Math.floor(Math.random() * SAMPLE_DATA.prompts.length)];
    
    var allCardIds = Object.keys(SAMPLE_DATA.countries);
    drawnCards = [];
    while (drawnCards.length < 10) {
        var randomCard = allCardIds[Math.floor(Math.random() * allCardIds.length)];
        if (drawnCards.indexOf(randomCard) === -1) {
            drawnCards.push(randomCard);
        }
    }
    
    blocks = [];
    scannedAnswers = [];
    revealIndex = 0;
    gameOver = false;
    gameState = 'blocker';
    
    alert("Demo starting with challenge: " + currentPrompt.label);
    // For now, just show an alert instead of complex screen switching
}

// Minimal event setup
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - minimal setup");
    alert("Page loaded! Try clicking 'Quick Demo' button.");
});

// Just put a minimal console log to test
console.log("=== SUPER MINIMAL TEST LOADED ===");
