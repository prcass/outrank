function updateScanScreen() {
    var scanInfo = '<div class="card-title">Scan Your Cards</div>' +
        '<div class="card-description">' + currentPrompt.label + '</div>' +
        '<p style="margin-top: 12px;">Bid Amount: ' + bidAmount + ' cards</p>' +
        '<p>Cards needed: ' + (bidAmount - scannedAnswers.length) + '</p>';
    
    if (blocks.length > 0) {
        scanInfo += '<p style="color: var(--error); margin-top: 8px;">⚠️ Blocked cards: ';
        blocks.forEach(function(block, index) {
            if (index > 0) scanInfo += ', ';
            scanInfo += block.cardId + ' (' + block.multiplier + '×)';
        });
        scanInfo += '</p>';
    }
    
    document.getElementById('scanInfo').innerHTML = scanInfo;
    
    var cardsList = '';
    scannedAnswers.forEach(function(cardId, index) {
        var country = SAMPLE_DATA.countries[cardId];
        cardsList += '<div class="card revealed">';
        cardsList += (index + 1) + '. ' + cardId + ' - ' + country.name;
        cardsList += '</div>';
    });
    document.getElementById('scannedCards').innerHTML = cardsList;
    
    // Show finish button when enough cards scanned
    document.getElementById('finishBtn').style.display = 
        (scannedAnswers.length >= bidAmount) ? 'block' : 'none';
}

function scanCard() {
    var input = document.getElementById('cardInput');
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
    var revealInfo = '<div class="card-title">' + currentPrompt.label + '</div>' +
        '<div class="card-description">Revealing your ranking step by step</div>';
    document.getElementById('revealInfo').innerHTML = revealInfo;
    
    // Update progress
    var progressPercent = Math.round((revealIndex / scannedAnswers.length) * 100);
    document.getElementById('revealProgress').textContent = revealIndex + ' of ' + scannedAnswers.length;
    document.getElementById('revealProgressBar').style.width = progressPercent + '%';
    
    var cardsHtml = '';
    scannedAnswers.forEach(function(cardId, index) {
        var country = SAMPLE_DATA.countries[cardId];
        var cardClass = 'card';
        var cardContent = (index + 1) + '. ???';
        
        if (index < revealIndex) {
            // This card has been revealed
            cardContent = (index + 1) + '. ' + country.name + '<br>' + getStatDisplay(country, currentPrompt.challenge);
            
            // Check if this is the failing card
            if (gameOver && !bidderWins && index === revealIndex - 1) {
                cardClass += ' wrong';
            } else {
                cardClass += ' revealed';
            }
        }
        
        cardsHtml += '<div class="' + cardClass + '">' + cardContent + '</div>';
    });
    
    document.getElementById('revealCards').innerHTML = cardsHtml;
    
    // Update reveal button
    var revealBtn = document.getElementById('revealBtn');
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
    
    // Check if this card is in wrong order (except first card)
    if (revealIndex > 0) {
        var previousCard = scannedAnswers[revealIndex - 1];
        
        if (isWrongOrder(currentCard, previousCard)) {
            // Wrong order - reveal as red and end game
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
                
                gameOverReason = 'Wrong order! ' + currentCountry.name + ' (' + currentValue + ') has higher ' + currentPrompt.challenge + ' than ' + previousCountry.name + ' (' + previousValue + '). Blockers win!';
                updateResultsScreen();
                showScreen('resultsScreen');
            }, 1500);
            return;
        }
    }
    
    // Card is correct - reveal as green
    revealIndex++;
    
    // Check if all cards revealed
    if (revealIndex >= scannedAnswers.length) {
        updateRevealScreen();
        setTimeout(function() {
            gameState = 'complete';
            bidderWins = true;
            gameOverReason = 'Perfect ranking! All cards in correct order. Bidder wins!';
            updateResultsScreen();
            showScreen('resultsScreen');
        }, 1000);
        return;
    }
    
    // Continue to next card
    updateRevealScreen();
}

function updateResultsScreen() {
    var title = bidderWins ? '🎉 Bidder Wins!' : '🚫 Blockers Win!';
    document.getElementById('resultsTitle').textContent = title;
    
    // Update header color based on result
    var header = document.getElementById('resultsHeader');
    if (bidderWins) {
        header.style.background = 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)';
    } else {
        header.style.background = 'linear-gradient(135deg, var(--error) 0%, #dc2626 100%)';
    }
    
    var content = '<div class="card-title">Final Results</div>' +
        '<div class="card-description">' + gameOverReason + '</div>';
    document.getElementById('resultsContent').innerHTML = content;
    
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
        
        rankingHtml += '<div class="' + cardClass + '">';
        rankingHtml += (index + 1) + '. ' + country.name + '<br>' + statDisplay;
        if (!isRevealed) rankingHtml += '<br>(Not revealed)';
        rankingHtml += '</div>';
    });
    
    document.getElementById('finalRanking').innerHTML = rankingHtml;
}

function resetGame() {
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
    
    showScreen('titleScreen');
}// Premium Know-It-All Game Logic
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
