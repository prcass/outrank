// Complete Know-It-All Game Logic
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
    allPlayers: [], // All players in the game
    chips: {} // Track each player's chips: {playerName: {3: true, 5: true, 7: true}}
};
var playerCount = 1;
var currentRound = 1;

// Initialize chips for all players
function initializePlayerChips() {
    players.chips = {};
    players.allPlayers.forEach(function(playerName) {
        players.chips[playerName] = {
            3: true,  // Has 3-point chip
            5: true,  // Has 5-point chip  
            7: true   // Has 7-point chip
        };
    });
}

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

// Player Management Functions
function addBlockerPlayer() {
    blockerPlayerCount++;
    var blockerHtml = '<div class="form-group" id="blockerGroup' + blockerPlayerCount + '">' +
        '<label>Blocker ' + blockerPlayerCount + ' Name:</label>' +
        '<input type="text" id="blocker' + blockerPlayerCount + '" placeholder="Enter blocker\'s name">' +
        '<button onclick="removeBlockerPlayer(' + blockerPlayerCount + ')" style="background: var(--error); color: white; border: none; padding: 8px 12px; border-radius: 6px; margin-left: 10px; cursor: pointer;">Remove</button>' +
        '</div>';
    
    document.getElementById('blockerPlayers').insertAdjacentHTML('beforeend', blockerHtml);
    updatePlayerSummary();
}

function removeBlockerPlayer(playerNum) {
    var group = document.getElementById('blockerGroup' + playerNum);
    if (group) {
        group.remove();
    }
    updatePlayerSummary();
}

function updatePlayerSummary() {
    var bidderName = document.getElementById('bidderName').value || 'Not set';
    var blockerNames = [];
    
    // Collect all blocker names
    for (var i = 1; i <= blockerPlayerCount; i++) {
        var blockerInput = document.getElementById('blocker' + i);
        if (blockerInput && blockerInput.value.trim()) {
            blockerNames.push(blockerInput.value.trim());
        }
    }
    
    var summary = '<strong>Bidder:</strong> ' + bidderName;
    if (blockerNames.length > 0) {
        summary += '<br><strong>Blockers:</strong> ' + blockerNames.join(', ');
    } else {
        summary += '<br><strong>Blockers:</strong> None added yet';
    }
    
    document.getElementById('playerSummary').innerHTML = summary;
    
    // Auto-update as users type
    setTimeout(function() {
        var bidderInput = document.getElementById('bidderName');
        if (bidderInput) {
            bidderInput.removeEventListener('input', updatePlayerSummary);
            bidderInput.addEventListener('input', updatePlayerSummary);
        }
        
        for (var i = 1; i <= blockerPlayerCount; i++) {
            var blockerInput = document.getElementById('blocker' + i);
            if (blockerInput) {
                blockerInput.removeEventListener('input', updatePlayerSummary);
                blockerInput.addEventListener('input', updatePlayerSummary);
            }
        }
    }, 100);
}

function startGameWithPlayers() {
    // Collect player names
    var bidderName = document.getElementById('bidderName').value.trim();
    if (!bidderName) {
        alert('Please enter the bidder\'s name');
        return;
    }
    
    var blockerNames = [];
    for (var i = 1; i <= blockerPlayerCount; i++) {
        var blockerInput = document.getElementById('blocker' + i);
        if (blockerInput && blockerInput.value.trim()) {
            blockerNames.push(blockerInput.value.trim());
        }
    }
    
    if (blockerNames.length === 0) {
        alert('Please add at least one blocker');
        return;
    }
    
    // Store player information for this round
    players.bidder = bidderName;
    players.blockers = blockerNames;
    players.allPlayers = [bidderName].concat(blockerNames);
    
    // Start the game
    simulateQRScan();
}

