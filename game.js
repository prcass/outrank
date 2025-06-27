// Game state variables
var prompt = null;
var bidAmount = 0;
var scannedAnswers = [];
var revealIndex = 0;

// Sample data
var SAMPLE_DATA = {
    prompts: {
        gdp: { challenge: 'gdp', label: 'Rank by GDP (Highest to Lowest)' },
        population: { challenge: 'population', label: 'Rank by Population (Highest to Lowest)' },
        area: { challenge: 'area', label: 'Rank by Area (Largest to Smallest)' }
    },
    countries: {
        '001': { id: '001', name: 'United States', gdp: 21427700, population: 331002651, area: 9833517 },
        '002': { id: '002', name: 'China', gdp: 14342300, population: 1439323776, area: 9596961 },
        '003': { id: '003', name: 'Japan', gdp: 4937422, population: 126476461, area: 377975 },
        '004': { id: '004', name: 'Germany', gdp: 3846414, population: 83783942, area: 357114 },
        '005': { id: '005', name: 'India', gdp: 2875142, population: 1380004385, area: 3287263 },
        '006': { id: '006', name: 'United Kingdom', gdp: 2829108, population: 67886011, area: 242495 },
        '007': { id: '007', name: 'France', gdp: 2715518, population: 65273511, area: 551695 },
        '008': { id: '008', name: 'Italy', gdp: 2001244, population: 60461826, area: 301340 },
        '009': { id: '009', name: 'Brazil', gdp: 1839758, population: 212559417, area: 8515767 },
        '010': { id: '010', name: 'Canada', gdp: 1736426, population: 37742154, area: 9984670 }
    }
};

// Main game functions
function simulateQRScan() {
    var prompts = ['gdp', 'population', 'area'];
    var selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    prompt = SAMPLE_DATA.prompts[selectedPrompt];
    
    document.getElementById('promptLabel').textContent = prompt.label;
    showScreen('blockerScreen');
}

function proceedToScanning() {
    var bid = parseInt(document.getElementById('bidAmount').value);
    if (!bid || bid < 1 || bid > 10) {
        alert('Please enter a bid amount between 1 and 10');
        return;
    }
    bidAmount = bid;
    scannedAnswers = [];
    
    document.getElementById('scanInfo').textContent = prompt.label + ' - Bid: ' + bid + ' cards';
    updateScanScreen();
    showScreen('scanScreen');
}

function scanCard() {
    var cardId = document.getElementById('cardInput').value.trim().toUpperCase();
    if (cardId.length === 1) cardId = '00' + cardId;
    if (cardId.length === 2) cardId = '0' + cardId;
    
    if (!SAMPLE_DATA.countries[cardId]) {
        alert('Please enter a valid card ID (001-010)');
        return;
    }
    
    if (scannedAnswers.indexOf(cardId) !== -1) {
        alert('Card already scanned!');
        return;
    }
    
    if (scannedAnswers.length >= bidAmount) {
        alert('Already scanned enough cards!');
        return;
    }
    
    scannedAnswers.push(cardId);
    document.getElementById('cardInput').value = '';
    updateScanScreen();
}

function simulateAllCards() {
    var allCards = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010'];
    var remaining = bidAmount - scannedAnswers.length;
    var available = allCards.filter(function(id) {
        return scannedAnswers.indexOf(id) === -1;
    });
    
    var shuffled = available.sort(function() { return Math.random() - 0.5; });
    var selected = shuffled.slice(0, remaining);
    scannedAnswers = scannedAnswers.concat(selected);
    updateScanScreen();
}

function updateScanScreen() {
    var list = scannedAnswers.map(function(cardId, index) {
        var country = SAMPLE_DATA.countries[cardId];
        return (index + 1) + '. ' + cardId + ' - ' + country.name;
    }).join('<br>');
    
    document.getElementById('scannedList').innerHTML = 'Scanned: ' + scannedAnswers.length + '/' + bidAmount + '<br>' + list;
    
    if (scannedAnswers.length >= bidAmount) {
        document.getElementById('finishBtn').style.display = 'block';
    }
}

