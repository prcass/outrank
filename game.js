// game.js - Game logic using separated data

// Game state variables
var currentPrompt = null;
var drawnCards = [];  // The 10 cards drawn
var blockedCards = [];  // Cards blocked by other players
var selectedCards = [];  // Cards selected by bidder
var bidAmount = 0;
var currentBid = 0;
var highestBidder = '';
var playerBids = {};  // Track each player's current bid
var passedPlayers = {};  // Track who has passed
var blockingTurn = 0;  // Current player's turn in blocking phase
var blockingOrder = [];  // Players in blocking order (lowest score first)
var usedBlockingTokens = {2: false, 4: false, 6: false};  // Track which token values are used
var revealIndex = 0;
var gameState = 'title';

// Player management
var players = {
    list: [],  // Array of player names
    scores: {},  // Player scores
    blockingTokens: {},  // Each player's blocking tokens {2: true, 4: true, 6: true}
    currentBlocks: {}  // Blocks placed this round {playerName: tokenValue}
};
var currentRound = 1;
var maxRounds = 6;
var winningScore = 30;


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
// Initialize player with blocking tokens
function initializePlayer(name) {
    players.scores[name] = 0;
    players.blockingTokens[name] = {2: true, 4: true, 6: true};
}

// Get players sorted by score (for blocking order)
function getPlayersByScore() {
    return players.list.slice().sort(function(a, b) {
        return players.scores[b] - players.scores[a];
    });
}

var nextPlayerNumber = 2; // Start at 2 since Player 1 already exists

window.addPlayer = function() {
    var allPlayersElement = document.getElementById('allPlayers');
    if (allPlayersElement) {
        var playerHtml = '<div class="form-group" id="playerGroup' + nextPlayerNumber + '">' +
            '<label>Player ' + nextPlayerNumber + ':</label>' +
            '<input type="text" id="player' + nextPlayerNumber + '" placeholder="Enter player name" oninput="updatePlayerCount()">' +
            '<button onclick="removePlayer(' + nextPlayerNumber + ')">Remove</button>' +
            '</div>';
        allPlayersElement.insertAdjacentHTML('beforeend', playerHtml);
        nextPlayerNumber++;
    }
    updatePlayerCount();
};

// Update the player count display
function updatePlayerCount() {
    var count = 0;
    var names = [];
    
    for (var i = 1; i < nextPlayerNumber; i++) {
        var input = document.getElementById('player' + i);
        if (input && input.value.trim()) {
            count++;
            names.push(input.value.trim());
        }
    }
    
    var playerCountElement = document.getElementById('playerCount');
    if (playerCountElement) {
        if (count === 0) {
            playerCountElement.textContent = 'Add players above';
        } else {
            playerCountElement.textContent = count + ' players: ' + names.join(', ');
        }
    }
}

window.removePlayer = function(num) {
    var group = document.getElementById('playerGroup' + num);
    if (group) {
        group.remove();
    }
    updatePlayerCount();
};

// Navigation functions
window.goToPlayerScreen = function() {
    showScreen('playerScreen');
    updatePlayerCount();
};

window.goToScoresScreen = function() {
    showScreen('scoresScreen');
};

window.goBackHome = function() {
    showScreen('titleScreen');
};