function rotateRoles() {
    if (players.allPlayers.length < 2) return;
    
    // Move current bidder to end of array and make next player the bidder
    var allPlayers = players.allPlayers.slice(); // Copy array
    var currentBidder = allPlayers.shift(); // Remove first player
    allPlayers.push(currentBidder); // Add to end
    
    players.allPlayers = allPlayers;
    players.bidder = allPlayers[0];
    players.blockers = allPlayers.slice(1);
    currentRound++;
    
    updatePlayerSetupScreen();
}

function updatePlayerSetupScreen() {
    // Update the player setup screen to show the rotation
    document.getElementById('bidderName').value = players.bidder;
    
    // Clear existing blocker inputs
    var blockerContainer = document.getElementById('blockerPlayers');
    blockerContainer.innerHTML = '';
    
    // Add blocker inputs for current round
    players.blockers.forEach(function(name, index) {
        var blockerHtml = '<div class="form-group" id="blockerGroup' + (index + 1) + '">' +
            '<label>Blocker ' + (index + 1) + ' Name:</label>' +
            '<input type="text" id="blocker' + (index + 1) + '" value="' + name + '">' +
            '</div>';
        blockerContainer.insertAdjacentHTML('beforeend', blockerHtml);
    });
    
    blockerPlayerCount = players.blockers.length;
    updatePlayerSummary();
}

// Initialize player summary when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updatePlayerSummary, 500);
});
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

function updateBlockerScreen() {
    // Update prompt info
    document.getElementById('promptInfo').innerHTML = 
        '<div class="card-title">' + currentPrompt.label + '</div>' +
        '<div class="card-description">Challenge: ' + currentPrompt.challenge.toUpperCase() + '</div>';
    
    // Hide the drawn cards display - remove this section completely
    document.getElementById('drawnCardsInfo').innerHTML = '';
    
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
                            var country = SAMPLE_DATA.countries[cardId];
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
    
    document.getElementById('blockerSetup').innerHTML = blockerHtml;
    updateBlocksList();
}

function placeChipBlock(playerName, points) {
    var cardSelect = document.getElementById(playerName + '_' + points + '_card');
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
    
    // Refresh the blocker screen to update available chips
    updateBlockerScreen();
}

