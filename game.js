// Working Know-It-All Game Logic
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

// Player management with chip system
var players = {
    bidder: '',
    allPlayers: [],
    chips: {}
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

// Initialize chips for all players
function initializePlayerChips() {
    players.chips = {};
    players.allPlayers.forEach(function(playerName) {
        players.chips[playerName] = {
            3: true,
            5: true,
            7: true,
            score: 0,
            extra: {}
        };
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
                        (isAvailable ? drawnCards.map(function(cardId) {
                            return '<option value="' + cardId + '">' + cardId + '</option>';
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
    
    // Check if card is already blocked
    var existingBlock = blocks.find(function(block) {
        return block.cardId === cardId;
    });
    
    if (existingBlock) {
        alert('Card ' + cardId + ' is already blocked by ' + existingBlock.playerName);
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
    
    // Refresh the blocker screen
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
            scanInfoContent += block.cardId + ' (' + block.points + 'pts)';
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
                    players.chips[block.playerName].score += block.points;
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
            });
            
            if (chipsWon.length > 0) {
                gameOverReason += ' ' + players.bidder + ' wins: ' + chipsWon.join(', ') + '!';
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

// Test function for debugging
function testButton() {
    alert("JavaScript is working!");
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
    
    console.log("Event listeners setup complete");
});