// Button functions for different screens
window.startRoundWithBidder = function() {
    // Collect all players
    players.list = [];
    for (var i = 1; i < nextPlayerNumber; i++) {
        var input = document.getElementById('player' + i);
        if (input && input.value.trim()) {
            var name = input.value.trim();
            players.list.push(name);
            if (!players.scores[name]) {
                initializePlayer(name);
            }
        }
    }
    
    // Validate we have at least 2 players
    if (players.list.length < 2) {
        alert('You need at least 2 players to start!');
        return;
    }
    
    // Draw challenge and cards
    currentPrompt = window.GAME_DATA.prompts[Math.floor(Math.random() * window.GAME_DATA.prompts.length)];
    drawnCards = [];
    var allCountries = Object.keys(window.GAME_DATA.countries);
    
    // Draw 10 random cards
    for (var i = 0; i < 10; i++) {
        var index = Math.floor(Math.random() * allCountries.length);
        drawnCards.push(allCountries[index]);
        allCountries.splice(index, 1);
    }
    
    // Reset round state
    blockedCards = [];
    selectedCards = [];
    players.currentBlocks = {};
    currentBid = 0;
    highestBidder = '';
    playerBids = {};
    passedPlayers = {};
    
    // Initialize bidding for all players
    players.list.forEach(function(playerName) {
        playerBids[playerName] = 0;
        passedPlayers[playerName] = false;
    });
    
    // Reset blocking state
    blockingTurn = 0;
    usedBlockingTokens = {2: false, 4: false, 6: false};
    
    // Navigate to bidding screen
    showBiddingScreen();
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

// Show bidding screen with challenge and cards
function showBiddingScreen() {
    // Update the challenge info
    var promptInfo = document.getElementById('promptInfo');
    if (promptInfo) {
        promptInfo.innerHTML = '<div class="card-title">' + currentPrompt.label + '</div>' +
                             '<div class="card-description">Players bid on how many they can rank correctly</div>';
    }
    
    // Show the drawn cards
    var cardsInfo = document.getElementById('drawnCardsInfo');
    if (cardsInfo) {
        var html = '<div class="form-card"><div class="section-header"><div class="section-icon">🎴</div>' +
                  '<div class="section-title">Available Cards</div></div><div class="cards-grid">';
        
        drawnCards.forEach(function(cardId, index) {
            var country = window.GAME_DATA.countries[cardId];
            html += '<div class="card-item">' + (index + 1) + '. ' + country.name + '</div>';
        });
        
        html += '</div></div>';
        cardsInfo.innerHTML = html;
    }
    
    // Generate player bidding interfaces
    generatePlayerBiddingInterface();
    
    // Update high bidder display
    updateHighBidderDisplay();
    
    showScreen('biddingScreen');
}

// Generate bidding interface for each player
function generatePlayerBiddingInterface() {
    var container = document.getElementById('playerBidding');
    if (!container) return;
    
    var html = '';
    players.list.forEach(function(playerName) {
        var isPassed = passedPlayers[playerName];
        var currentPlayerBid = playerBids[playerName];
        var statusClass = isPassed ? 'player-passed' : 'player-active';
        var statusText = isPassed ? 'PASSED' : 'Active';
        
        var isHighBidder = (playerName === highestBidder && currentBid > 0);
        var bidderClass = isHighBidder ? ' high-bidder-row' : '';
        var crownIcon = isHighBidder ? ' 👑' : '';
        
        html += '<div class="player-bid-row ' + statusClass + bidderClass + '" id="bidRow_' + playerName.replace(/\s/g, '_') + '">';
        html += '<div class="player-name">' + playerName + crownIcon + ' <span class="player-status">(' + statusText + ')</span></div>';
        
        if (!isPassed) {
            var nextBid = currentBid + 1;
            var canPass = !(isHighBidder && currentBid > 0); // High bidder cannot pass
            
            html += '<div class="bid-controls">';
            html += '<span class="current-bid">Current: ' + currentPlayerBid + '</span>';
            html += '<button class="btn small primary" onclick="placeBidForPlayer(\'' + playerName + '\')" style="margin: 0 5px;">Bid ' + nextBid + '</button>';
            
            if (canPass) {
                html += '<button class="btn small secondary" onclick="passPlayer(\'' + playerName + '\')" style="margin: 0 5px;">Pass</button>';
            } else {
                html += '<button class="btn small secondary disabled" disabled style="margin: 0 5px;">Can\'t Pass (High Bidder)</button>';
            }
            html += '</div>';
        } else {
            html += '<div class="bid-controls"><span class="passed-text">Passed out of bidding</span></div>';
        }
        
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// Update the high bidder display
function updateHighBidderDisplay() {
    var display = document.getElementById('highBidderDisplay');
    if (!display) return;
    
    if (currentBid === 0) {
        display.innerHTML = '<div class="high-bid-amount">No bids yet</div>' +
                          '<div class="high-bid-player">Waiting for first bid...</div>';
    } else {
        display.innerHTML = '<div class="high-bid-amount">' + currentBid + ' cards</div>' +
                          '<div class="high-bid-player">High bidder: ' + highestBidder + '</div>';
    }
}

// Bidding Phase Functions
window.placeBidForPlayer = function(playerName) {
    if (passedPlayers[playerName]) {
        alert(playerName + ' has already passed and cannot bid.');
        return;
    }
    
    var newBid = currentBid + 1;
    
    if (newBid > 10) {
        alert('Maximum bid is 10 cards');
        return;
    }
    
    // Update bid tracking
    currentBid = newBid;
    highestBidder = playerName;
    playerBids[playerName] = newBid;
    
    // Refresh the interface
    generatePlayerBiddingInterface();
    updateHighBidderDisplay();
};

window.passPlayer = function(playerName) {
    if (passedPlayers[playerName]) {
        return; // Already passed
    }
    
    // High bidder cannot pass
    if (playerName === highestBidder && currentBid > 0) {
        alert('The high bidder cannot pass! You must either bid higher or wait for others to outbid you.');
        return;
    }
    
    passedPlayers[playerName] = true;
    
    // Check if bidding should end
    var activePlayers = players.list.filter(function(name) {
        return !passedPlayers[name];
    });
    
    if (activePlayers.length <= 1) {
        if (currentBid === 0) {
            alert('All players passed! Someone must make a bid.');
            // Reset all passes to restart bidding
            players.list.forEach(function(name) {
                passedPlayers[name] = false;
            });
        } else {
            alert('Bidding complete! ' + highestBidder + ' wins with a bid of ' + currentBid + ' cards.');
            // Auto-finish bidding
            setTimeout(function() {
                finishBidding();
            }, 2000);
        }
    }
    
    // Refresh the interface
    generatePlayerBiddingInterface();
};

window.finishBidding = function() {
    if (currentBid === 0) {
        alert('Someone must place a bid before continuing!');
        return;
    }
    
    var activePlayers = players.list.filter(function(name) {
        return !passedPlayers[name];
    });
    
    if (activePlayers.length > 1) {
        alert('Bidding is not complete! Players still need to bid or pass: ' + activePlayers.join(', '));
        return;
    }
    
    // Move to blocking phase
    showBlockingScreen();
};

// Blocking Phase Functions
function showBlockingScreen() {
    // Set up blocking order (lowest score first, excluding the bidder)
    blockingOrder = getPlayersByScore().filter(function(name) {
        return name !== highestBidder;
    }).reverse(); // Reverse to get lowest score first
    
    blockingTurn = 0;
    
    // Update display
    updateBlockingDisplay();
    
    showScreen('blockingScreen');
}

function updateBlockingDisplay() {
    var blockingInfo = document.getElementById('blockingInfo');
    if (blockingInfo) {
        var currentBlocker = blockingTurn < blockingOrder.length ? blockingOrder[blockingTurn] : null;
        var turnText = currentBlocker ? currentBlocker + '\'s turn to block' : 'All players have had their turn';
        
        blockingInfo.innerHTML = '<div class="card-title">' + currentPrompt.label + '</div>' +
                               '<div class="card-description">' + highestBidder + ' bid ' + currentBid + ' cards</div>' +
                               '<div class="turn-indicator">' + turnText + '</div>';
    }
    
    // Show available cards for blocking
    var availableCards = document.getElementById('availableCards');
    if (availableCards) {
        var html = '<div class="form-card"><div class="section-header"><div class="section-icon">🚫</div>' +
                  '<div class="section-title">Cards Available to Block (' + (drawnCards.length - blockedCards.length) + ' remaining)</div></div><div class="cards-grid">';
        
        drawnCards.forEach(function(cardId, index) {
            var country = window.GAME_DATA.countries[cardId];
            var isBlocked = blockedCards.includes(cardId);
            var blockClass = isBlocked ? 'card-blocked' : 'card-available';
            var blocker = '';
            
            // Find who blocked this card
            if (isBlocked) {
                for (var playerName in players.currentBlocks) {
                    if (players.currentBlocks[playerName].cardId === cardId) {
                        blocker = ' (blocked by ' + playerName + ')';
                        break;
                    }
                }
            }
            
            html += '<div class="card-item ' + blockClass + '" data-card-id="' + cardId + '">' +
                   (index + 1) + '. ' + country.name + blocker + '</div>';
        });
        
        html += '</div></div>';
        availableCards.innerHTML = html;
        
        // Add click listeners for card selection
        document.querySelectorAll('.card-available[data-card-id]').forEach(function(cardElement) {
            cardElement.addEventListener('click', function() {
                var cardId = this.getAttribute('data-card-id');
                selectCardToBlock(cardId);
            });
        });
    }
    
    // Show blocking tokens for current player
    var blockingTokens = document.getElementById('blockingTokens');
    if (blockingTokens && blockingTurn < blockingOrder.length) {
        var currentPlayer = blockingOrder[blockingTurn];
        var html = '<div class="form-card"><div class="section-header"><div class="section-icon">🎯</div>' +
                  '<div class="section-title">' + currentPlayer + '\'s Blocking Tokens</div></div><div class="tokens-grid">';
        
        [2, 4, 6].forEach(function(value) {
            var playerHasToken = players.blockingTokens[currentPlayer] && players.blockingTokens[currentPlayer][value];
            var tokenUsedThisRound = usedBlockingTokens[value];
            var available = playerHasToken && !tokenUsedThisRound;
            
            var tokenClass = available ? 'token-available token-' + value : 'token-used';
            var reason = '';
            if (!playerHasToken) reason = ' [USED]';
            else if (tokenUsedThisRound) reason = ' [TAKEN]';
            
            html += '<div class="token-item ' + tokenClass + '" onclick="' + (available ? 'selectBlockingToken(' + value + ', this)' : '') + '">' +
                   value + ' points' + reason + '</div>';
        });
        
        html += '</div><div class="blocking-actions">';
        html += '<button class="btn secondary" onclick="skipBlocking()">⏭️ Skip Turn</button>';
        html += '</div></div>';
        blockingTokens.innerHTML = html;
    } else {
        blockingTokens.innerHTML = '<div class="form-card"><div class="section-title">Blocking Complete</div>' +
                                 '<div class="card-description">All players have had their turn to block.</div></div>';
    }
}

var selectedToken = null;
var selectedCard = null;

window.selectBlockingToken = function(value, element) {
    selectedToken = value;
    
    // Highlight selected token
    document.querySelectorAll('.token-item').forEach(function(el) {
        el.classList.remove('token-selected');
    });
    
    if (element) {
        element.classList.add('token-selected');
    }
    
    // Show instruction
    alert('Token selected! Now click a card to block it.');
};

window.selectCardToBlock = function(cardId) {
    if (!selectedToken) {
        alert('Please select a blocking token first!');
        return;
    }
    
    selectedCard = cardId;
    
    var currentPlayer = blockingOrder[blockingTurn];
    var country = window.GAME_DATA.countries[cardId];
    
    if (confirm('Block ' + country.name + ' with a ' + selectedToken + '-point token?')) {
        blockCard(cardId, selectedToken, currentPlayer);
    }
};

function blockCard(cardId, tokenValue, playerName) {
    if (blockedCards.includes(cardId)) {
        return; // Already blocked
    }
    
    // Block the card
    blockedCards.push(cardId);
    
    // Record the blocking action
    players.currentBlocks[playerName] = {
        cardId: cardId,
        tokenValue: tokenValue
    };
    
    // Remove token from player and mark as used this round
    players.blockingTokens[playerName][tokenValue] = false;
    usedBlockingTokens[tokenValue] = true;
    
    var country = window.GAME_DATA.countries[cardId];
    alert(playerName + ' blocked ' + country.name + ' with a ' + tokenValue + '-point token!');
    
    // Move to next player
    nextBlockingTurn();
}

function nextBlockingTurn() {
    blockingTurn++;
    selectedToken = null;
    selectedCard = null;
    
    updateBlockingDisplay();
    
    // Check if all players have had their turn
    if (blockingTurn >= blockingOrder.length) {
        setTimeout(function() {
            finishBlocking();
        }, 1500);
    }
}

window.finishBlocking = function() {
    // Move to card selection phase
    showCardSelection();
};

window.skipBlocking = function() {
    // Move to card selection phase without blocking
    showCardSelection();
};

// Card Selection Phase
function showCardSelection() {
    var remainingCards = drawnCards.filter(function(card) {
        return !blockedCards.includes(card);
    });
    
    if (remainingCards.length < currentBid) {
        alert('Not enough cards remaining! Bidder automatically fails.');
        // Handle automatic failure
        return;
    }
    
    // Update scan info
    var scanInfo = document.getElementById('scanInfo');
    if (scanInfo) {
        scanInfo.innerHTML = '<div class="card-title">' + currentPrompt.label + '</div>' +
                           '<div class="card-description">' + highestBidder + ' must select ' + currentBid + ' cards to rank</div>';
    }
    
    // Reset selection
    selectedCardsForRanking = [];
    
    // Show available cards for selection
    updateAvailableCardsDisplay(remainingCards);
    
    showScreen('scanScreen');
}

function updateAvailableCardsDisplay(remainingCards) {
    var container = document.getElementById('availableCardsForSelection');
    
    if (container) {
        var html = '<div class="form-card"><div class="section-header"><div class="section-icon">🎴</div>' +
                  '<div class="section-title">Available Cards (' + remainingCards.length + ' remaining)</div></div><div class="cards-grid">';
        
        remainingCards.forEach(function(cardId, index) {
            var country = window.GAME_DATA.countries[cardId];
            html += '<div class="card-item card-selectable" data-card-id="' + cardId + '">' +
                   (index + 1) + '. ' + country.name + '</div>';
        });
        
        html += '</div><div class="selection-info">Click cards to select them for ranking</div></div>';
        container.innerHTML = html;
        
        // Add click listeners for card selection
        document.querySelectorAll('.card-selectable[data-card-id]').forEach(function(cardElement) {
            cardElement.addEventListener('click', function() {
                var cardId = this.getAttribute('data-card-id');
                selectCardForRanking(cardId);
            });
        });
    } else {
        console.log('Container not found for available cards');
    }
}

var selectedCardsForRanking = [];

window.selectCardForRanking = function(cardId) {
    var country = window.GAME_DATA.countries[cardId];
    
    if (selectedCardsForRanking.includes(cardId)) {
        // Deselect card
        selectedCardsForRanking = selectedCardsForRanking.filter(function(id) { return id !== cardId; });
        alert('Removed ' + country.name + ' from selection');
    } else {
        // Select card
        if (selectedCardsForRanking.length >= currentBid) {
            alert('You can only select ' + currentBid + ' cards!');
            return;
        }
        selectedCardsForRanking.push(cardId);
        alert('Selected ' + country.name + ' (' + selectedCardsForRanking.length + '/' + currentBid + ')');
    }
    
    // Update visual selection
    updateCardSelectionDisplay();
    
    // If we have the right number of cards, show ranking interface
    if (selectedCardsForRanking.length === currentBid) {
        setTimeout(function() {
            showRankingInterface();
        }, 1000);
    }
};

function updateCardSelectionDisplay() {
    // Update visual state of selected cards
    document.querySelectorAll('.card-selectable').forEach(function(cardElement) {
        var cardId = cardElement.getAttribute('data-card-id');
        if (selectedCardsForRanking.includes(cardId)) {
            cardElement.classList.add('card-selected');
        } else {
            cardElement.classList.remove('card-selected');
        }
    });
    
    // Update selection counter if needed
    var selectionInfo = document.querySelector('.selection-info');
    if (selectionInfo) {
        selectionInfo.textContent = 'Selected ' + selectedCardsForRanking.length + '/' + currentBid + ' cards. Click cards to select/deselect.';
    }
}

// Ranking Phase Functions
var finalRanking = [];

function showRankingInterface() {
    // Update scan info for ranking phase
    var scanInfo = document.getElementById('scanInfo');
    if (scanInfo) {
        scanInfo.innerHTML = '<div class="card-title">' + currentPrompt.label + '</div>' +
                           '<div class="card-description">Drag cards to rank them from highest to lowest</div>';
    }
    
    // Hide card selection interface
    var container = document.getElementById('availableCardsForSelection');
    if (container) {
        container.style.display = 'none';
    }
    
    // Show ranking interface
    updateRankingInterface();
}

function updateRankingInterface() {
    // Create or update ranking container
    var rankingContainer = document.getElementById('rankingContainer');
    if (!rankingContainer) {
        var scanContent = document.querySelector('#scanScreen .screen-content');
        rankingContainer = document.createElement('div');
        rankingContainer.id = 'rankingContainer';
        scanContent.appendChild(rankingContainer);
    }
    
    var html = '<div class="form-card">' +
              '<div class="section-header">' +
              '<div class="section-icon">📊</div>' +
              '<div class="section-title">Rank Your Cards</div>' +
              '</div>' +
              '<div class="ranking-instructions">Drag cards to reorder them. Top = Highest value for this category.</div>' +
              '<div id="rankingArea" class="ranking-area">';
    
    // Show cards in current ranking order (or selection order if not yet ranked)
    var cardsToRank = finalRanking.length > 0 ? finalRanking : selectedCardsForRanking.slice();
    
    cardsToRank.forEach(function(cardId, index) {
        var country = window.GAME_DATA.countries[cardId];
        html += '<div class="ranking-card" data-card-id="' + cardId + '" draggable="true">' +
               '<span class="rank-number">' + (index + 1) + '</span>' +
               '<span class="country-name">' + country.name + '</span>' +
               '<span class="drag-handle">⋮⋮</span>' +
               '</div>';
    });
    
    html += '</div>' +
           '<div class="ranking-actions">' +
           '<button class="btn primary" onclick="submitRanking()">✅ Submit Ranking</button>' +
           '<button class="btn secondary" onclick="resetRanking()">🔄 Reset Order</button>' +
           '</div>' +
           '</div>';
    
    rankingContainer.innerHTML = html;
    
    // Add drag and drop functionality
    setupDragAndDrop();
}

function setupDragAndDrop() {
    var rankingCards = document.querySelectorAll('.ranking-card');
    var rankingArea = document.getElementById('rankingArea');
    
    rankingCards.forEach(function(card) {
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-card-id'));
            this.classList.add('dragging');
        });
        
        card.addEventListener('dragend', function(e) {
            this.classList.remove('dragging');
        });
    });
    
    rankingArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        var dragging = document.querySelector('.dragging');
        var afterElement = getDragAfterElement(rankingArea, e.clientY);
        
        if (afterElement == null) {
            rankingArea.appendChild(dragging);
        } else {
            rankingArea.insertBefore(dragging, afterElement);
        }
    });
    
    rankingArea.addEventListener('drop', function(e) {
        e.preventDefault();
        updateRankingOrder();
    });
}