function updateBlocksList() {
    var blocksList = document.getElementById('blocksList');
    
    if (blocks.length === 0) {
        blocksList.innerHTML = '<p style="color: var(--on-surface-variant); text-align: center;">No blocks placed yet</p>';
        return;
    }
    
    var blocksHtml = '';
    blocks.forEach(function(block, index) {
        var country = SAMPLE_DATA.countries[block.cardId];
        blocksHtml += '<div class="blocker-item" style="display: flex; justify-content: space-between; align-items: center;">' +
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

// Remove the old toggleBlock function since we're not using checkboxes anymore

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
        '<p style="margin-top: 12px; text-align: center;">Bid Amount: ' + bidAmount + ' cards</p>' +
        '<p style="text-align: center;">Cards needed: ' + (bidAmount - scannedAnswers.length) + '</p>';
    
    if (blocks.length > 0) {
        scanInfo += '<p style="color: var(--error); margin-top: 8px; text-align: center;">⚠️ Blocked cards: ';
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
        cardsList += '<div class="card revealed" style="margin: 8px; display: inline-block;">';
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
        
        cardsHtml += '<div class="' + cardClass + '" style="margin: 8px; display: inline-block;">' + cardContent + '</div>';
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
    var title = bidderWins ? '🎉 ' + players.bidder + ' Wins!' : '😞 ' + players.bidder + ' Loses!';
    document.getElementById('resultsTitle').textContent = title;
    
    // Update header color based on result
    var header = document.getElementById('resultsHeader');
    if (bidderWins) {
        header.style.background = 'linear-gradient(135deg, var(--accent) 0%, #059669 100%)';
    } else {
        header.style.background = 'linear-gradient(135deg, var(--error) 0%, #dc2626 100%)';
    }
    
    var content = '<div class="card-title">Round ' + currentRound + ' Results</div>' +
        '<div class="card-description">' + gameOverReason + '</div>';
    
    // Add player-specific results
    if (bidderWins) {
        content += '<div style="margin-top: 16px; padding: 16px; background: var(--surface-elevated); border-radius: 12px;">' +
            '<div style="font-weight: 600; color: var(--accent);">🏆 ' + players.bidder + ' succeeded!</div>' +
            '<div style="font-size: 14px; color: var(--on-surface-variant); margin-top: 4px;">Perfect ranking! All cards were ordered correctly.</div>' +
            '</div>';
        
        // Show other players
        var otherPlayers = players.allPlayers.filter(function(name) {
            return name !== players.bidder;
        });
        
        if (otherPlayers.length > 0) {
            content += '<div style="margin-top: 12px; padding: 16px; background: var(--surface-elevated); border-radius: 12px;">' +
                '<div style="font-weight: 600; color: var(--on-surface-variant);">Other players: ' + otherPlayers.join(', ') + '</div>' +
                '<div style="font-size: 14px; color: var(--on-surface-variant); margin-top: 4px;">' + players.bidder + ' got through all the blocks and challenges!</div>' +
                '</div>';
        }
    } else {
        content += '<div style="margin-top: 16px; padding: 16px; background: var(--surface-elevated); border-radius: 12px;">' +
            '<div style="font-weight: 600; color: var(--error);">😞 ' + players.bidder + ' failed</div>' +
            '<div style="font-size: 14px; color: var(--on-surface-variant); margin-top: 4px;">The ranking was incorrect or a block was hit.</div>' +
            '</div>';
        
        // Show other players and whether blocks contributed
        var otherPlayers = players.allPlayers.filter(function(name) {
            return name !== players.bidder;
        });
        
        if (otherPlayers.length > 0) {
            // Check if any blocks were actually hit
            var blockWasHit = false;
            scannedAnswers.forEach(function(cardId) {
                blocks.forEach(function(block) {
                    if (cardId === block.cardId) {
                        blockWasHit = true;
                    }
                });
            });
            
            if (blocks.length > 0 && blockWasHit) {
                content += '<div style="margin-top: 12px; padding: 16px; background: var(--surface-elevated); border-radius: 12px;">' +
                    '<div style="font-weight: 600; color: var(--accent);">📌 Other players: ' + otherPlayers.join(', ') + '</div>' +
                    '<div style="font-size: 14px; color: var(--on-surface-variant); margin-top: 4px;">The blocks you placed helped stop the bidder!</div>' +
                    '</div>';
            } else {
                content += '<div style="margin-top: 12px; padding: 16px; background: var(--surface-elevated); border-radius: 12px;">' +
                    '<div style="font-weight: 600; color: var(--on-surface-variant);">Other players: ' + otherPlayers.join(', ') + '</div>' +
                    '<div style="font-size: 14px; color: var(--on-surface-variant); margin-top: 4px;">' + players.bidder + ' made a ranking error.</div>' +
                    '</div>';
            }
        }
    }
    
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
        
        rankingHtml += '<div class="' + cardClass + '" style="margin: 8px; display: inline-block;">';
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
    
    // Go back to player selection for next round
    if (players.allPlayers && players.allPlayers.length > 0) {
        currentRound++;
        
        // Update the bidder dropdown to current players
        var bidderSelect = document.getElementById('bidderSelect');
        bidderSelect.innerHTML = '<option value="">Select the bidder...</option>';
        
        players.allPlayers.forEach(function(name) {
            var option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            bidderSelect.appendChild(option);
        });
        
        updateRoundSummary();
        showScreen('playerScreen');
    } else {
        // No players set up, go back to title
        showScreen('titleScreen');
    }
}
                '</div>';
            
            showScreen('playerScreen');
            return;
        }
        // If choice is '1' or anything else, continue with same roles
    }
    
    showScreen('titleScreen');
}
