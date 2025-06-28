// Premium Know-It-All Game Logic
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

// Utility Functions
function showScreen(screenId) {
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    screens.forEach(function(screen) {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    var targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
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

// Game Flow Functions
function simulateQRScan() {
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

function updateBlockerScreen() {
    // Update prompt info
    document.getElementById('promptInfo').innerHTML = 
        '<div class="card-title">' + currentPrompt.label + '</div>' +
        '<div class="card-description">Challenge: ' + currentPrompt.challenge.toUpperCase() + '</div>';
    
    // Update drawn cards display
    var cardsHtml = '';
    drawnCards.forEach(function(cardId) {
        var country = SAMPLE_DATA.countries[cardId];
        cardsHtml += '<span class="card">' + cardId + ' - ' + country.name + '</span>';
    });
    document.getElementById('drawnCardsInfo').innerHTML = cardsHtml;
    
    // Update blocker setup
    var blockerHtml = '<div class="section-header">' +
        '<div class="section-icon">🚫</div>' +
        '<div class="section-title">Add Blocks (Optional)</div>' +
        '</div>';
    
    drawnCards.forEach(function(cardId) {
        var country = SAMPLE_DATA.countries[cardId];
        blockerHtml += '<div class="blocker-item">';
        blockerHtml += '<input type="checkbox" id="block_' + cardId + '" onchange="toggleBlock(\'' + cardId + '\')">';
        blockerHtml += '<label for="block_' + cardId + '">' + cardId + ' - ' + country.name + '</label>';
        blockerHtml += '<select id="mult_' + cardId + '" style="margin-left: 10px;">';
        blockerHtml += '<option value="1">1×</option><option value="2">2×</option><option value="3">3×</option><option value="4">4×</option>';
        blockerHtml += '</select>';
        blockerHtml += '</div>';
    });
    
    document.getElementById('blockerSetup').innerHTML = blockerHtml;
}

function toggleBlock(cardId) {
    var checkbox = document.getElementById('block_' + cardId);
    var multiplier = parseInt(document.getElementById('mult_' + cardId).value);
    
    if (checkbox.checked) {
        blocks.push({ cardId: cardId, multiplier: multiplier });
    } else {
        blocks = blocks.filter(function(block) {
            return block.cardId !== cardId;
        });
    }
}

function continueToScanning() {
    bidAmount = parseInt(document.getElementById('bidAmount').value);
    if (bidAmount < 1 || bidAmount > 10) {
        alert('Bid amount must be between 1 and 10');
        return;
    }
    
    gameState = 'scanning';
    updateScanScreen();
    showScreen('scanScreen');
}

function updateScanScreen() {
    var scanInfo = '<div class="card-title">Scan Your Cards</div>' +
        '<div class="card-description">' + currentPrompt.label + '</div>' +
        '<p style="margin-top: 12px;">Bid Amount: ' + bidAmount + ' cards</p>' +
        '<p>Cards needed: ' + (bidAmount - scannedAnswers.length) + '</p>';
    
    if (blocks.length > 0) {
        scanInfo += '<p style="color: var(
