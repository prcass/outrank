// game.js - Game logic using separated data

// Game state variables
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

// Player management
var players = {
    bidder: '',
    allPlayers: [],
    chips: {},
    scores: {},
    stats: {}
};
var playerCount = 1;
var currentRound = 1;


// Check if data is available
window.checkData = function() {
    if (window.GAME_DATA) {
        var countries = Object.keys(window.GAME_DATA.countries).length;
        var challenges = window.GAME_DATA.prompts.length;
        alert("Data loaded! " + countries + " countries, " + challenges + " challenges");
    } else {
        alert("ERROR: Game data not loaded!");
    }
};

// Screen switching function
window.showScreen = function(screenId) {
    
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    
    // Show target screen
    var target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    } else {
        // Screen not found
    }
};

// Simple demo game using the data
window.simulateQRScan = function() {
    
    // Check if data is available
    if (!window.GAME_DATA) {
        alert("ERROR: Game data not loaded! Make sure data.js is included.");
        return;
    }
    
    try {
        // Pick random challenge
        currentPrompt = window.GAME_DATA.getRandomChallenge();
        
        // Draw random countries
        drawnCards = window.GAME_DATA.getRandomCountries(5);
        
        // Show what we got
        var message = "Demo Game Started!\n\n";
        message += "Challenge: " + currentPrompt.label + "\n\n";
        message += "Countries drawn:\n";
        
        drawnCards.forEach(function(cardId, index) {
            var country = window.GAME_DATA.countries[cardId];
            var statDisplay = window.GAME_DATA.getStatDisplay(country, currentPrompt.challenge);
            message += (index + 1) + ". " + country.name + " - " + statDisplay + "\n";
        });
        
        alert(message);
        
    } catch (error) {
        alert("Demo error: " + error.message);
    }
};

// Real QR scan placeholder
window.startRealQRScan = function() {
    alert("QR scan feature coming soon! Use demo mode for now.");
};

// Player management functions
window.addPlayer = function() {
    playerCount++;
    
    var allPlayersElement = document.getElementById('allPlayers');
    if (allPlayersElement) {
        var playerHtml = '<div class="form-group" id="playerGroup' + playerCount + '">' +
            '<label>Player ' + playerCount + ':</label>' +
            '<input type="text" id="player' + playerCount + '" placeholder="Enter player name">' +
            '<button onclick="removePlayer(' + playerCount + ')">Remove</button>' +
            '</div>';
        allPlayersElement.insertAdjacentHTML('beforeend', playerHtml);
    } else {
        alert("Player added! (Element not found for visual update)");
    }
};

window.removePlayer = function(num) {
    var group = document.getElementById('playerGroup' + num);
    if (group) {
        group.remove();
    } else {
        alert("Remove player " + num + " clicked!");
    }
};

// Navigation functions
window.goToPlayerScreen = function() {
    showScreen('playerScreen');
};

window.goToScoresScreen = function() {
    showScreen('scoresScreen');
};

window.goBackHome = function() {
    showScreen('titleScreen');
};

// Button functions for different screens
window.startRoundWithBidder = function() {
    alert("Start round clicked! (Full game logic coming next)");
};

window.continueToScanning = function() {
    alert("Continue to scanning clicked!");
};

window.scanCard = function() {
    alert("Scan card clicked!");
};

window.revealNext = function() {
    alert("Reveal next clicked!");
};

window.nextRound = function() {
    alert("Next round clicked!");
};

window.newGame = function() {
    alert("New game clicked!");
    showScreen('titleScreen');
};

window.clearScores = function() {
    if (confirm("Clear all scores?")) {
        alert("Scores cleared!");
    }
};

// Initialize the page
function initPage() {
    
    // Wait a moment for data.js to load
    setTimeout(function() {
        // Check if data loaded
        if (!window.GAME_DATA) {
            alert("ERROR: Game data not available!");
        }
        
        // Show title screen
        showScreen('titleScreen');
    }, 200);
}

// Set up page when DOM loads
document.addEventListener('DOMContentLoaded', initPage);
window.addEventListener('load', initPage);