function finishScanning() {
    revealIndex = 0;
    document.getElementById('revealInfo').textContent = prompt.label + ' - Revealing your ranking...';
    updateRevealScreen();
    showScreen('revealScreen');
}

function updateRevealScreen() {
    var cards = '';
    for (var i = 0; i < scannedAnswers.length; i++) {
        var cardId = scannedAnswers[i];
        var country = SAMPLE_DATA.countries[cardId];
        var isRevealed = i < revealIndex;
        var isCurrently = i === revealIndex;
        
        var className = 'gray';
        var content = 'Position ' + (i + 1) + ': ???';
        
        if (isRevealed || isCurrently) {
            var metric = prompt.challenge;
            var value = country[metric];
            var formattedValue = '';
            
            if (metric === 'gdp') {
                formattedValue = 'GDP: $' + value.toLocaleString() + 'M';
            } else if (metric === 'population') {
                formattedValue = 'Pop: ' + value.toLocaleString();
            } else if (metric === 'area') {
                formattedValue = 'Area: ' + value.toLocaleString() + ' km²';
            }
            
            content = 'Position ' + (i + 1) + ': ' + cardId + ' - ' + country.name + '<br>' + formattedValue;
            
            if (i === 0) {
                className = 'green';
            } else if (isRevealed || isCurrently) {
                var prevCard = scannedAnswers[i - 1];
                var prevCountry = SAMPLE_DATA.countries[prevCard];
                
                if (country[metric] > prevCountry[metric]) {
                    className = 'red';
                } else {
                    className = 'green';
                }
            }
        }
        
        cards += '<div class="reveal-card ' + className + '">' + content + '</div>';
    }
    
    document.getElementById('revealCards').innerHTML = cards;
    
    if (revealIndex >= scannedAnswers.length) {
        document.getElementById('revealBtn').style.display = 'none';
    } else {
        document.getElementById('revealBtn').textContent = '▶️ Reveal Next Card (' + (revealIndex + 1) + '/' + scannedAnswers.length + ')';
    }
}

function revealNext() {
    revealIndex++;
    updateRevealScreen();
    
    if (revealIndex === 1) {
        return;
    }
    
    var currentCard = scannedAnswers[revealIndex - 1];
    var prevCard = scannedAnswers[revealIndex - 2];
    var currentCountry = SAMPLE_DATA.countries[currentCard];
    var prevCountry = SAMPLE_DATA.countries[prevCard];
    var metric = prompt.challenge;
    
    if (currentCountry[metric] > prevCountry[metric]) {
        document.getElementById('revealBtn').style.display = 'none';
        
        setTimeout(function() {
            document.getElementById('resultTitle').textContent = 'Blockers Win!';
            document.getElementById('resultMessage').textContent = 'Wrong order! ' + currentCountry.name + ' (' + currentCountry[metric].toLocaleString() + ') has higher ' + metric + ' than ' + prevCountry.name + ' (' + prevCountry[metric].toLocaleString() + ')';
            showScreen('resultScreen');
        }, 1500);
        return;
    }
    
    if (revealIndex >= scannedAnswers.length) {
        document.getElementById('revealBtn').style.display = 'none';
        
        setTimeout(function() {
            document.getElementById('resultTitle').textContent = 'Bidder Wins!';
            document.getElementById('resultMessage').textContent = 'Perfect ranking! You got them all in the correct order.';
            showScreen('resultScreen');
        }, 1000);
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(function(screen) {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function resetGame() {
    document.querySelectorAll('.screen').forEach(function(screen) {
        screen.classList.remove('active');
    });
    prompt = null;
    bidAmount = 0;
    scannedAnswers = [];
    revealIndex = 0;
    document.getElementById('bidAmount').value = '';
    document.getElementById('cardInput').value = '';
    document.getElementById('finishBtn').style.display = 'none';
    document.getElementById('revealBtn').style.display = 'block';
}
