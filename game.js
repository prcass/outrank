// Fixed Visual Version - Focus on DOM and Screen Switching
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

// Sample Data
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

// Debug function to check DOM elements
function debugDOM() {
    console.log("=== DOM DEBUG ===");
    console.log("titleScreen:", document.getElementById('titleScreen'));
    console.log("playerScreen:", document.getElementById('playerScreen'));
    console.log("All screens:", document.querySelectorAll('.screen'));
    console.log("All buttons:", document.querySelectorAll('button'));
}

// Core function to show screens
function showScreen(screenId) {
    console.log("showScreen called with:", screenId);
    
    // Debug: Check if elements exist
    var allScreens = document.querySelectorAll('.screen');
    var targetScreen = document.getElementById(screenId);
    
    console.log("Found " + allScreens.length + " screens");
    console.log("Target screen (" + screenId + "):", targetScreen);
    
    if (allScreens.length === 0) {
        console.error("ERROR: No screens found! Check HTML structure.");
        return;
    }
    
    if (!targetScreen) {
        console.error("ERROR: Target screen '" + screenId + "' not found!");
        return;
    }
    
    // Hide all screens
    allScreens.forEach(function(screen, index) {
        console.log("Hiding screen " + index + ":", screen.id);
        screen.classList.remove('active');
    });
    
    // Show target screen
    targetScreen.classList.add('active');
    console.log("Activated screen:", screenId);
    
    // Double-check it worked
    setTimeout(function() {
        var isVisible = targetScreen.classList.contains('active');
        console.log("Screen " + screenId + " is now active:", isVisible);
    }, 100);
}

// Test functions that should work with buttons
function simulateQRScan() {
    console.log("simulateQRScan called!");
    alert("Demo game starting! (This proves the button click works)");
    
    // Pick random challenge
    currentPrompt = SAMPLE_DATA.prompts[Math.floor(Math.random() * SAMPLE_DATA.prompts.length)];
    console.log("Selected challenge:", currentPrompt.label);
    
    // For now, just alert instead of full game logic
    alert("Challenge: " + currentPrompt.label);
}

function startRealQRScan() {
    console.log("startRealQRScan called!");
    alert('Real QR scanning coming soon! Use demo mode for now.');
}

// Navigation functions
function goToPlayerScreen() {
    console.log("goToPlayerScreen called!");
    showScreen('playerScreen');
}

function goToScoresScreen() {
    console.log("goToScoresScreen called!");
    showScreen('scoresScreen');
}

function goToTitleScreen() {
    console.log("goToTitleScreen called!");
    showScreen('titleScreen');
}

// Simple player management for testing
function addPlayer() {
    console.log("addPlayer called!");
    alert("Add player function works!");
}

function removePlayer(num) {
    console.log("removePlayer called for player:", num);
    alert("Remove player " + num + " function works!");
}

// Test all screen switches
function testAllScreens() {
    console.log("Testing all screen switches...");
    
    var screens = ['titleScreen', 'playerScreen', 'blockerScreen', 'scanScreen', 'revealScreen', 'resultsScreen', 'scoresScreen'];
    var currentIndex = 0;
    
    function switchToNext() {
        if (currentIndex < screens.length) {
            var screenId = screens[currentIndex];
            console.log("Testing screen:", screenId);
            showScreen(screenId);
            currentIndex++;
            setTimeout(switchToNext, 1000);
        } else {
            console.log("All screens tested, returning to title");
            showScreen('titleScreen');
        }
    }
    
    switchToNext();
}

// Initialize the page properly
function initializePage() {
    console.log("=== INITIALIZING PAGE ===");
    
    // Debug DOM first
    debugDOM();
    
    // Make sure title screen is visible
    var titleScreen = document.getElementById('titleScreen');
    if (titleScreen) {
        console.log("Found title screen, making it active");
        showScreen('titleScreen');
    } else {
        console.error("CRITICAL: Title screen not found!");
        // Try to find any screen
        var anyScreen = document.querySelector('.screen');
        if (anyScreen) {
            console.log("Found a screen:", anyScreen.id);
            showScreen(anyScreen.id);
        } else {
            console.error("CRITICAL: No screens found at all!");
        }
    }
    
    // Test if we can find and interact with buttons
    var buttons = document.querySelectorAll('button');
    console.log("Found " + buttons.length + " buttons");
    
    // Add click listeners to buttons manually if needed
    buttons.forEach(function(button, index) {
        console.log("Button " + index + ":", button.textContent);
        
        // Add test click listener
        if (button.textContent.includes("Start Demo")) {
            button.addEventListener('click', simulateQRScan);
            console.log("Added demo listener to button");
        }
    });
}

// Make functions globally available for onclick handlers
window.showScreen = showScreen;
window.simulateQRScan = simulateQRScan;
window.startRealQRScan = startRealQRScan;
window.addPlayer = addPlayer;
window.removePlayer = removePlayer;
window.testAllScreens = testAllScreens;
window.debugDOM = debugDOM;

// Event listener for page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - starting initialization");
    
    // Wait a moment for everything to settle
    setTimeout(function() {
        initializePage();
    }, 100);
    
    // Also try immediate initialization
    initializePage();
});

// Also try initialization when window loads
window.addEventListener('load', function() {
    console.log("Window loaded - trying initialization again");
    initializePage();
});

console.log("=== FIXED VISUAL VERSION LOADED ===");

// Test function accessible from console
function testEverything() {
    console.log("=== TESTING EVERYTHING ===");
    debugDOM();
    showScreen('titleScreen');
    alert("Test complete! Check console for details.");
}

window.testEverything = testEverything;
