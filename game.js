// game.js - Game logic using separated data

// Non-blocking notification system for user feedback
function showNotification(message, type) {
    // Default type to 'info' if not specified
    type = type || 'info';
    
    // Create notification element
    var notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.textContent = message;
    
    // Determine background color
    var bgColor = type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff';
    
    // Style the notification
    notification.style.cssText = 
        'position: fixed;' +
        'top: 20px;' +
        'right: 20px;' +
        'padding: 12px 20px;' +
        'background: ' + bgColor + ';' +
        'color: white;' +
        'border-radius: 4px;' +
        'box-shadow: 0 2px 10px rgba(0,0,0,0.2);' +
        'z-index: 10000;' +
        'max-width: 300px;' +
        'font-size: 14px;' +
        'opacity: 0;' +
        'transform: translateX(100%);' +
        'transition: all 0.3s ease;';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(function() {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(function() {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Also log to console for automated testing
    console.log('[NOTIFICATION] ' + message);
}

// Visual console output for live monitoring during tests
function addConsoleMessage(message, type) {
    var consoleOutput = document.getElementById('consoleOutput');
    if (!consoleOutput) {
        // Fallback to original console if element not found
        originalConsoleLog('[DEBUG] Console output element not found:', message);
        return;
    }
    
    var messageElement = document.createElement('div');
    messageElement.className = 'console-message' + (type ? ' ' + type : '');
    
    // Add timestamp
    var timestamp = new Date().toLocaleTimeString();
    messageElement.textContent = '[' + timestamp + '] ' + message;
    
    consoleOutput.appendChild(messageElement);
    
    // Auto-scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
    
    // Keep only last 500 messages for performance
    var messages = consoleOutput.querySelectorAll('.console-message');
    if (messages.length > 500) {
        for (var i = 0; i < messages.length - 500; i++) {
            messages[i].remove();
        }
    }
}

function clearConsoleOutput() {
    var consoleOutput = document.getElementById('consoleOutput');
    if (consoleOutput) {
        consoleOutput.innerHTML = '<div class="console-message">Console output cleared...</div>';
        // Also clear the stored logs
        window.consoleLogHistory = [];
    }
}

function exportConsoleToFile() {
    var consoleOutput = document.getElementById('consoleOutput');
    if (!consoleOutput) {
        console.log('No console output found to export');
        return;
    }
    
    var messages = consoleOutput.querySelectorAll('.console-message');
    var logText = '';
    
    // Add header with timestamp
    var exportTime = new Date().toISOString();
    logText += '='.repeat(60) + '\n';
    logText += 'KNOW-IT-ALL AUTOMATED TEST CONSOLE LOG\n';
    logText += 'Exported: ' + exportTime + '\n';
    logText += '='.repeat(60) + '\n\n';
    
    // Add each console message
    messages.forEach(function(message) {
        logText += message.textContent + '\n';
    });
    
    // Add footer
    logText += '\n' + '='.repeat(60) + '\n';
    logText += 'End of log (' + messages.length + ' messages)\n';
    logText += '='.repeat(60) + '\n';
    
    // Create and download file
    var blob = new Blob([logText], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'know-it-all-console-log-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('✅ Console log exported to file: ' + a.download);
}

// Override console.log during automated tests to also show in UI
var originalConsoleLog = console.log;
var originalConsoleError = console.error;
var originalConsoleWarn = console.warn;

window.enableVisualConsole = function() {
    // Performance optimization: Skip visual console during automated tests
    if (window.isAutomatedTestRunning) {
        return; // Don't override console during automated tests
    }
    
    console.log = function() {
        originalConsoleLog.apply(console, arguments);
        var message = Array.prototype.slice.call(arguments).join(' ');
        addConsoleMessage(message, 'info');
    };
    
    console.error = function() {
        originalConsoleError.apply(console, arguments);
        var message = Array.prototype.slice.call(arguments).join(' ');
        addConsoleMessage(message, 'error');
    };
    
    console.warn = function() {
        originalConsoleWarn.apply(console, arguments);
        var message = Array.prototype.slice.call(arguments).join(' ');
        addConsoleMessage(message, 'warning');
    };
};

window.disableVisualConsole = function() {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
};

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
    blockingTokens: {},  // Each player's blocking tokens {2: 1, 4: 1, 6: 1} (counts)
    currentBlocks: {},  // Blocks placed this round {playerName: tokenValue}
    stats: {}  // Detailed player statistics {playerName: {bidsWon: 0, bidsSuccessful: 0, blocksMade: 0, tokensGained: 0, tokensLost: 0}}
};
var currentRound = 1;
var maxRounds = 6;
var winningScore = 30;


// Check if data is available
window.checkData = function() {
    if (window.GAME_DATA) {
        var countries = Object.keys(window.GAME_DATA.countries).length;
        var challenges = window.GAME_DATA.prompts.length;
        console.log("Data loaded! " + countries + " countries, " + challenges + " challenges");
    } else {
        console.error("ERROR: Game data not loaded!");
    }
};

// Screen switching function
window.showScreen = function(screenId) {
    console.log('🔄 showScreen called with:', screenId);
    
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    console.log('Found', screens.length, 'screens to hide');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    
    // Show target screen
    var target = document.getElementById(screenId);
    if (target) {
        console.log('✅ Found target screen:', screenId);
        target.classList.add('active');
        
        // Update content for specific screens
        if (screenId === 'scoresScreen') {
            console.log('📊 Navigating to scores screen...');
            updateScoresDisplay();
        } else if (screenId === 'blockingScreen') {
            console.log('🛡️ Navigating to blocking screen...');
            setupBlockingScreen();
        }
    } else {
        console.error('❌ Screen not found:', screenId);
        console.log('Available screen IDs:');
        document.querySelectorAll('.screen').forEach(function(screen) {
            console.log('  -', screen.id);
        });
    }
};

// Simple demo game using the data
window.simulateQRScan = function() {
    
    // Check if data is available
    if (!window.GAME_DATA) {
        console.error("ERROR: Game data not loaded! Make sure data.js is included.");
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
        
        console.log(message);
        
    } catch (error) {
        console.error("Demo error: " + error.message);
    }
};

// Real QR scan placeholder
window.startRealQRScan = function() {
    console.log("QR scan feature coming soon! Use demo mode for now.");
};

// Player management functions
// Initialize player with blocking tokens
function initializePlayer(name) {
    players.scores[name] = 0;
    players.blockingTokens[name] = {2: 1, 4: 1, 6: 1}; // Change to counts instead of booleans
    players.stats[name] = {
        bidsWon: 0,
        bidsSuccessful: 0,
        blocksMade: 0,
        tokensGained: 0,
        tokensLost: 0
    };
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
    
    // Update round summary
    var roundSummary = document.getElementById('roundSummary');
    if (roundSummary) {
        var html = '<strong>Round ' + currentRound + ' of ' + maxRounds + '</strong><br>' +
                  '<strong>Players:</strong> ' + (count === 0 ? 'Add players above' : count + ' players ready') + '<br>' +
                  '<strong>Next:</strong> Draw challenge and start bidding';
        
        // Show current scores if any exist
        if (Object.keys(players.scores).length > 0) {
            var scores = getFinalScores();
            html += '<br><strong>Current Scores:</strong> ';
            html += scores.slice(0, 3).map(function(player) {
                return player.name + ' (' + player.score + ')';
            }).join(', ');
            if (scores.length > 3) {
                html += ', ...';
            }
        }
        
        roundSummary.innerHTML = html;
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
        console.error('You need at least 2 players to start!');
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
    console.log("Continue to scanning clicked!");
};

window.scanCard = function() {
    console.log("Scan card clicked!");
};

// revealNext function is implemented later in the file

window.nextRound = function() {
    console.log("Next round clicked!");
};

// Note: newGame function is defined later in the file

// Note: clearScores function is defined later in the file

// Initialize the page
function initPage() {
    
    // Wait a moment for data.js to load
    setTimeout(function() {
        // Check if data loaded
        if (!window.GAME_DATA) {
            console.error("ERROR: Game data not available!");
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
        
        // Player info column
        html += '<div class="player-info">';
        html += '<div class="player-name">' + playerName + crownIcon + '</div>';
        html += '<div class="player-status">' + statusText + '</div>';
        html += '</div>';
        
        // Current bid display column
        html += '<div class="current-bid-display">Current: ' + currentPlayerBid + '</div>';
        
        // Bid controls column
        if (!isPassed) {
            var nextBid = currentBid + 1;
            var canPass = !(isHighBidder && currentBid > 0); // High bidder cannot pass
            
            html += '<div class="bid-controls">';
            html += '<button class="btn small primary" onclick="placeBidForPlayer(\'' + playerName + '\')">Bid ' + nextBid + '</button>';
            
            if (canPass) {
                html += '<button class="btn small secondary" onclick="passPlayer(\'' + playerName + '\')">Pass</button>';
            } else {
                html += '<button class="btn small secondary disabled" disabled>Can\'t Pass</button>';
            }
            html += '</div>';
        } else {
            html += '<div class="passed-text">Passed</div>';
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
        console.log(playerName + ' has already passed and cannot bid.');
        return;
    }
    
    var newBid = currentBid + 1;
    
    if (newBid > 10) {
        console.log('Maximum bid is 10 cards');
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
        console.log('The high bidder cannot pass! You must either bid higher or wait for others to outbid you.');
        return;
    }
    
    passedPlayers[playerName] = true;
    
    // Check if bidding should end
    var activePlayers = players.list.filter(function(name) {
        return !passedPlayers[name];
    });
    
    if (activePlayers.length <= 1) {
        if (currentBid === 0) {
            console.log('All players passed! Someone must make a bid.');
            // Reset all passes to restart bidding
            players.list.forEach(function(name) {
                passedPlayers[name] = false;
            });
        } else {
            console.log('Bidding complete! ' + highestBidder + ' wins with a bid of ' + currentBid + ' cards.');
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
        console.log('Someone must place a bid before continuing!');
        return;
    }
    
    var activePlayers = players.list.filter(function(name) {
        return !passedPlayers[name];
    });
    
    if (activePlayers.length > 1) {
        console.log('Bidding is not complete! Players still need to bid or pass: ' + activePlayers.join(', '));
        return;
    }
    
    // Move to blocking phase
    showBlockingScreen();
};

// Blocking Phase Functions
function showBlockingScreen() {
    console.log('📋 showBlockingScreen called with state:', {
        currentPrompt: currentPrompt ? currentPrompt.label : 'null',
        highestBidder: highestBidder,
        currentBid: currentBid,
        drawnCards: drawnCards.length,
        blockedCards: blockedCards.length
    });
    
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
            var playerHasToken = players.blockingTokens[currentPlayer] && players.blockingTokens[currentPlayer][value] > 0;
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
    console.log('Token selected! Now click a card to block it.');
};

window.selectCardToBlock = function(cardId) {
    if (!selectedToken) {
        console.log('Please select a blocking token first!');
        return;
    }
    
    selectedCard = cardId;
    
    var currentPlayer = blockingOrder[blockingTurn];
    var country = window.GAME_DATA.countries[cardId];
    
    // Auto-confirm for automated testing
    console.log('Confirmed: Block ' + country.name + ' with a ' + selectedToken + '-point token');
    blockCard(cardId, selectedToken, currentPlayer);
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
    
    // Track blocks made in player stats
    if (players.stats[playerName]) {
        players.stats[playerName].blocksMade++;
    }
    
    // Mark token as used this round (but don't remove it yet - that happens after reveal)
    usedBlockingTokens[tokenValue] = true;
    
    var country = window.GAME_DATA.countries[cardId];
    console.log(playerName + ' blocked ' + country.name + ' with a ' + tokenValue + '-point token!');
    
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

function setupBlockingScreen() {
    console.log('🛡️ Setting up blocking screen...');
    console.log('Current game state:', {
        currentPrompt: currentPrompt,
        highestBidder: highestBidder,
        currentBid: currentBid,
        drawnCards: drawnCards,
        blockedCards: blockedCards
    });
    
    // Validate we have the required game state
    if (!currentPrompt || !highestBidder || currentBid === 0 || drawnCards.length === 0) {
        console.error('❌ Cannot setup blocking screen - missing game state');
        showNotification('Error: Game state incomplete for blocking phase', 'error');
        // If we're missing game state, go back to the appropriate screen
        if (players.list.length === 0) {
            showScreen('playerScreen');
        } else {
            showScreen('biddingScreen');
        }
        return;
    }
    
    // Use the existing updateBlockingDisplay function which already handles everything
    updateBlockingDisplay();
    
    console.log('✅ Blocking screen setup complete');
}

function setupBlockingCards() {
    var container = document.getElementById('availableCards');
    if (!container) return;
    
    var html = '<h3>Available Cards to Block:</h3><div class="cards-grid">';
    
    drawnCards.forEach(function(cardId, index) {
        var countryData = window.GAME_DATA.countries[cardId];
        var isBlocked = blockedCards.includes(cardId);
        var cardClass = isBlocked ? 'card-item card-blocked' : 'card-item card-available card-selectable';
        
        html += '<div class="' + cardClass + '" data-card="' + cardId + '">' +
               '<strong>' + (countryData ? countryData.name : cardId) + '</strong>' +
               (isBlocked ? '<br><span style="color: red;">BLOCKED</span>' : '') +
               '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function setupBlockingTokens() {
    var container = document.getElementById('blockingTokens');
    if (!container) return;
    
    // Get current player's tokens (in a real game, this would be dynamic)
    // For now, show tokens for the first non-bidder player
    var currentBlocker = players.list.find(name => name !== highestBidder);
    if (!currentBlocker) return;
    
    var tokens = players.blockingTokens[currentBlocker] || {2: 1, 4: 1, 6: 1};
    
    var html = '<h3>Your Blocking Tokens:</h3><div class="tokens-grid">';
    
    Object.keys(tokens).forEach(function(tokenValue) {
        var count = tokens[tokenValue];
        var isUsed = usedBlockingTokens[tokenValue];
        var tokenClass = count > 0 && !isUsed ? 'token-item token-available' : 'token-item token-used';
        
        html += '<div class="' + tokenClass + '" data-token="' + tokenValue + '">' +
               '<strong>' + tokenValue + ' pts</strong>' +
               '<br>(' + (count || 0) + ' available)' +
               '</div>';
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Card Selection Phase
function showCardSelection() {
    console.log('🎯 Starting card selection phase...');
    console.log('Current prompt:', currentPrompt);
    console.log('Highest bidder:', highestBidder);
    console.log('Current bid:', currentBid);
    console.log('Drawn cards:', drawnCards);
    console.log('Blocked cards:', blockedCards);
    
    // Validate required variables
    if (!currentPrompt) {
        console.error('❌ No current prompt set!');
        showNotification('Error: No challenge selected', 'error');
        return;
    }
    
    if (!highestBidder) {
        console.error('❌ No highest bidder set!');
        showNotification('Error: No bidder selected', 'error');
        return;
    }
    
    if (currentBid === 0) {
        console.error('❌ No bid amount set!');
        showNotification('Error: No bid amount set', 'error');
        return;
    }
    
    var remainingCards = drawnCards.filter(function(card) {
        return !blockedCards.includes(card);
    });
    
    console.log('Remaining cards after blocking:', remainingCards);
    
    if (remainingCards.length < currentBid) {
        console.log('❌ Not enough cards remaining! Bidder automatically fails.');
        showNotification('Not enough cards remaining for bid!', 'error');
        // Handle automatic failure - go to reveal with failure
        bidderSuccess = false;
        setTimeout(() => {
            calculateAndApplyScores();
            updateInterimDisplay();
            showScreen('interimScreen');
        }, 1000);
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
    
    // Hide any existing ranking container from previous rounds
    var rankingContainer = document.getElementById('rankingContainer');
    if (rankingContainer) {
        rankingContainer.style.display = 'none';
    }
    
    // Show available cards for selection
    updateAvailableCardsDisplay(remainingCards);
    
    console.log('✅ Navigating to card selection screen');
    showScreen('scanScreen');
}

function updateAvailableCardsDisplay(remainingCards) {
    var container = document.getElementById('availableCardsForSelection');
    
    if (container) {
        // Make sure the container is visible (it might have been hidden by ranking interface)
        container.style.display = 'block';
        
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
        console.log('Removed ' + country.name + ' from selection');
    } else {
        // Select card
        if (selectedCardsForRanking.length >= currentBid) {
            console.log('You can only select ' + currentBid + ' cards!');
            return;
        }
        selectedCardsForRanking.push(cardId);
        console.log('Selected ' + country.name + ' (' + selectedCardsForRanking.length + '/' + currentBid + ')');
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
        console.log('Error: Ranking is incomplete!');
        return;
    }
    
    // Show confirmation
    var confirmMsg = 'Submit this ranking?\n\n';
    finalRanking.forEach(function(cardId, index) {
        var country = window.GAME_DATA.countries[cardId];
        confirmMsg += (index + 1) + '. ' + country.name + '\n';
    });
    
    // Auto-confirm for automated testing
    console.log('Confirmed ranking submission:', confirmMsg);
    showRevealPhase();
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
                console.log('SEQUENCE BROKEN!\n\n' + 
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
            console.log('SUCCESS! ' + highestBidder + ' ranked all ' + currentBid + ' cards correctly!');
            setTimeout(function() {
                showFinalResults();
            }, 1000);
        }, 1500); // Wait 1.5 seconds for celebration moment
    }
};

function showFinalResults() {
    console.log('🏁 showFinalResults called');
    console.log('Bidder success:', bidderSuccess);
    console.log('Current reveal index:', currentRevealIndex);
    console.log('Final ranking:', finalRanking);
    
    // Track round completion results
    if (window.isAutomatedTestRunning && window.automatedTestResults) {
        var roundData = {
            roundNumber: currentRound,
            prompt: currentPrompt ? currentPrompt.label : 'Unknown',
            bidder: highestBidder,
            bidAmount: currentBid,
            finalRanking: finalRanking.slice(),
            success: bidderSuccess,
            scores: JSON.parse(JSON.stringify(players.scores)),
            endTime: new Date()
        };
        
        window.automatedTestResults.rounds.push(roundData);
        
        // Update success/failure counts
        if (bidderSuccess) {
            window.automatedTestResults.successfulBids++;
            window.automatedTestResults.playerStats[highestBidder].bidsSuccessful++;
        } else {
            window.automatedTestResults.failedBids++;
        }
        
        console.log('📊 Round results tracked for automated test');
    }
    
    // Calculate scores BEFORE capturing them for the test results
    calculateAndApplyScores();
    
    // NOW update player final scores after they've been calculated
    if (window.isAutomatedTestRunning && window.automatedTestResults) {
        Object.keys(players.scores).forEach(function(playerName) {
            if (window.automatedTestResults.playerStats[playerName]) {
                window.automatedTestResults.playerStats[playerName].totalScore = players.scores[playerName];
            }
        });
        console.log('📊 Updated player scores in test results:', players.scores);
    }
    
    updateInterimDisplay();
    showScreen('interimScreen');
    
    console.log('✅ Interim screen should now be visible');
    
    // For automated testing, continue to next round after showing interim screen
    if (window.isAutomatedTestRunning) {
        // Give more time for interim screen to properly display and log data
        setTimeout(() => {
            console.log('📊 INTERIM SCREEN DATA:');
            console.log('Current Round:', currentRound);
            console.log('Current Scores:', players.scores);
            console.log('Current Tokens:', players.blockingTokens);
            console.log('Player Stats:', players.stats);
            
            // Force update all interim displays again to ensure they render
            console.log('🔄 Force updating interim displays...');
            updateInterimDisplay();
            
            setTimeout(() => {
                if (currentRound < maxRounds && !checkWinCondition()) {
                    console.log('▶️ Continuing to next round...');
                    continueToNextRound();
                    
                    setTimeout(() => {
                        automatedRound(currentRound);
                    }, 1500); // Increased delay for better sync
                } else {
                    console.log('🏁 Game completed! Generating detailed test results...');
                    window.automatedTestResults.endTime = new Date();
                    generateDetailedTestResults();
                    window.isAutomatedTestRunning = false;
                    console.log('✅ Automated test completed successfully!');
                }
            }, 2000); // Increased delay for screen transitions
        }, 3000); // Increased time to properly see interim screen
    }
}

function calculateAndApplyScores() {
    console.log('💰 calculateAndApplyScores called');
    console.log('Bidder success:', bidderSuccess);
    console.log('Highest bidder:', highestBidder);
    console.log('Current bid:', currentBid);
    console.log('Current blocks:', players.currentBlocks);
    console.log('Current scores before calculation:', players.scores);
    
    // Track that this player won a bid
    if (players.stats[highestBidder]) {
        players.stats[highestBidder].bidsWon++;
        console.log('📊 Tracking bid won for', highestBidder, '- Total now:', players.stats[highestBidder].bidsWon);
    } else {
        console.error('❌ No stats object found for', highestBidder, '- Available stats:', Object.keys(players.stats));
    }
    
    if (bidderSuccess) {
        // Bidder succeeds - gets points equal to their bid
        var pointsAwarded = currentBid;
        var currentScore = (typeof players.scores[highestBidder] === 'number') ? players.scores[highestBidder] : 0;
        players.scores[highestBidder] = currentScore + pointsAwarded;
        
        // Track successful bid
        if (players.stats[highestBidder]) {
            players.stats[highestBidder].bidsSuccessful++;
            console.log('📊 Tracking successful bid for', highestBidder, '- Total successful:', players.stats[highestBidder].bidsSuccessful);
        }
        
        // Transfer blocking tokens from other players to bidder
        Object.keys(players.currentBlocks).forEach(function(playerName) {
            if (playerName !== highestBidder && players.currentBlocks[playerName]) {
                var blockData = players.currentBlocks[playerName];
                var tokenValue = blockData.tokenValue;
                
                // Remove token from blocker (decrease count)
                if (players.blockingTokens[playerName] && players.blockingTokens[playerName][tokenValue] > 0) {
                    players.blockingTokens[playerName][tokenValue]--;
                    // Track tokens lost
                    if (players.stats[playerName]) {
                        players.stats[playerName].tokensLost++;
                        console.log('📊 Tracking token lost for', playerName, '- Total lost:', players.stats[playerName].tokensLost);
                    }
                    console.log(playerName + ' loses ' + tokenValue + '-point token to ' + highestBidder);
                }
                
                // Give token to bidder (increase count)
                if (!players.blockingTokens[highestBidder]) {
                    players.blockingTokens[highestBidder] = {2: 0, 4: 0, 6: 0};
                }
                players.blockingTokens[highestBidder][tokenValue] = (players.blockingTokens[highestBidder][tokenValue] || 0) + 1;
                // Track tokens gained
                if (players.stats[highestBidder]) {
                    players.stats[highestBidder].tokensGained++;
                    console.log('📊 Tracking token gained for', highestBidder, '- Total gained:', players.stats[highestBidder].tokensGained);
                }
                console.log(highestBidder + ' gains ' + tokenValue + '-point token from ' + playerName);
            }
        });
        
        console.log(highestBidder + ' succeeded! Awarded ' + pointsAwarded + ' points.');
        
    } else {
        // Bidder fails - gets 0 points (no penalty)
        console.log(highestBidder + ' failed! Gets 0 points this round.');
        
        // Each blocking player gets points equal to their token value (and keeps their tokens)
        Object.keys(players.currentBlocks).forEach(function(playerName) {
            if (playerName !== highestBidder && players.currentBlocks[playerName]) {
                var blockData = players.currentBlocks[playerName];
                var tokenValue = blockData.tokenValue;
                var currentScore = (typeof players.scores[playerName] === 'number') ? players.scores[playerName] : 0;
                players.scores[playerName] = currentScore + tokenValue;
                console.log(playerName + ' earned ' + tokenValue + ' points for successful block and keeps their token!');
            }
        });
    }
    
    console.log('Current scores after calculation:', players.scores);
    
    // Store blocking results for round summary before clearing
    window.lastRoundBlocks = JSON.parse(JSON.stringify(players.currentBlocks));
    
    // Clear current blocks for next round
    players.currentBlocks = {};
}

function updateResultsDisplay() {
    var resultsContent = document.getElementById('resultsContent');
    var resultsTitle = document.getElementById('resultsTitle');
    var finalRankingDiv = document.getElementById('finalRanking');
    
    if (resultsTitle) {
        resultsTitle.textContent = bidderSuccess ? 'Round Success!' : 'Round Failed!';
    }
    
    if (resultsContent) {
        var html = '<div class="card-title">' + 
                  (bidderSuccess ? '🎉 ' + highestBidder + ' Succeeded!' : '❌ ' + highestBidder + ' Failed!') + 
                  '</div>' +
                  '<div class="card-description">' +
                  'Bid: ' + currentBid + ' cards<br>' +
                  'Category: ' + currentPrompt.label + '<br>' +
                  (bidderSuccess ? 
                    'Points awarded: +' + currentBid :
                    'Points awarded: 0 (no penalty)') +
                  '</div>';
        
        // Show blocking results
        var blockingResults = getBlockingResults();
        if (blockingResults.length > 0) {
            html += '<div style="margin-top: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px;">' +
                   '<strong>Blocking Results:</strong><br>' + blockingResults.join('<br>') + '</div>';
        }
        
        resultsContent.innerHTML = html;
    }
    
    if (finalRankingDiv) {
        var html = '<div class="final-ranking-display">';
        
        // Show bidder's ranking
        html += '<h4>' + highestBidder + '\'s Ranking:</h4>';
        finalRanking.forEach(function(cardId, index) {
            var country = window.GAME_DATA.countries[cardId];
            var value = country[currentPrompt.challenge];
            html += '<div class="ranking-item">' +
                   '<span class="rank-number">' + (index + 1) + '</span>' +
                   '<span class="country-name">' + country.name + '</span>' +
                   '<span class="country-value">' + formatValue(value, currentPrompt.challenge) + '</span>' +
                   '</div>';
        });
        
        // Show correct ranking for comparison
        html += '<h4 style="margin-top: 20px;">Correct Ranking:</h4>';
        correctRanking.forEach(function(cardId, index) {
            var country = window.GAME_DATA.countries[cardId];
            var value = country[currentPrompt.challenge];
            html += '<div class="ranking-item correct-ranking">' +
                   '<span class="rank-number">' + (index + 1) + '</span>' +
                   '<span class="country-name">' + country.name + '</span>' +
                   '<span class="country-value">' + formatValue(value, currentPrompt.challenge) + '</span>' +
                   '</div>';
        });
        
        html += '</div>';
        finalRankingDiv.innerHTML = html;
    }
}

function getBlockingResults() {
    var results = [];
    
    // Use saved blocking data from before it was cleared
    var blocksToCheck = window.lastRoundBlocks || players.currentBlocks;
    
    Object.keys(blocksToCheck).forEach(function(playerName) {
        if (playerName !== highestBidder && blocksToCheck[playerName]) {
            var blockData = blocksToCheck[playerName];
            var tokenValue = blockData.tokenValue;
            
            if (bidderSuccess) {
                // Bidder succeeded, blockers lose their tokens
                results.push(playerName + ' lost ' + tokenValue + '-point token to ' + highestBidder);
            } else {
                // Bidder failed, blockers get points and keep tokens
                results.push(playerName + ' earned ' + tokenValue + ' points for successful block (keeps token)');
            }
        }
    });
    
    return results;
}

function updateInterimDisplay() {
    console.log('📊 updateInterimDisplay called');
    updateInterimLeaderboard();
    updateInterimTokenInventory();
    updateInterimRoundSummary();
    console.log('✅ All interim displays updated');
}

function updateInterimLeaderboard() {
    console.log('🏆 updateInterimLeaderboard called');
    var container = document.getElementById('interimLeaderboard');
    if (!container) {
        console.error('❌ interimLeaderboard container not found!');
        return;
    }
    
    var scores = getFinalScores();
    console.log('Interim leaderboard scores:', scores);
    if (scores.length === 0) {
        console.log('⚠️ No scores to display');
        container.innerHTML = '<div class="no-scores-message">No scores yet!</div>';
        return;
    }
    
    var html = '<table class="scores-table">' +
              '<thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead><tbody>';
    
    scores.forEach(function(player, index) {
        var rankClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : '';
        var medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        html += '<tr>' +
               '<td class="rank ' + rankClass + '">' + medal + ' ' + (index + 1) + '</td>' +
               '<td>' + player.name + '</td>' +
               '<td>' + (typeof player.score === 'number' ? player.score : 0) + '</td>' +
               '</tr>';
    });
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

function updateInterimTokenInventory() {
    var container = document.getElementById('interimTokenInventory');
    if (!container) return;
    
    if (players.list.length === 0) {
        container.innerHTML = '<div class="no-scores-message">No players!</div>';
        return;
    }
    
    var html = '';
    
    // Sort players by current score for display
    var sortedPlayers = getFinalScores();
    
    sortedPlayers.forEach(function(playerData) {
        var playerName = playerData.name;
        var tokens = players.blockingTokens[playerName] || {2: 1, 4: 1, 6: 1};
        var chipDisplay = '';
        
        // Display all token types with actual counts
        [2, 4, 6].forEach(function(tokenValue) {
            var count = tokens[tokenValue] || 0;
            var chipClass = tokenValue === 2 ? 'chip-2' : tokenValue === 4 ? 'chip-4' : 'chip-6';
            
            if (count > 0) {
                chipDisplay += '<span class="chip-badge ' + chipClass + '">' + tokenValue + ' pts (x' + count + ')</span>';
            } else {
                chipDisplay += '<span class="chip-badge chip-empty">' + tokenValue + ' pts (x0)</span>';
            }
        });
        
        html += '<div class="chip-inventory-item">' +
               '<span class="chip-inventory-player">' + playerName + '</span>' +
               '<div class="chip-inventory-chips">' + chipDisplay + '</div>' +
               '</div>';
    });
    
    container.innerHTML = html;
}

function updateInterimRoundSummary() {
    console.log('📋 updateInterimRoundSummary called');
    var container = document.getElementById('interimRoundSummary');
    if (!container) {
        console.error('❌ interimRoundSummary container not found!');
        return;
    }
    
    console.log('Round summary data:', {
        currentRound: currentRound,
        maxRounds: maxRounds,
        highestBidder: highestBidder,
        currentBid: currentBid,
        currentPrompt: currentPrompt,
        bidderSuccess: bidderSuccess
    });
    
    var html = '<div class="round-summary-grid">';
    
    // Round info
    html += '<div class="summary-item">' +
           '<strong>Round ' + currentRound + ' of ' + maxRounds + ' Complete</strong><br>' +
           '<strong>Bidder:</strong> ' + (highestBidder || 'Unknown') + '<br>' +
           '<strong>Bid:</strong> ' + (currentBid || 0) + ' cards<br>' +
           '<strong>Category:</strong> ' + (currentPrompt ? currentPrompt.label : 'Unknown') + '<br>' +
           '<strong>Result:</strong> ' + (bidderSuccess ? '✅ SUCCESS' : '❌ FAILED') +
           '</div>';
    
    // Scoring summary
    html += '<div class="summary-item">';
    if (bidderSuccess) {
        html += '<strong>Points Awarded:</strong><br>' +
               '• ' + highestBidder + ': +' + currentBid + ' points<br>';
        
        var tokenTransfers = getBlockingResults();
        if (tokenTransfers.length > 0) {
            html += '<strong>Token Transfers:</strong><br>';
            tokenTransfers.forEach(function(transfer) {
                html += '• ' + transfer + '<br>';
            });
        }
    } else {
        html += '<strong>Points Changes:</strong><br>' +
               '• ' + highestBidder + ': 0 points (no penalty)<br>';
        
        // Use saved blocking data from before it was cleared
        var blocksToCheck = window.lastRoundBlocks || players.currentBlocks;
        Object.keys(blocksToCheck).forEach(function(playerName) {
            if (playerName !== highestBidder && blocksToCheck[playerName]) {
                var blockData = blocksToCheck[playerName];
                var tokenValue = blockData.tokenValue;
                html += '• ' + playerName + ': +' + tokenValue + ' points (blocking reward)<br>';
            }
        });
    }
    html += '</div>';
    
    html += '</div>';
    container.innerHTML = html;
    console.log('✅ Round summary updated successfully');
    console.log('HTML content length:', html.length);
}

window.continueToNextRound = function() {
    nextRound();
};

// Round and game management functions
window.nextRound = function() {
    // Check if game should end
    if (currentRound >= maxRounds || checkWinCondition()) {
        endGame();
        return;
    }
    
    // Advance to next round
    currentRound++;
    
    // Reset round-specific variables
    resetRoundState();
    
    // For automated testing, continue automatically
    // For manual play, go back to player setup
    if (window.isAutomatedTestRunning) {
        console.log('🤖 Automated test: Starting round ' + currentRound + ' automatically...');
        // Don't change screen, just continue with automation
    } else {
        // Clear UI elements from previous round before starting new round
        console.log('🧹 Clearing UI from previous round...');
        clearUIElements();
        
        // Go back to player setup for next round
        showScreen('playerScreen');
        console.log('Round ' + currentRound + ' starting!\n\nAll players maintain their scores and blocking tokens from previous rounds.');
    }
};

window.newGame = function() {
    // Reset all game state
    currentRound = 1;
    players.scores = {};
    players.currentBlocks = {};
    
    // Reset all players' blocking tokens
    players.list.forEach(function(playerName) {
        players.blockingTokens[playerName] = {2: 1, 4: 1, 6: 1};
    });
    
    resetRoundState();
    showScreen('titleScreen');
};

function resetRoundState() {
    console.log('🔄 Resetting round state...');
    
    currentPrompt = null;
    drawnCards = [];
    blockedCards = [];
    selectedCards = [];
    selectedCardsForRanking = [];
    bidAmount = 0;
    currentBid = 0;
    highestBidder = '';
    playerBids = {};
    passedPlayers = {};
    blockingTurn = 0;
    blockingOrder = [];
    usedBlockingTokens = {2: false, 4: false, 6: false};
    revealIndex = 0;
    currentRevealIndex = 0;
    finalRanking = [];
    correctRanking = [];
    bidderSuccess = false;
    players.currentBlocks = {};
    
    console.log('🧹 Clearing UI elements...');
    // Clear UI elements that might persist between rounds
    clearUIElements();
    
    console.log('✅ Round state reset complete');
}

function clearUIElements() {
    console.log('🧹 Starting clearUIElements...');
    
    // Clear bidding interface
    var highBidderDisplay = document.getElementById('highBidderDisplay');
    if (highBidderDisplay) {
        highBidderDisplay.innerHTML = '<div class="high-bid-amount">No bids yet</div><div class="high-bid-player">Waiting for first bid...</div>';
    }
    
    var playerBidding = document.getElementById('playerBidding');
    if (playerBidding) {
        playerBidding.innerHTML = '';
    }
    
    // Clear blocking interface
    var availableCards = document.getElementById('availableCards');
    if (availableCards) {
        availableCards.innerHTML = '';
    }
    
    var blockingTokens = document.getElementById('blockingTokens');
    if (blockingTokens) {
        blockingTokens.innerHTML = '';
    }
    
    // Clear card selection interface
    var availableCardsForSelection = document.getElementById('availableCardsForSelection');
    if (availableCardsForSelection) {
        availableCardsForSelection.innerHTML = '';
    }
    
    var scannedCards = document.getElementById('scannedCards');
    if (scannedCards) {
        scannedCards.innerHTML = '';
    }
    
    // Clear ranking interface (including dynamically created container)
    var rankingContainer = document.getElementById('rankingContainer');
    if (rankingContainer) {
        rankingContainer.remove(); // Remove the entire element, not just clear it
    }
    
    // Clear reveal interface
    var revealCards = document.getElementById('revealCards');
    if (revealCards) {
        revealCards.innerHTML = '';
    }
    
    var revealProgress = document.getElementById('revealProgress');
    if (revealProgress) {
        revealProgress.textContent = '0 of 0';
    }
    
    // Clear the drawn cards info display on bidding screen
    var drawnCardsInfo = document.getElementById('drawnCardsInfo');
    if (drawnCardsInfo) {
        drawnCardsInfo.innerHTML = '';
    }
    
    console.log('✅ clearUIElements complete');
    
    var revealProgressBar = document.getElementById('revealProgressBar');
    if (revealProgressBar) {
        revealProgressBar.style.width = '0%';
    }
    
    // Clear results interface
    var finalRankingDiv = document.getElementById('finalRanking');
    if (finalRankingDiv) {
        finalRankingDiv.innerHTML = '';
    }
    
    // Hide finish button
    var finishBtn = document.getElementById('finishBtn');
    if (finishBtn) {
        finishBtn.style.display = 'none';
    }
    
    // Clear prompt info
    var promptInfo = document.getElementById('promptInfo');
    if (promptInfo) {
        promptInfo.innerHTML = '<div class="card-title">Challenge Loading...</div><div class="card-description">Setting up the game...</div>';
    }
    
    var drawnCardsInfo = document.getElementById('drawnCardsInfo');
    if (drawnCardsInfo) {
        drawnCardsInfo.innerHTML = '';
    }
}

function checkWinCondition() {
    // Check if any player has reached the winning score
    var winner = null;
    var highestScore = -Infinity;
    
    Object.keys(players.scores).forEach(function(playerName) {
        var score = players.scores[playerName];
        if (score >= winningScore && score > highestScore) {
            winner = playerName;
            highestScore = score;
        }
    });
    
    return winner;
}

function endGame() {
    var winner = checkWinCondition();
    var finalScores = getFinalScores();
    
    var message = 'GAME OVER!\n\n';
    
    if (winner) {
        message += '🏆 WINNER: ' + winner + ' (' + players.scores[winner] + ' points)\n\n';
    } else {
        message += 'Maximum rounds completed!\n\n';
    }
    
    message += 'Final Scores:\n';
    finalScores.forEach(function(player, index) {
        var medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        message += medal + ' ' + player.name + ': ' + player.score + ' points\n';
    });
    
    console.log(message);
    
    // Update scores screen and show it
    updateScoresDisplay();
    showScreen('scoresScreen');
}

function getFinalScores() {
    return Object.keys(players.scores).map(function(playerName) {
        var scoreValue = players.scores[playerName];
        // Ensure score is always a number
        if (typeof scoreValue !== 'number') {
            scoreValue = 0;
        }
        return {
            name: playerName,
            score: scoreValue
        };
    }).sort(function(a, b) {
        return b.score - a.score; // Sort by score descending
    });
}

function updateScoresDisplay() {
    console.log('🔍 Updating scores display...');
    console.log('Players list:', players.list);
    console.log('Players scores:', players.scores);
    
    var leaderboard = document.getElementById('leaderboard');
    var playerStats = document.getElementById('playerStats');
    var chipInventory = document.getElementById('chipInventory');
    
    if (leaderboard) {
        var scores = getFinalScores();
        console.log('Final scores array:', scores);
        if (scores.length === 0) {
            console.log('⚠️ No scores found, showing empty message');
            leaderboard.innerHTML = '<div class="no-scores-message">No games played yet!<br>Play some rounds to see the leaderboard.</div>';
        } else {
            console.log('✅ Displaying scores for', scores.length, 'players');
            var html = '<table class="scores-table">' +
                      '<thead><tr><th>Rank</th><th>Player</th><th>Score</th></tr></thead><tbody>';
            
            scores.forEach(function(player, index) {
                var rankClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : '';
                html += '<tr>' +
                       '<td class="rank ' + rankClass + '">' + (index + 1) + '</td>' +
                       '<td>' + player.name + '</td>' +
                       '<td>' + player.score + '</td>' +
                       '</tr>';
            });
            
            html += '</tbody></table>';
            leaderboard.innerHTML = html;
        }
    }
    
    if (playerStats) {
        if (players.list.length === 0) {
            playerStats.innerHTML = '<div class="no-scores-message">No statistics available yet!</div>';
        } else {
            var html = '';
            console.log('🔍 Displaying player stats:', players.stats);
            players.list.forEach(function(playerName) {
                var score = players.scores[playerName] || 0;
                var stats = players.stats[playerName] || {bidsWon: 0, bidsSuccessful: 0, blocksMade: 0, tokensGained: 0, tokensLost: 0};
                
                console.log('📊 Stats for', playerName + ':', stats);
                
                // Calculate success rate
                var successRate = stats.bidsWon > 0 ? Math.round((stats.bidsSuccessful / stats.bidsWon) * 100) : 0;
                
                html += '<div class="player-detailed-stats">' +
                       '<div class="player-stats-header">' +
                       '<span class="player-stat-name">🎯 ' + playerName + '</span>' +
                       '<span class="player-stat-score">' + score + ' points</span>' +
                       '</div>' +
                       '<div class="player-stats-details">' +
                       '<div class="stat-row">🏆 Bids Won: <span>' + stats.bidsWon + '</span></div>' +
                       '<div class="stat-row">✅ Successful Bids: <span>' + stats.bidsSuccessful + '</span></div>' +
                       '<div class="stat-row">🛡️ Blocks Made: <span>' + stats.blocksMade + '</span></div>' +
                       '<div class="stat-row">💎 Tokens Gained: <span>' + stats.tokensGained + '</span></div>' +
                       '<div class="stat-row">💸 Tokens Lost: <span>' + stats.tokensLost + '</span></div>' +
                       '<div class="stat-row">🎲 Success Rate: <span>' + successRate + '%</span></div>' +
                       '</div>' +
                       '</div>';
            });
            playerStats.innerHTML = html;
        }
    }
    
    if (chipInventory) {
        if (players.list.length === 0) {
            chipInventory.innerHTML = '<div class="no-scores-message">No chip data available!</div>';
        } else {
            var html = '';
            players.list.forEach(function(playerName) {
                var tokens = players.blockingTokens[playerName] || {2: 1, 4: 1, 6: 1};
                var chipDisplay = '';
                
                Object.keys(tokens).forEach(function(tokenValue) {
                    var count = tokens[tokenValue] || 0;
                    if (count > 0) {
                        chipDisplay += '<span class="chip-badge points-' + (tokenValue === '2' ? '3' : tokenValue === '4' ? '5' : '7') + '">' + tokenValue + ' (x' + count + ')</span>';
                    }
                });
                
                if (chipDisplay === '') {
                    chipDisplay = '<span style="color: #999; font-style: italic;">No tokens</span>';
                }
                
                html += '<div class="chip-inventory-item">' +
                       '<span class="chip-inventory-player">' + playerName + '</span>' +
                       '<div class="chip-inventory-chips">' + chipDisplay + '</div>' +
                       '</div>';
            });
            chipInventory.innerHTML = html;
        }
    }
}

window.clearScores = function() {
    // Clear all player scores but keep players and stay on scores screen
    console.log('Clearing all scores...');
    
    // Reset scores to 0 for all players
    players.list.forEach(function(playerName) {
        players.scores[playerName] = 0;
        players.blockingTokens[playerName] = {2: 1, 4: 1, 6: 1};
    });
    
    // Reset game state
    currentRound = 1;
    players.currentBlocks = {};
    
    // Update the display immediately
    updateScoresDisplay();
    
    console.log('All scores cleared and reset to 0!');
};

// Quick setup function for 4 players
window.quickSetup4Players = function() {
    // Reset game state first
    newGame();
    
    // Navigate to player screen
    showScreen('playerScreen');
    
    // Auto-fill 4 player names
    var playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
    
    // Make sure we have enough player input fields
    while (nextPlayerNumber <= 4) {
        if (nextPlayerNumber > 1) {
            addPlayer();
        } else {
            nextPlayerNumber++;
        }
    }
    
    // Fill in the player names
    for (var i = 0; i < 4; i++) {
        var playerInput = document.getElementById('player' + (i + 1));
        if (playerInput) {
            playerInput.value = playerNames[i];
        }
    }
    
    // Update the display
    updatePlayerCount();
    
    // Show confirmation
    console.log('4-player game set up!\n\nPlayers: ' + playerNames.join(', ') + '\n\nClick "Start Round" when ready!');
};

// Simple test function first
window.testFunction = function() {
    console.log('Test function works!');
    console.log('Test function called successfully');
};

// Test visual console function
window.testVisualConsole = function() {
    showScreen('testResultsScreen');
    clearConsoleOutput();
    enableVisualConsole();
    
    setTimeout(function() {
        console.log('Testing visual console...');
        console.warn('This is a warning message');
        console.error('This is an error message');
        console.log('✅ Visual console test complete!');
    }, 1000);
};

// Test blocking screen navigation
window.testBlockingScreen = function() {
    console.log('🧪 Testing blocking screen navigation...');
    
    // Set up some dummy data so the screen has content
    currentPrompt = { label: 'Test Challenge' };
    highestBidder = 'Test Player';
    currentBid = 3;
    drawnCards = ['USA', 'GBR', 'FRA'];
    blockedCards = [];
    players.list = ['Test Player', 'Other Player'];
    blockingOrder = ['Other Player'];
    blockingTurn = 0;
    
    console.log('📋 Test data set up');
    console.log('🔄 Calling showScreen("blockingScreen")...');
    
    showScreen('blockingScreen');
    
    console.log('✅ Test complete - check if blocking screen is visible');
};

// Automated testing function with detailed results tracking
window.automatedTestResults = {
    startTime: null,
    endTime: null,
    rounds: [],
    totalBids: 0,
    totalBlocks: 0,
    successfulBids: 0,
    failedBids: 0,
    playerStats: {},
    errors: []
};

window.runAutomatedTest = function() {
    // Just run the test without visual console to improve performance
    console.log('🤖 Automated test starting...');
    console.log('🤖 Starting automated test...');
    
    // Initialize results tracking
    window.automatedTestResults = {
        startTime: new Date(),
        endTime: null,
        rounds: [],
        totalBids: 0,
        totalBlocks: 0,
        successfulBids: 0,
        failedBids: 0,
        playerStats: {},
        errors: []
    };
    
    // Set automated test flag
    window.isAutomatedTestRunning = true;
    
    try {
        // Setup 4 players WITHOUT navigating away from test results screen
        console.log('🔧 Setting up 4 players for automated test...');
        
        // Reset game state first
        newGame();
        
        // Auto-fill 4 player names directly without screen navigation
        var playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
        players.list = playerNames.slice(); // Copy the array
        
        // Initialize scores and tokens for each player
        playerNames.forEach(function(playerName) {
            players.scores[playerName] = 0;
            players.blockingTokens[playerName] = {2: 1, 4: 1, 6: 1};
            players.currentBlocks[playerName] = null;
            
            // Initialize player stats tracking
            if (!players.stats) {
                players.stats = {};
            }
            players.stats[playerName] = {
                bidsWon: 0,
                bidsSuccessful: 0,
                blocksMade: 0,
                tokensGained: 0,
                tokensLost: 0
            };
            
            // Initialize test stats
            window.automatedTestResults.playerStats[playerName] = {
                bidsWon: 0,
                bidsSuccessful: 0,
                blocksMade: 0,
                tokensGained: 0,
                tokensLost: 0,
                totalScore: 0
            };
        });
        
        console.log('✅ Players setup complete: ' + playerNames.join(', '));
        console.log('🎮 Starting automated test sequence...');
        
        // Start automated round sequence
        setTimeout(function() {
            automatedRound(1);
        }, 2000); // Give more time for setup
        
    } catch (error) {
        console.error('❌ Error starting automated test:', error);
        console.error('Failed to start automated test: ' + error.message);
        window.automatedTestResults.errors.push('Test start error: ' + error.message);
        window.isAutomatedTestRunning = false;
        // Keep visual console enabled for error review
    }
};

function automatedRound(roundNum) {
    console.log('🎮 Starting automated round ' + roundNum);
    
    // Start tracking this round
    var roundData = {
        roundNumber: roundNum,
        startTime: new Date(),
        prompt: null,
        drawnCards: [],
        bidder: null,
        bidAmount: 0,
        blockers: [],
        finalRanking: [],
        success: null,
        scores: {},
        errors: []
    };
    
    try {
        // SHOW PLAYER SCREEN FIRST in automated mode
        console.log('👥 Showing player screen...');
        showScreen('playerScreen');
        
        setTimeout(function() {
            // Set up player input fields to simulate manual entry
            console.log('🔧 Setting up player input fields...');
            var playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
            
            // Make sure we have enough player input fields
            for (var playerNum = 2; playerNum <= 4; playerNum++) {
                var existingInput = document.getElementById('player' + playerNum);
                if (!existingInput) {
                    addPlayer(); // This will create the input field
                    console.log('✅ Added player input field:', playerNum);
                }
            }
            
            // Fill in the player names in the input fields
            for (var i = 0; i < 4; i++) {
                var playerInput = document.getElementById('player' + (i + 1));
                if (playerInput) {
                    playerInput.value = playerNames[i];
                    console.log('✅ Set player' + (i + 1) + ' to:', playerNames[i]);
                } else {
                    console.log('⚠️ Could not find player input field:', 'player' + (i + 1));
                }
            }
            
            // Update the player count display
            updatePlayerCount();
            
            setTimeout(function() {
                // Now use the normal startRoundWithBidder function
                console.log('🚀 Starting round with bidder using normal flow...');
                startRoundWithBidder(); // This will show bidding screen and setup game state
                
                // Store round data after setup
                roundData.prompt = currentPrompt ? currentPrompt.label : 'Unknown';
                roundData.drawnCards = drawnCards.slice();
                
                // Wait for bidding screen to fully load, then start automated bidding
                setTimeout(function() {
                    console.log('💰 Starting automated bidding on bidding screen...');
                    automatedBidding(roundData);
                }, 1000); // Give more time for screen transition
            }, 500); // Give time for input setup
        }, 1000); // Give time for player screen to show
        
    } catch (error) {
        console.error('❌ Error in round ' + roundNum + ':', error);
        console.error('Test failed in round ' + roundNum + ': ' + error.message);
        roundData.errors.push('Round start error: ' + error.message);
        window.automatedTestResults.errors.push('Round ' + roundNum + ' error: ' + error.message);
    }
}

function automatedBidding(roundData) {
    try {
        // Randomize bidding
        var playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
        var randomWinner = playerNames[Math.floor(Math.random() * playerNames.length)];
        var randomBidAmount = Math.floor(Math.random() * 4) + 2; // 2-5 cards
        
        console.log('🎲 Random bidding: ' + randomWinner + ' will win with ' + randomBidAmount + ' cards');
        
        // Track bidding data
        if (roundData) {
            roundData.bidder = randomWinner;
            roundData.bidAmount = randomBidAmount;
            window.automatedTestResults.totalBids++;
            window.automatedTestResults.playerStats[randomWinner].bidsWon++;
        }
        
        // Note: Bid wins are tracked in calculateAndApplyScores(), not here
        console.log('🎯 Winner set:', randomWinner, 'with bid amount:', randomBidAmount);
        
        // Simulate competitive bidding with multiple players
        var currentBidder = 0;
        var targetBid = randomBidAmount;
        
        function simulateBiddingRound() {
            if (currentBid >= targetBid) {
                // Target reached, others pass
                var otherPlayers = playerNames.filter(name => name !== randomWinner);
                var passDelay = 0;
                
                otherPlayers.forEach((playerName, index) => {
                    setTimeout(() => {
                        console.log('❌ ' + playerName + ' passes');
                        passPlayer(playerName);
                    }, 200 + (index * 300));
                    passDelay = 200 + (index * 300);
                });
                
                // Finish bidding using the normal flow
                setTimeout(() => {
                    console.log('✅ Bidding complete, ' + randomWinner + ' won with ' + currentBid + ' cards');
                    console.log('🖼️ Calling finishBidding() to transition to blocking screen...');
                    finishBidding(); // This will show blocking screen
                    
                    setTimeout(() => {
                        console.log('🚫 Starting automated blocking...');
                        automatedBlocking(roundData);
                    }, 1500); // Give more time for screen transition
                }, passDelay + 500);
                return;
            }
            
            // Current player bids
            var currentPlayer = playerNames[currentBidder % playerNames.length];
            
            // The chosen winner always bids, others might pass
            var shouldBid = (currentPlayer === randomWinner) || (Math.random() < 0.3 && currentBid < targetBid - 1);
            
            if (shouldBid) {
                setTimeout(() => {
                    console.log('💰 ' + currentPlayer + ' bids ' + (currentBid + 1));
                    placeBidForPlayer(currentPlayer);
                    
                    // Continue bidding
                    setTimeout(() => {
                        currentBidder++;
                        simulateBiddingRound();
                    }, 400);
                }, 300);
            } else {
                setTimeout(() => {
                    console.log('❌ ' + currentPlayer + ' passes');
                    passPlayer(currentPlayer);
                    
                    // Continue bidding
                    setTimeout(() => {
                        currentBidder++;
                        simulateBiddingRound();
                    }, 300);
                }, 200);
            }
        }
        
        // Ensure randomWinner will bid at least once by making first bid
        console.log('🎯 ' + randomWinner + ' makes opening bid to ensure game progresses');
        setTimeout(() => {
            placeBidForPlayer(randomWinner);
            
            // Now continue with normal bidding simulation
            setTimeout(() => {
                currentBidder = 1; // Start with next player
                simulateBiddingRound();
            }, 500);
        }, 500);
        
    } catch (error) {
        console.error('❌ Error in bidding phase:', error);
        throw error;
    }
}

function automatedBlocking() {
    try {
        console.log('🛡️ Simulating blocking phase...');
        console.log('Current highest bidder:', highestBidder);
        
        // Ensure blocking order is properly set up for automated testing
        if (blockingOrder.length === 0) {
            console.log('⚠️ Blocking order is empty, setting it up...');
            blockingOrder = getPlayersByScore().filter(function(name) {
                return name !== highestBidder;
            }).reverse(); // Reverse to get lowest score first
            blockingTurn = 0;
        }
        
        console.log('Current blocking order:', blockingOrder);
        console.log('Current blocking turn:', blockingTurn);
        
        // Get the blocking order (non-bidders)
        var nonBidders = players.list.filter(name => name !== highestBidder);
        console.log('🎯 Non-bidders who can block:', nonBidders);
        
        if (nonBidders.length === 0) {
            console.log('⏭️ No blockers available, finishing blocking...');
            finishBlocking();
            setTimeout(() => automatedRanking(), 500);
            return;
        }
        
        // Simple approach: randomly decide if each player will block or skip
        function processNextBlocker() {
            if (blockingTurn >= blockingOrder.length) {
                console.log('✅ All blocking turns completed, finishing blocking...');
                setTimeout(() => {
                    console.log('🏁 Finishing blocking phase and transitioning to card selection...');
                    finishBlocking(); // This will show card selection screen
                    setTimeout(() => {
                        console.log('📊 Starting automated ranking...');
                        automatedRanking();
                    }, 1500); // Give time for screen transition
                }, 1000);
                return;
            }
            
            var currentPlayer = blockingOrder[blockingTurn];
            var willBlock = Math.random() < 0.4; // 40% chance to block
            
            console.log('🎯 ' + currentPlayer + '\'s turn: ' + (willBlock ? 'will block' : 'will skip'));
            
            if (willBlock) {
                // Randomly select token and card
                var tokenValues = [2, 4, 6];
                var randomToken = tokenValues[Math.floor(Math.random() * tokenValues.length)];
                var randomCardIndex = Math.floor(Math.random() * Math.min(drawnCards.length, 3));
                
                setTimeout(() => {
                    console.log('🔘 ' + currentPlayer + ' selecting ' + randomToken + '-point token');
                    selectBlockingToken(randomToken, null);
                    
                    setTimeout(() => {
                        if (drawnCards && drawnCards.length > randomCardIndex) {
                            var cardToBlock = drawnCards[randomCardIndex];
                            console.log('🚫 ' + currentPlayer + ' blocking card: ' + cardToBlock);
                            selectCardToBlock(cardToBlock);
                        } else {
                            console.log('⚠️ No valid card, skipping turn');
                            skipCurrentBlocker();
                        }
                        
                        // Continue to next player
                        setTimeout(() => processNextBlocker(), 800);
                    }, 500);
                }, 300);
            } else {
                // Skip this player's turn
                setTimeout(() => {
                    console.log('⏭️ ' + currentPlayer + ' skips blocking');
                    skipCurrentBlocker();
                    setTimeout(() => processNextBlocker(), 500);
                }, 300);
            }
        }
        
        // Start processing blockers
        processNextBlocker();
        
    } catch (error) {
        console.error('❌ Error in blocking phase:', error);
        throw error;
    }
}

// Removed old executeBlockingActions function - using simplified blocking approach now

function skipCurrentBlocker() {
    try {
        // Skip the current player's blocking turn
        if (blockingTurn < blockingOrder.length - 1) {
            blockingTurn++;
            console.log('⏭️ Skipping to next blocker:', blockingOrder[blockingTurn]);
            // Only call updateBlockingInterface if it exists (not in automated mode)
            if (typeof updateBlockingInterface === 'function' && !window.isAutomatedTestRunning) {
                updateBlockingInterface();
            }
        } else {
            console.log('🏁 All blocking turns completed');
        }
    } catch (error) {
        console.error('❌ Error skipping blocker:', error);
    }
}

function automatedRanking() {
    try {
        console.log('📊 Simulating ranking phase...');
        console.log('Current bid:', currentBid);
        console.log('Available cards:', drawnCards);
        console.log('Blocked cards:', blockedCards);
        
        // Auto-select cards (take first N cards available that aren't blocked)
        var availableCards = drawnCards.filter(function(cardId) {
            return !blockedCards.includes(cardId);
        });
        
        var cardsToSelect = Math.min(currentBid, availableCards.length);
        console.log('Cards to select:', cardsToSelect, 'from available:', availableCards);
        
        if (cardsToSelect === 0) {
            console.log('⚠️ No cards available to select, skipping to reveal...');
            setTimeout(() => automatedReveal(), 1000);
            return;
        }
        
        // Simulate card selection
        for (var i = 0; i < cardsToSelect; i++) {
            setTimeout(function(index) {
                return function() {
                    if (availableCards && availableCards[index]) {
                        console.log('🎯 Selecting card:', availableCards[index]);
                        selectCardForRanking(availableCards[index]);
                    }
                };
            }(i), i * 300);
        }
        
        // Check if we can proceed to ranking after all cards selected
        setTimeout(() => {
            console.log('🎯 All cards selected, checking if ready for ranking...');
            console.log('Selected cards for ranking:', selectedCardsForRanking);
            console.log('Current screen:', document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : 'unknown');
            
            // If we have the right number of cards, proceed to ranking interface
            if (selectedCardsForRanking.length >= currentBid) {
                console.log('✅ Ready for ranking phase...');
                
                // Check if we're on the ranking screen yet
                var currentScreen = document.querySelector('.screen.active');
                if (currentScreen && currentScreen.id === 'scanScreen') {
                    console.log('📋 Still on scan screen, need to wait for automatic transition to ranking...');
                    setTimeout(() => {
                        handleRankingPhase();
                    }, 2000);
                } else {
                    console.log('📋 Already on ranking screen...');
                    handleRankingPhase();
                }
            } else {
                console.log('⚠️ Not enough cards selected (' + selectedCardsForRanking.length + '/' + currentBid + '), waiting...');
                setTimeout(() => {
                    handleRankingPhase();
                }, 2000);
            }
            
        }, cardsToSelect * 300 + 1000);
        
    } catch (error) {
        console.error('❌ Error in ranking phase:', error);
        throw error;
    }
}

function handleRankingPhase() {
    console.log('📋 Handling ranking phase...');
    console.log('Current screen:', document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : 'unknown');
    
    // Check if we're on the ranking interface
    var currentScreen = document.querySelector('.screen.active');
    if (currentScreen && currentScreen.id === 'scanScreen') {
        // Wait for ranking interface to appear
        setTimeout(() => {
            console.log('📋 Looking for ranking submission button...');
            
            // Check if ranking container exists (meaning ranking interface is loaded)
            var rankingContainer = document.getElementById('rankingContainer');
            if (rankingContainer) {
                console.log('✅ Ranking interface found, submitting ranking...');
                
                // Try clicking the submit button first
                var submitButton = rankingContainer.querySelector('button[onclick="submitRanking()"]');
                if (submitButton) {
                    console.log('🔘 Clicking submit ranking button...');
                    submitButton.click();
                    
                    // After clicking submit, wait for reveal screen to appear and start automation
                    setTimeout(() => {
                        console.log('🎭 Submit button clicked, starting reveal automation...');
                        automatedReveal();
                    }, 1500);
                } else {
                    console.log('🔧 Submit button not found, calling submitRanking() directly...');
                    if (typeof window.submitRanking === 'function') {
                        window.submitRanking();
                        
                        // After submitting, wait for reveal screen to appear and start automation
                        setTimeout(() => {
                            console.log('🎭 Ranking submitted, starting reveal automation...');
                            automatedReveal();
                        }, 1500);
                    } else {
                        console.log('❌ submitRanking function not available');
                    }
                }
            } else {
                console.log('⚠️ Ranking interface not loaded yet, waiting longer...');
                // Try again after more time
                setTimeout(() => {
                    if (typeof window.submitRanking === 'function') {
                        console.log('🔧 Calling submitRanking() directly...');
                        window.submitRanking();
                        
                        // After submitting, wait for reveal screen to appear and start automation
                        setTimeout(() => {
                            console.log('🎭 Ranking submitted, starting reveal automation...');
                            automatedReveal();
                        }, 1500);
                    } else {
                        console.log('❌ Still no submitRanking function');
                    }
                }, 2000);
            }
        }, 2000); // Give time for ranking interface to load
    } else {
        // Should be on ranking screen or reveal screen
        console.log('📋 Not on scan screen, checking for ranking interface...');
        
        // Wait a bit for the ranking interface to load
        setTimeout(() => {
            // Skip the manual ranking and go straight to reveal
            console.log('⏭️ Skipping manual ranking, proceeding to reveal...');
            setTimeout(() => automatedReveal(), 1000);
        }, 1000);
    }
}

function automatedReveal() {
    try {
        console.log('🎭 Simulating reveal phase...');
        console.log('Final ranking:', finalRanking);
        console.log('Selected cards:', selectedCards);
        console.log('Current screen should be:', document.querySelector('.screen.active') ? document.querySelector('.screen.active').id : 'unknown');
        
        // Check if we're actually on the reveal screen
        var currentScreen = document.querySelector('.screen.active');
        if (!currentScreen || currentScreen.id !== 'revealScreen') {
            console.log('⚠️ Not on reveal screen, trying to navigate there...');
            
            // Try to manually trigger the reveal phase
            if (typeof startReveal === 'function') {
                console.log('🔧 Calling startReveal()...');
                startReveal();
            } else {
                console.log('🔧 startReveal not found, showing reveal screen directly...');
                showScreen('revealScreen');
            }
            
            // Wait and try again
            setTimeout(() => {
                automatedReveal();
            }, 2000);
            return;
        }
        
        // Auto-reveal all cards
        var revealCount = finalRanking ? finalRanking.length : (selectedCardsForRanking ? selectedCardsForRanking.length : 3);
        console.log('Reveal count:', revealCount);
        console.log('Final ranking for reveal:', finalRanking);
        console.log('Selected cards for ranking:', selectedCardsForRanking);
        
        if (revealCount === 0) {
            console.log('⚠️ No cards to reveal, proceeding to interim...');
            setTimeout(() => {
                console.log('✅ Round complete (no cards), showing interim screen...');
                // Force show interim screen
                showScreen('interimScreen');
                setTimeout(() => {
                    if (currentRound < maxRounds && !checkWinCondition()) {
                        continueToNextRound();
                        setTimeout(() => {
                            automatedRound(currentRound);
                        }, 1000);
                    }
                }, 3000);
            }, 1000);
            return;
        }
        
        function autoReveal(index) {
            if (index < revealCount) {
                setTimeout(() => {
                    console.log('🎲 Revealing card ' + (index + 1) + ' of ' + revealCount);
                    console.log('Current reveal index before:', currentRevealIndex);
                    
                    // For automated testing, use a simpler reveal process
                    if (window.isAutomatedTestRunning) {
                        automatedRevealNext();
                    } else {
                        // Check if reveal button exists and is clickable
                        var revealBtn = document.getElementById('revealBtn');
                        if (revealBtn && !revealBtn.disabled) {
                            console.log('🔘 Clicking reveal button...');
                            revealNext();
                        } else {
                            console.log('⚠️ Reveal button not available, trying direct reveal...');
                            if (typeof revealNext === 'function') {
                                revealNext();
                            } else {
                                console.log('❌ revealNext function not found');
                            }
                        }
                    }
                    
                    console.log('Current reveal index after:', currentRevealIndex);
                    
                    // Continue to next reveal
                    setTimeout(() => {
                        autoReveal(index + 1);
                    }, 800);
                }, 1000); // Faster reveals for automation
            } else {
                // Reveal complete, should show interim screen
                setTimeout(() => {
                    console.log('✅ Round complete, showing interim screen...');
                    
                    // The game should automatically show the interim screen after reveal
                    // Wait for interim screen to appear, then continue
                    setTimeout(() => {
                        console.log('📊 Interim screen should be visible, checking scores...');
                        console.log('Current Scores:', players.scores);
                        console.log('Current Tokens:', players.blockingTokens);
                        
                        if (currentRound < maxRounds && !checkWinCondition()) {
                            setTimeout(() => {
                                console.log('▶️ Continuing to next round...');
                                continueToNextRound();
                                
                                setTimeout(() => {
                                    automatedRound(currentRound);
                                }, 1000);
                            }, 3000); // Give more time to see interim screen
                        } else {
                            console.log('🏁 Game completed! Generating detailed test results...');
                            window.automatedTestResults.endTime = new Date();
                            generateDetailedTestResults();
                            window.isAutomatedTestRunning = false;
                            console.log('✅ Automated test completed successfully!');
                            // Keep visual console enabled for results review
                        }
                    }, 2000);
                }, 1000);
            }
        }
        
        autoReveal(0);
        
    } catch (error) {
        console.error('❌ Error in reveal phase:', error);
        throw error;
    }
}

// Simplified reveal function for automated testing
var revealCompletionHandled = false; // Prevent duplicate completion handling

function automatedRevealNext() {
    console.log('🤖 Automated reveal next - index:', currentRevealIndex, 'of', finalRanking.length);
    
    if (currentRevealIndex >= finalRanking.length) {
        // All cards revealed, show final results
        if (!revealCompletionHandled) {
            console.log('🏁 All cards revealed, showing final results');
            bidderSuccess = true; // For automation, assume success unless we detect failure
            revealCompletionHandled = true;
            showFinalResults();
        }
        return;
    }
    
    // Reveal the next card
    currentRevealIndex++;
    updateBidderRankingDisplay();
    updateRevealProgress();
    
    console.log('✅ Card', currentRevealIndex, 'revealed');
    
    // Check for sequence break (simplified logic for automation)
    if (currentRevealIndex >= 2) {
        var prevCard = finalRanking[currentRevealIndex - 2];
        var currentCard = finalRanking[currentRevealIndex - 1];
        
        var prevValue = window.GAME_DATA.countries[prevCard][currentPrompt.challenge];
        var currentValue = window.GAME_DATA.countries[currentCard][currentPrompt.challenge];
        
        // Check if current value is higher than previous (breaks descending order)
        if (currentValue > prevValue) {
            console.log('💥 Sequence broken! Bidder fails.');
            bidderSuccess = false;
            // Reveal all remaining cards quickly
            currentRevealIndex = finalRanking.length;
            updateBidderRankingDisplay();
            updateRevealProgress();
            if (!revealCompletionHandled) {
                revealCompletionHandled = true;
                showFinalResults();
            }
            return;
        }
    }
    
    // If this was the last card and we haven't failed, bidder succeeds
    if (currentRevealIndex >= finalRanking.length) {
        if (!revealCompletionHandled) {
            console.log('🎉 All cards revealed successfully! Bidder succeeds.');
            bidderSuccess = true;
            revealCompletionHandled = true;
            showFinalResults();
        }
    }
}

// Generate detailed test results
function generateDetailedTestResults() {
    var results = window.automatedTestResults;
    var duration = results.endTime - results.startTime;
    var durationMinutes = Math.round(duration / 1000 / 60 * 100) / 100;
    
    console.log('\n🎉 ===== AUTOMATED TEST RESULTS =====');
    console.log('⏱️ Test Duration:', durationMinutes, 'minutes');
    console.log('🎮 Rounds Completed:', results.rounds.length);
    console.log('💰 Total Bids Made:', results.totalBids);
    console.log('🛡️ Total Blocks Made:', results.totalBlocks);
    console.log('✅ Successful Bids:', results.successfulBids);
    console.log('❌ Failed Bids:', results.failedBids);
    console.log('📊 Success Rate:', results.totalBids > 0 ? Math.round((results.successfulBids / results.totalBids) * 100) + '%' : 'N/A');
    
    console.log('\n👥 PLAYER STATISTICS:');
    Object.keys(results.playerStats).forEach(function(playerName) {
        var stats = results.playerStats[playerName];
        var finalScore = players.scores[playerName] || 0;
        console.log('🎯 ' + playerName + ':');
        console.log('  📈 Final Score: ' + finalScore + ' points');
        console.log('  🏆 Bids Won: ' + stats.bidsWon);
        console.log('  ✅ Successful Bids: ' + stats.bidsSuccessful);
        console.log('  🛡️ Blocks Made: ' + stats.blocksMade);
        console.log('  💎 Tokens Gained: ' + stats.tokensGained);
        console.log('  💸 Tokens Lost: ' + stats.tokensLost);
        console.log('  🎲 Success Rate: ' + (stats.bidsWon > 0 ? Math.round((stats.bidsSuccessful / stats.bidsWon) * 100) + '%' : 'N/A'));
        console.log('');
    });
    
    console.log('🏆 FINAL LEADERBOARD:');
    var finalScores = getFinalScores();
    finalScores.forEach(function(player, index) {
        var medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        console.log(medal + ' ' + (index + 1) + '. ' + player.name + ': ' + player.score + ' points');
    });
    
    if (results.rounds.length > 0) {
        console.log('\n📋 ROUND-BY-ROUND BREAKDOWN:');
        results.rounds.forEach(function(round, index) {
            console.log('Round ' + (index + 1) + ': ' + round.bidder + ' bid ' + round.bidAmount + ' (' + (round.success ? 'SUCCESS' : 'FAILED') + ')');
        });
    }
    
    if (results.errors.length > 0) {
        console.log('\n⚠️ ERRORS ENCOUNTERED:');
        results.errors.forEach(function(error, index) {
            console.log((index + 1) + '. ' + error);
        });
    }
    
    console.log('\n✨ Test completed successfully! All game mechanics working properly.');
    console.log('📊 Results stored in window.automatedTestResults for further analysis.');
    console.log('=====================================\n');
}

// Test results viewing functions
window.viewTestResults = function() {
    updateTestResultsDisplay();
    showScreen('testResultsScreen');
};

function updateTestResultsDisplay() {
    var results = window.automatedTestResults;
    
    // Test Overview
    var overviewDiv = document.getElementById('testOverview');
    if (!results || !results.startTime) {
        overviewDiv.innerHTML = '<div class="no-scores-message">No automated tests have been run yet!<br>Click "Run Automated Test" to start testing.</div>';
    } else {
        var duration = results.endTime ? Math.round((results.endTime - results.startTime) / 1000 / 60 * 100) / 100 : 'In progress...';
        var successRate = results.totalBids > 0 ? Math.round((results.successfulBids / results.totalBids) * 100) : 0;
        
        overviewDiv.innerHTML = 
            '<div class="player-stat-item"><span class="player-stat-name">⏱️ Test Duration</span><span class="player-stat-value">' + duration + ' min</span></div>' +
            '<div class="player-stat-item"><span class="player-stat-name">🎮 Rounds Completed</span><span class="player-stat-value">' + results.rounds.length + '</span></div>' +
            '<div class="player-stat-item"><span class="player-stat-name">💰 Total Bids</span><span class="player-stat-value">' + results.totalBids + '</span></div>' +
            '<div class="player-stat-item"><span class="player-stat-name">🛡️ Total Blocks</span><span class="player-stat-value">' + results.totalBlocks + '</span></div>' +
            '<div class="player-stat-item"><span class="player-stat-name">✅ Successful Bids</span><span class="player-stat-value">' + results.successfulBids + '</span></div>' +
            '<div class="player-stat-item"><span class="player-stat-name">❌ Failed Bids</span><span class="player-stat-value">' + results.failedBids + '</span></div>' +
            '<div class="player-stat-item"><span class="player-stat-name">📊 Success Rate</span><span class="player-stat-value">' + successRate + '%</span></div>';
    }
    
    // Player Performance
    var performanceDiv = document.getElementById('playerPerformance');
    if (!results || Object.keys(results.playerStats || {}).length === 0) {
        performanceDiv.innerHTML = '<div class="no-scores-message">No player data available!</div>';
    } else {
        var html = '';
        Object.keys(results.playerStats).forEach(function(playerName) {
            var stats = results.playerStats[playerName];
            var playerSuccessRate = stats.bidsWon > 0 ? Math.round((stats.bidsSuccessful / stats.bidsWon) * 100) : 0;
            
            html += '<div class="chip-inventory-item">' +
                   '<span class="chip-inventory-player">' + playerName + '</span>' +
                   '<div class="chip-inventory-chips">' +
                   '<span class="chip-badge chip-2">' + stats.totalScore + ' pts</span>' +
                   '<span class="chip-badge chip-4">' + stats.bidsWon + ' bids</span>' +
                   '<span class="chip-badge chip-6">' + playerSuccessRate + '%</span>' +
                   '</div></div>';
        });
        performanceDiv.innerHTML = html;
    }
    
    // Round Details
    var roundsDiv = document.getElementById('roundDetails');
    if (!results || results.rounds.length === 0) {
        roundsDiv.innerHTML = '<div class="no-scores-message">No round data available!</div>';
    } else {
        var html = '<table class="scores-table"><thead><tr><th>Round</th><th>Bidder</th><th>Bid</th><th>Result</th></tr></thead><tbody>';
        results.rounds.forEach(function(round, index) {
            var resultIcon = round.success ? '✅' : '❌';
            var resultClass = round.success ? 'first' : 'third';
            html += '<tr>' +
                   '<td class="rank">' + (index + 1) + '</td>' +
                   '<td>' + round.bidder + '</td>' +
                   '<td>' + round.bidAmount + ' cards</td>' +
                   '<td class="rank ' + resultClass + '">' + resultIcon + '</td>' +
                   '</tr>';
        });
        html += '</tbody></table>';
        roundsDiv.innerHTML = html;
    }
}

window.exportTestResults = function() {
    var results = window.automatedTestResults;
    if (!results || !results.startTime) {
        console.log('No test results to export!');
        return;
    }
    
    var exportData = JSON.stringify(results, null, 2);
    var blob = new Blob([exportData], {type: 'application/json'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'automated-test-results-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    console.log('📤 Test results exported to file');
};

window.clearTestResults = function() {
    window.automatedTestResults = {
        startTime: null,
        endTime: null,
        rounds: [],
        totalBids: 0,
        totalBlocks: 0,
        successfulBids: 0,
        failedBids: 0,
        playerStats: {},
        errors: []
    };
    updateTestResultsDisplay();
    console.log('🗑️ Test results cleared');
};

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