function getDragAfterElement(container, y) {
    var draggableElements = Array.from(container.querySelectorAll('.ranking-card:not(.dragging)'));
    
    return draggableElements.reduce(function(closest, child) {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateRankingOrder() {
    var cards = document.querySelectorAll('.ranking-card');
    finalRanking = [];
    
    cards.forEach(function(card, index) {
        var cardId = card.getAttribute('data-card-id');
        finalRanking.push(cardId);
        
        // Update rank number
        var rankNumber = card.querySelector('.rank-number');
        if (rankNumber) {
            rankNumber.textContent = (index + 1);
        }
    });
}

window.submitRanking = function() {
    if (finalRanking.length === 0) {
        // Use current order if no dragging happened
        updateRankingOrder();
    }
    
    if (finalRanking.length !== currentBid) {
        alert('Error: Ranking is incomplete!');
        return;
    }
    
    // Show confirmation
    var confirmMsg = 'Submit this ranking?\n\n';
    finalRanking.forEach(function(cardId, index) {
        var country = window.GAME_DATA.countries[cardId];
        confirmMsg += (index + 1) + '. ' + country.name + '\n';
    });
    
    if (confirm(confirmMsg)) {
        showRevealPhase();
    }
};

window.resetRanking = function() {
    finalRanking = selectedCardsForRanking.slice(); // Reset to selection order
    updateRankingInterface();
};

// Reveal Phase Functions
var correctRanking = [];
var currentRevealIndex = 0;
var bidderSuccess = false;

function showRevealPhase() {
    // Calculate the correct ranking for the selected cards
    correctRanking = calculateCorrectRanking(finalRanking, currentPrompt.challenge);
    currentRevealIndex = 0;
    bidderSuccess = false;
    
    // Update reveal screen
    var revealInfo = document.getElementById('revealInfo');
    if (revealInfo) {
        revealInfo.innerHTML = '<div class="card-title">' + currentPrompt.label + '</div>' +
                             '<div class="card-description">' + highestBidder + ' bid ' + currentBid + ' cards. Let\'s see if they got it right!</div>';
    }
    
    // Initialize reveal interface
    setupRevealInterface();
    
    showScreen('revealScreen');
}

function calculateCorrectRanking(cardIds, challenge) {
    return cardIds.slice().sort(function(a, b) {
        var valueA = window.GAME_DATA.countries[a][challenge];
        var valueB = window.GAME_DATA.countries[b][challenge];
        
        // Sort from highest to lowest (descending order)
        return valueB - valueA;
    });
}

function setupRevealInterface() {
    var revealCards = document.getElementById('revealCards');
    if (!revealCards) return;
    
    var html = '<div class="reveal-container">' +
              '<h4>' + highestBidder + '\'s Ranking</h4>' +
              '<div class="ranking-list" id="bidderRankingList"></div>' +
              '</div>';
    
    revealCards.innerHTML = html;
    
    // Show bidder's ranking
    updateBidderRankingDisplay();
    
    // Update progress
    updateRevealProgress();
}

function updateBidderRankingDisplay() {
    var container = document.getElementById('bidderRankingList');
    if (!container) return;
    
    var html = '';
    var sequenceBroken = false;
    
    finalRanking.forEach(function(cardId, index) {
        var country = window.GAME_DATA.countries[cardId];
        var value = country[currentPrompt.challenge];
        var isRevealed = index < currentRevealIndex;
        
        var statusClass = '';
        var statusIcon = '';
        
        if (!isRevealed) {
            statusClass = 'hidden';
        } else {
            // Check if this card maintains the sequence
            if (index === 0) {
                // First card is always correct
                statusClass = 'revealed correct';
                statusIcon = ' ✓';
            } else {
                // Check against previous card
                var prevCard = finalRanking[index - 1];
                var prevValue = window.GAME_DATA.countries[prevCard][currentPrompt.challenge];
                
                if (value > prevValue) {
                    // This card breaks the sequence
                    statusClass = 'revealed wrong';
                    statusIcon = ' ✗';
                    sequenceBroken = true;
                } else if (!sequenceBroken) {
                    // Still in correct sequence
                    statusClass = 'revealed correct';
                    statusIcon = ' ✓';
                } else {
                    // After sequence is broken, just show as revealed
                    statusClass = 'revealed';
                }
            }
        }
        
        html += '<div class="reveal-card bidder-card ' + statusClass + '">' +
               '<span class="rank-number">' + (index + 1) + '</span>' +
               '<span class="country-info">' +
               '<span class="country-name">' + country.name + '</span>' +
               '<span class="country-value">' + (isRevealed ? formatValue(value, currentPrompt.challenge) : '???') + '</span>' +
               '</span>' +
               '<span class="status-icon">' + statusIcon + '</span>' +
               '</div>';
    });
    
    container.innerHTML = html;
}


function formatValue(value, challenge) {
    // Format the value based on the challenge type
    if (challenge.includes('consumption') || challenge.includes('price')) {
        return value.toFixed(1);
    } else if (challenge.includes('percentage') || challenge.includes('rate')) {
        return value.toFixed(1) + '%';
    } else if (challenge.includes('area') || challenge.includes('population')) {
        return value.toLocaleString();
    } else {
        return value.toString();
    }
}

function updateRevealProgress() {
    var progressElement = document.getElementById('revealProgress');
    if (progressElement) {
        progressElement.textContent = currentRevealIndex + ' of ' + correctRanking.length;
    }
    
    var progressBar = document.getElementById('revealProgressBar');
    if (progressBar) {
        var percentage = (currentRevealIndex / correctRanking.length) * 100;
        progressBar.style.width = percentage + '%';
    }
}

// Override the existing revealNext function
window.revealNext = function() {
    if (currentRevealIndex >= finalRanking.length) {
        // All cards revealed, show final results
        showFinalResults();
        return;
    }
    
    // Reveal the next card
    currentRevealIndex++;
    updateBidderRankingDisplay();
    updateRevealProgress();
    
    // If we've revealed at least 2 cards, check if current card is lower than previous
    if (currentRevealIndex >= 2) {
        var prevCard = finalRanking[currentRevealIndex - 2];
        var currentCard = finalRanking[currentRevealIndex - 1];
        
        var prevValue = window.GAME_DATA.countries[prevCard][currentPrompt.challenge];
        var currentValue = window.GAME_DATA.countries[currentCard][currentPrompt.challenge];
        
        // Check if current value is lower than previous (should be descending)
        if (currentValue > prevValue) {
            // Sequence broken! Current card has higher value than previous
            bidderSuccess = false;
            var prevCountry = window.GAME_DATA.countries[prevCard];
            var currentCountry = window.GAME_DATA.countries[currentCard];
            
            // Delay failure message so players can see the problematic card first
            setTimeout(function() {
                alert('SEQUENCE BROKEN!\n\n' + 
                      prevCountry.name + ': ' + formatValue(prevValue, currentPrompt.challenge) + '\n' +
                      currentCountry.name + ': ' + formatValue(currentValue, currentPrompt.challenge) + '\n\n' +
                      currentCountry.name + ' has a higher value than ' + prevCountry.name + '!\n' +
                      highestBidder + ' fails!');
                
                // Reveal all remaining cards
                currentRevealIndex = finalRanking.length;
                updateBidderRankingDisplay();
                updateRevealProgress();
                
                setTimeout(function() {
                    showFinalResults();
                }, 1500);
            }, 1000); // Wait 1 second to see the card that broke the sequence
            return;
        }
    }
    
    // If this was the last card and we haven't failed, bidder succeeds
    if (currentRevealIndex >= finalRanking.length) {
        bidderSuccess = true;
        // Delay success message so players can see the final card first
        setTimeout(function() {
            alert('SUCCESS! ' + highestBidder + ' ranked all ' + currentBid + ' cards correctly!');
            setTimeout(function() {
                showFinalResults();
            }, 1000);
        }, 1500); // Wait 1.5 seconds for celebration moment
    }
};

function showFinalResults() {
    // This will be implemented with the scoring system
    alert('Final Results:\n' + 
          'Bidder: ' + highestBidder + '\n' +
          'Bid: ' + currentBid + ' cards\n' +
          'Result: ' + (bidderSuccess ? 'SUCCESS!' : 'FAILED') + '\n\n' +
          'Scoring and token transfers coming next...');
    
    showScreen('resultsScreen');
}

// Set up page when DOM loads
document.addEventListener('DOMContentLoaded', initPage);
window.addEventListener('load', initPage);

// Debug function to check if everything loaded
window.checkGameLoaded = function() {
    console.log('Game functions loaded:', {
        showScreen: typeof window.showScreen,
        startRoundWithBidder: typeof window.startRoundWithBidder,
        addPlayer: typeof window.addPlayer,
        GAME_DATA: typeof window.GAME_DATA
    });
};
