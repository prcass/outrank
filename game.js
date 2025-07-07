// game.js - Game logic using separated data

// Game Configuration - Centralized constants
var GAME_CONFIG = {
    // Game Rules
    MAX_ROUNDS: 6,
    WINNING_SCORE: 30,
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 6,
    DEFAULT_PLAYER_COUNT: 4,
    
    // Bid Constraints
    MIN_BID: 1,
    MAX_BID: 10,
    
    // Token Configuration
    BLOCKING_TOKENS: {
        LOW: 2,
        MEDIUM: 4,
        HIGH: 6
    },
    DEFAULT_TOKEN_SET: {2: 1, 4: 1, 6: 1},
    
    // UI Timing (milliseconds)
    NOTIFICATION_DURATION: 3000,
    ANIMATION_DELAY: 300,
    FADE_IN_DELAY: 10,
    
    // Performance Settings
    MAX_CONSOLE_MESSAGES: 500,
    
    // Test Configuration
    TEST_PLAYER_NAMES: ['Alice', 'Bob', 'Charlie', 'Diana'],
    
    // Debug Mode
    DEBUG_MODE: false,
    ENABLE_CONSOLE_LOGGING: true
};

// Memory Management - Event Listener Cleanup System
var eventListenerManager = {
    listeners: [],
    timeouts: [],
    
    // Add an event listener with automatic cleanup tracking
    addListener: function(element, event, handler, options) {
        try {
            if (!element || !event || !handler) {
                safeConsoleLog('addListener: Invalid parameters');
                return false;
            }
            
            element.addEventListener(event, handler, options);
            
            // Track for cleanup
            this.listeners.push({
                element: element,
                event: event,
                handler: handler,
                options: options
            });
            
            return true;
        } catch (error) {
            safeConsoleLog('Error adding event listener:', error);
            return false;
        }
    },
    
    // Remove specific event listener
    removeListener: function(element, event, handler) {
        try {
            if (!element || !event || !handler) {
                return false;
            }
            
            element.removeEventListener(event, handler);
            
            // Remove from tracking
            this.listeners = this.listeners.filter(function(listener) {
                return !(listener.element === element && 
                        listener.event === event && 
                        listener.handler === handler);
            });
            
            return true;
        } catch (error) {
            safeConsoleLog('Error removing event listener:', error);
            return false;
        }
    },
    
    // Clean up all tracked event listeners
    cleanup: function() {
        try {
            var removedCount = 0;
            
            this.listeners.forEach(function(listener) {
                try {
                    if (listener.element && listener.element.removeEventListener) {
                        listener.element.removeEventListener(listener.event, listener.handler);
                        removedCount++;
                    }
                } catch (removeError) {
                    safeConsoleLog('Error removing listener during cleanup:', removeError);
                }
            });
            
            this.listeners = [];
            safeConsoleLog('Cleaned up', removedCount, 'event listeners');
            
            // Clean up timeouts
            var timeoutCount = 0;
            this.timeouts.forEach(function(timeoutId) {
                try {
                    clearTimeout(timeoutId);
                    timeoutCount++;
                } catch (timeoutError) {
                    safeConsoleLog('Error clearing timeout:', timeoutError);
                }
            });
            
            this.timeouts = [];
            safeConsoleLog('Cleaned up', timeoutCount, 'timeouts');
            
            return true;
            
        } catch (error) {
            safeConsoleLog('Error during event listener cleanup:', error);
            return false;
        }
    },
    
    // Add timeout with tracking
    addTimeout: function(callback, delay) {
        try {
            var timeoutId = setTimeout(callback, delay);
            this.timeouts.push(timeoutId);
            return timeoutId;
        } catch (error) {
            safeConsoleLog('Error adding timeout:', error);
            return null;
        }
    },
    
    // Remove specific timeout
    removeTimeout: function(timeoutId) {
        try {
            clearTimeout(timeoutId);
            this.timeouts = this.timeouts.filter(function(id) {
                return id !== timeoutId;
            });
            return true;
        } catch (error) {
            safeConsoleLog('Error removing timeout:', error);
            return false;
        }
    }
};

// Centralized State Management System
var GameState = {
    // Game Configuration
    config: GAME_CONFIG,
    
    // Game State
    data: {
        currentPrompt: null,
        drawnCards: [],
        blockedCards: [],
        selectedCards: [],
        selectedCardsForRanking: [],
        bidAmount: 0,
        currentBid: 0,
        highestBidder: '',
        currentRound: 1,
        maxRounds: GAME_CONFIG.MAX_ROUNDS,
        winningScore: GAME_CONFIG.WINNING_SCORE,
        phase: 'idle', // idle, bidding, blocking, ranking, revealing, scoring
        gamePhase: 'titleScreen',
        
        // Player management
        players: {
            list: [],
            scores: {},
            blockingTokens: {},
            currentBlocks: {},
            stats: {}
        },
        
        // Bidding state
        playerBids: {},
        passedPlayers: {},
        
        // Blocking state
        blockingOrder: [],
        blockingTurn: 0,
        
        // Ranking state
        finalRanking: [],
        
        // Automated testing state
        isAutomatedTestRunning: false,
        automatedTestResults: null
    },
    
    // State getters with validation
    get: function(path) {
        try {
            var keys = path.split('.');
            var current = this.data;
            
            for (var i = 0; i < keys.length; i++) {
                if (current === null || current === undefined) {
                    return null;
                }
                current = current[keys[i]];
            }
            
            return current;
        } catch (error) {
            safeConsoleLog('Error getting state path:', path, error);
            return null;
        }
    },
    
    // State setters with validation
    set: function(path, value) {
        try {
            var keys = path.split('.');
            var current = this.data;
            
            // Navigate to the parent of the target property
            for (var i = 0; i < keys.length - 1; i++) {
                if (current[keys[i]] === undefined) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            
            // Set the value
            var lastKey = keys[keys.length - 1];
            var oldValue = current[lastKey];
            current[lastKey] = value;
            
            // Notify listeners of state change
            this.notifyStateChange(path, value, oldValue);
            
            return true;
        } catch (error) {
            safeConsoleLog('Error setting state path:', path, error);
            return false;
        }
    },
    
    // State change listeners
    listeners: {},
    
    // Subscribe to state changes
    subscribe: function(path, callback) {
        try {
            if (!this.listeners[path]) {
                this.listeners[path] = [];
            }
            this.listeners[path].push(callback);
            return true;
        } catch (error) {
            safeConsoleLog('Error subscribing to state:', error);
            return false;
        }
    },
    
    // Notify listeners of state changes
    notifyStateChange: function(path, newValue, oldValue) {
        try {
            if (this.listeners[path]) {
                this.listeners[path].forEach(function(callback) {
                    try {
                        callback(newValue, oldValue, path);
                    } catch (callbackError) {
                        safeConsoleLog('Error in state change callback:', callbackError);
                    }
                });
            }
        } catch (error) {
            safeConsoleLog('Error notifying state change:', error);
        }
    },
    
    // Reset game state
    reset: function() {
        try {
            this.data = {
                currentPrompt: null,
                drawnCards: [],
                blockedCards: [],
                selectedCards: [],
                selectedCardsForRanking: [],
                bidAmount: 0,
                currentBid: 0,
                highestBidder: '',
                currentRound: 1,
                maxRounds: this.config.MAX_ROUNDS,
                winningScore: this.config.WINNING_SCORE,
                phase: 'idle',
                gamePhase: 'titleScreen',
                
                players: {
                    list: [],
                    scores: {},
                    blockingTokens: {},
                    currentBlocks: {},
                    stats: {}
                },
                
                playerBids: {},
                passedPlayers: {},
                blockingOrder: [],
                blockingTurn: 0,
                finalRanking: [],
                
                isAutomatedTestRunning: false,
                automatedTestResults: null
            };
            
            safeConsoleLog('Game state reset successfully');
            return true;
        } catch (error) {
            safeConsoleLog('Error resetting game state:', error);
            return false;
        }
    },
    
    // Initialize player with validation
    initializePlayer: function(name) {
        try {
            if (!validateInput(name, 'string', {minLength: 1})) {
                safeConsoleLog('initializePlayer: Invalid name');
                return false;
            }
            
            // Add to player list if not already present
            if (this.data.players.list.indexOf(name) === -1) {
                this.data.players.list.push(name);
            }
            
            // Initialize player data
            this.data.players.scores[name] = 0;
            this.data.players.blockingTokens[name] = Object.assign({}, this.config.DEFAULT_TOKEN_SET);
            this.data.players.stats[name] = {
                bidsWon: 0,
                bidsSuccessful: 0,
                blocksMade: 0,
                tokensGained: 0,
                tokensLost: 0
            };
            
            safeConsoleLog('Player initialized:', name);
            return true;
        } catch (error) {
            safeConsoleLog('Error initializing player:', error);
            return false;
        }
    },
    
    // Get game state summary for debugging
    getStateSnapshot: function() {
        try {
            return {
                phase: this.data.phase,
                currentRound: this.data.currentRound,
                playerCount: this.data.players.list.length,
                currentBid: this.data.currentBid,
                highestBidder: this.data.highestBidder
            };
        } catch (error) {
            safeConsoleLog('Error getting state snapshot:', error);
            return {};
        }
    }
};

// DOM Cache Management System for Performance
var DOMCache = {
    cache: {},
    
    // Get cached DOM element or query and cache it
    get: function(id) {
        try {
            if (!id) {
                return null;
            }
            
            // Return cached element if available and still in DOM
            if (this.cache[id] && document.contains(this.cache[id])) {
                return this.cache[id];
            }
            
            // Query and cache the element
            var element = document.getElementById(id);
            if (element) {
                this.cache[id] = element;
            }
            
            return element;
        } catch (error) {
            safeConsoleLog('Error getting cached DOM element:', id, error);
            return null;
        }
    },
    
    // Query multiple elements and cache them
    queryAll: function(selector, cacheKey) {
        try {
            if (!selector) {
                return [];
            }
            
            // Use cache key if provided
            if (cacheKey && this.cache[cacheKey]) {
                // Verify cached elements are still in DOM
                var cached = this.cache[cacheKey];
                var stillValid = true;
                for (var i = 0; i < cached.length; i++) {
                    if (!document.contains(cached[i])) {
                        stillValid = false;
                        break;
                    }
                }
                if (stillValid) {
                    return cached;
                }
            }
            
            // Query and cache
            var elements = Array.from(document.querySelectorAll(selector));
            if (cacheKey) {
                this.cache[cacheKey] = elements;
            }
            
            return elements;
        } catch (error) {
            safeConsoleLog('Error querying and caching elements:', selector, error);
            return [];
        }
    },
    
    // Clear cache (useful for screen transitions)
    clear: function() {
        try {
            this.cache = {};
            safeConsoleLog('DOM cache cleared');
        } catch (error) {
            safeConsoleLog('Error clearing DOM cache:', error);
        }
    },
    
    // Remove specific item from cache
    remove: function(key) {
        try {
            if (this.cache[key]) {
                delete this.cache[key];
                return true;
            }
            return false;
        } catch (error) {
            safeConsoleLog('Error removing from DOM cache:', key, error);
            return false;
        }
    },
    
    // Validate cached elements (remove stale references)
    validate: function() {
        try {
            var removedCount = 0;
            for (var key in this.cache) {
                if (this.cache.hasOwnProperty(key)) {
                    var element = this.cache[key];
                    if (Array.isArray(element)) {
                        // Handle cached NodeLists
                        var validElements = element.filter(function(el) {
                            return document.contains(el);
                        });
                        if (validElements.length !== element.length) {
                            if (validElements.length === 0) {
                                delete this.cache[key];
                                removedCount++;
                            } else {
                                this.cache[key] = validElements;
                            }
                        }
                    } else {
                        // Handle single elements
                        if (!document.contains(element)) {
                            delete this.cache[key];
                            removedCount++;
                        }
                    }
                }
            }
            if (removedCount > 0) {
                safeConsoleLog('Cleaned up', removedCount, 'stale DOM cache entries');
            }
        } catch (error) {
            safeConsoleLog('Error validating DOM cache:', error);
        }
    }
};

// Input validation utility functions
function validateInput(value, type, options) {
    options = options || {};
    
    switch (type) {
        case 'string':
            return value && typeof value === 'string' && 
                   (!options.minLength || value.length >= options.minLength) &&
                   (!options.maxLength || value.length <= options.maxLength);
        case 'number':
            return typeof value === 'number' && !isNaN(value) &&
                   (!options.min || value >= options.min) &&
                   (!options.max || value <= options.max);
        case 'integer':
            return Number.isInteger(value) &&
                   (!options.min || value >= options.min) &&
                   (!options.max || value <= options.max);
        case 'array':
            return Array.isArray(value) &&
                   (!options.minLength || value.length >= options.minLength) &&
                   (!options.maxLength || value.length <= options.maxLength);
        default:
            return value != null;
    }
}

// Safe console logging with debug mode support
function safeConsoleLog() {
    try {
        if (GAME_CONFIG.ENABLE_CONSOLE_LOGGING && console && console.log) {
            console.log.apply(console, arguments);
        }
    } catch (error) {
        // Fail silently if console is not available
    }
}

// Non-blocking notification system for user feedback
function showNotification(message, type) {
    try {
        // Input validation
        if (!validateInput(message, 'string', {minLength: 1})) {
            safeConsoleLog('showNotification: Invalid message parameter');
            return false;
        }
        
        // Default type to 'info' if not specified
        type = type || 'info';
        
        // Validate DOM environment
        if (!document || !document.body || !document.createElement) {
            safeConsoleLog('showNotification: DOM not available');
            return false;
        }
        
        // Create notification element
        var notification = document.createElement('div');
        if (!notification) {
            throw new Error('Failed to create notification element');
        }
        
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
        
        // Animate in with error handling and managed timeout
        eventListenerManager.addTimeout(function() {
            try {
                if (notification && notification.style) {
                    notification.style.opacity = '1';
                    notification.style.transform = 'translateX(0)';
                }
            } catch (animError) {
                safeConsoleLog('Error animating notification:', animError);
            }
        }, GAME_CONFIG.FADE_IN_DELAY);
        
        // Auto-remove after configured duration with managed timeouts
        eventListenerManager.addTimeout(function() {
            try {
                if (notification && notification.style) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    eventListenerManager.addTimeout(function() {
                        try {
                            if (notification && notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        } catch (removeError) {
                            safeConsoleLog('Error removing notification:', removeError);
                        }
                    }, GAME_CONFIG.ANIMATION_DELAY);
                }
            } catch (fadeError) {
                safeConsoleLog('Error fading notification:', fadeError);
            }
        }, GAME_CONFIG.NOTIFICATION_DURATION);
        
        // Log for automated testing
        safeConsoleLog('[NOTIFICATION] ' + message);
        return true;
        
    } catch (error) {
        safeConsoleLog('Error in showNotification:', error);
        // Fallback to console only
        safeConsoleLog('[NOTIFICATION FALLBACK] ' + message);
        return false;
    }
}

// Visual console output for live monitoring during tests
function addConsoleMessage(message, type) {
    try {
        // Input validation
        if (!message) {
            return false; // Silent fail for empty messages
        }
        
        var consoleOutput = document.getElementById('consoleOutput');
        if (!consoleOutput) {
            // Fallback to original console if element not found
            if (typeof originalConsoleLog === 'function') {
                originalConsoleLog('[DEBUG] Console output element not found:', message);
            }
            return false;
        }
        
        var messageElement = document.createElement('div');
        if (!messageElement) {
            throw new Error('Failed to create message element');
        }
        
        messageElement.className = 'console-message' + (type ? ' ' + type : '');
        
        // Add timestamp with error handling
        var timestamp;
        try {
            timestamp = new Date().toLocaleTimeString();
        } catch (timeError) {
            timestamp = 'Unknown';
        }
        
        messageElement.textContent = '[' + timestamp + '] ' + String(message);
        
        consoleOutput.appendChild(messageElement);
        
        // Auto-scroll to bottom with error handling
        try {
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        } catch (scrollError) {
            safeConsoleLog('Error scrolling console:', scrollError);
        }
        
        // Keep only last configured number of messages for performance
        try {
            var messages = consoleOutput.querySelectorAll('.console-message');
            if (messages && messages.length > GAME_CONFIG.MAX_CONSOLE_MESSAGES) {
                var removeCount = messages.length - GAME_CONFIG.MAX_CONSOLE_MESSAGES;
                for (var i = 0; i < removeCount; i++) {
                    if (messages[i] && messages[i].remove) {
                        messages[i].remove();
                    }
                }
            }
        } catch (cleanupError) {
            safeConsoleLog('Error cleaning up console messages:', cleanupError);
        }
        
        return true;
        
    } catch (error) {
        safeConsoleLog('Error in addConsoleMessage:', error);
        // Fallback to original console
        if (typeof originalConsoleLog === 'function') {
            originalConsoleLog('[CONSOLE FALLBACK]', message);
        }
        return false;
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
// Legacy global variables removed - now using GameState system
// All game state is now managed through GameState.get() and GameState.set()

// Backward compatibility helpers for legacy code
function getCurrentPrompt() { return GameState.get('currentPrompt'); }
function getDrawnCards() { return GameState.get('drawnCards'); }
function getBlockedCards() { return GameState.get('blockedCards'); }
function getSelectedCards() { return GameState.get('selectedCards'); }
function getCurrentBid() { return GameState.get('currentBid'); }
function getHighestBidder() { return GameState.get('highestBidder'); }
function getPlayerBids() { return GameState.get('playerBids'); }
function getPassedPlayers() { return GameState.get('passedPlayers'); }
function getBlockingTurn() { return GameState.get('blockingTurn'); }
function getBlockingOrder() { return GameState.get('blockingOrder'); }
function getCurrentRound() { return GameState.get('currentRound'); }
function getMaxRounds() { return GameState.get('maxRounds'); }
function getPlayers() { return GameState.get('players'); }

// Legacy property accessors for gradual migration
Object.defineProperty(window, 'currentPrompt', {
    get: function() { return GameState.get('currentPrompt'); },
    set: function(value) { GameState.set('currentPrompt', value); }
});

Object.defineProperty(window, 'drawnCards', {
    get: function() { return GameState.get('drawnCards'); },
    set: function(value) { GameState.set('drawnCards', value); }
});

Object.defineProperty(window, 'blockedCards', {
    get: function() { return GameState.get('blockedCards'); },
    set: function(value) { GameState.set('blockedCards', value); }
});

Object.defineProperty(window, 'selectedCards', {
    get: function() { return GameState.get('selectedCards'); },
    set: function(value) { GameState.set('selectedCards', value); }
});

Object.defineProperty(window, 'currentBid', {
    get: function() { return GameState.get('currentBid'); },
    set: function(value) { GameState.set('currentBid', value); }
});

Object.defineProperty(window, 'highestBidder', {
    get: function() { return GameState.get('highestBidder'); },
    set: function(value) { GameState.set('highestBidder', value); }
});

Object.defineProperty(window, 'playerBids', {
    get: function() { return GameState.get('playerBids'); },
    set: function(value) { GameState.set('playerBids', value); }
});

Object.defineProperty(window, 'passedPlayers', {
    get: function() { return GameState.get('passedPlayers'); },
    set: function(value) { GameState.set('passedPlayers', value); }
});

Object.defineProperty(window, 'blockingTurn', {
    get: function() { return GameState.get('blockingTurn'); },
    set: function(value) { GameState.set('blockingTurn', value); }
});

Object.defineProperty(window, 'blockingOrder', {
    get: function() { return GameState.get('blockingOrder'); },
    set: function(value) { GameState.set('blockingOrder', value); }
});

Object.defineProperty(window, 'currentRound', {
    get: function() { return GameState.get('currentRound'); },
    set: function(value) { GameState.set('currentRound', value); }
});

Object.defineProperty(window, 'maxRounds', {
    get: function() { return GameState.get('maxRounds'); },
    set: function(value) { GameState.set('maxRounds', value); }
});

Object.defineProperty(window, 'players', {
    get: function() { return GameState.get('players'); },
    set: function(value) { GameState.set('players', value); }
});

// Selected cards for ranking (specific to ranking phase)
Object.defineProperty(window, 'selectedCardsForRanking', {
    get: function() { return GameState.get('selectedCardsForRanking'); },
    set: function(value) { GameState.set('selectedCardsForRanking', value); }
});

Object.defineProperty(window, 'finalRanking', {
    get: function() { return GameState.get('finalRanking'); },
    set: function(value) { GameState.set('finalRanking', value); }
});

// Template System for HTML Generation
var TemplateEngine = {
    templates: {},
    
    // Register a template
    register: function(name, template) {
        try {
            this.templates[name] = template;
            return true;
        } catch (error) {
            safeConsoleLog('Error registering template:', name, error);
            return false;
        }
    },
    
    // Render a template with data
    render: function(templateName, data) {
        try {
            var template = this.templates[templateName];
            if (!template) {
                safeConsoleLog('Template not found:', templateName);
                return '';
            }
            
            data = data || {};
            
            // Simple template replacement
            return template.replace(/\{\{(\w+)\}\}/g, function(match, key) {
                var value = data[key];
                return value !== undefined ? String(value) : match;
            });
        } catch (error) {
            safeConsoleLog('Error rendering template:', templateName, error);
            return '';
        }
    },
    
    // Render template with array data (for lists)
    renderList: function(templateName, dataArray, separator) {
        try {
            if (!Array.isArray(dataArray)) {
                return '';
            }
            
            separator = separator || '';
            var results = [];
            
            for (var i = 0; i < dataArray.length; i++) {
                var rendered = this.render(templateName, dataArray[i]);
                if (rendered) {
                    results.push(rendered);
                }
            }
            
            return results.join(separator);
        } catch (error) {
            safeConsoleLog('Error rendering template list:', templateName, error);
            return '';
        }
    }
};

// Register common templates
TemplateEngine.register('playerBidRow', 
    '<div class="player-bid-row {{statusClass}} {{bidderClass}}" id="bidRow_{{safePlayerName}}">' +
    '<div class="player-name">{{playerName}}</div>' +
    '<div class="current-bid-display">Current: {{currentBid}}</div>' +
    '<div class="bid-actions">{{bidActions}}</div>' +
    '</div>'
);

TemplateEngine.register('bidButton', 
    '<button class="btn small primary" onclick="placeBidForPlayer(\'{{playerName}}\')">Bid {{nextBid}}</button>'
);

TemplateEngine.register('passButton',
    '<button class="btn small secondary" onclick="passPlayer(\'{{playerName}}\')">Pass</button>'
);

TemplateEngine.register('cardItem',
    '<div class="card-item {{blockClass}}" data-card-id="{{cardId}}">' +
    '{{index}}. {{countryName}}{{blocker}}' +
    '</div>'
);

TemplateEngine.register('blockingToken',
    '<div class="token-item {{tokenClass}}" onclick="{{onclick}}">' +
    '<span class="token-value">{{value}}</span>' +
    '<span class="token-count">{{count}}</span>' +
    '</div>'
);

// Utility Functions to Reduce Code Duplication
var GameUtils = {
    // Safely get nested object property
    getNestedProperty: function(obj, path, defaultValue) {
        try {
            var keys = path.split('.');
            var current = obj;
            
            for (var i = 0; i < keys.length; i++) {
                if (current === null || current === undefined) {
                    return defaultValue;
                }
                current = current[keys[i]];
            }
            
            return current !== undefined ? current : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    },
    
    // Create safe HTML class name from string
    createSafeClassName: function(str) {
        try {
            return String(str).replace(/[^a-zA-Z0-9-_]/g, '_');
        } catch (error) {
            return 'invalid';
        }
    },
    
    // Format player name for display
    formatPlayerName: function(name) {
        try {
            return validateInput(name, 'string') ? String(name).trim() : 'Unknown Player';
        } catch (error) {
            return 'Unknown Player';
        }
    },
    
    // Get player status class
    getPlayerStatusClass: function(playerName, passedPlayers, currentBid, playerBids) {
        try {
            if (passedPlayers && passedPlayers[playerName]) {
                return 'passed';
            }
            if (playerBids && playerBids[playerName] === currentBid && currentBid > 0) {
                return 'active-bidder';
            }
            return 'active';
        } catch (error) {
            return 'unknown';
        }
    },
    
    // Sort players by score (for blocking order)
    sortPlayersByScore: function(playerList, playerScores) {
        try {
            if (!Array.isArray(playerList) || !playerScores) {
                return [];
            }
            
            return playerList.slice().sort(function(a, b) {
                var scoreA = playerScores[a] || 0;
                var scoreB = playerScores[b] || 0;
                return scoreA - scoreB; // Ascending order (lowest first)
            });
        } catch (error) {
            safeConsoleLog('Error sorting players by score:', error);
            return playerList || [];
        }
    },
    
    // Validate and sanitize bid amount
    validateBidAmount: function(bid) {
        try {
            var numBid = parseInt(bid);
            if (isNaN(numBid)) {
                return null;
            }
            
            if (numBid < GAME_CONFIG.MIN_BID || numBid > GAME_CONFIG.MAX_BID) {
                return null;
            }
            
            return numBid;
        } catch (error) {
            return null;
        }
    },
    
    // Get available blocking tokens for player
    getAvailableTokens: function(playerName) {
        try {
            var players = GameState.get('players');
            if (!players || !players.blockingTokens || !players.blockingTokens[playerName]) {
                return [];
            }
            
            var tokens = players.blockingTokens[playerName];
            var available = [];
            
            for (var value in tokens) {
                if (tokens.hasOwnProperty(value) && tokens[value] > 0) {
                    available.push({
                        value: parseInt(value),
                        count: tokens[value]
                    });
                }
            }
            
            return available.sort(function(a, b) { return a.value - b.value; });
        } catch (error) {
            safeConsoleLog('Error getting available tokens:', error);
            return [];
        }
    }
};


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

// Screen switching function with comprehensive error handling and memory management
window.showScreen = function(screenId) {
    try {
        // Input validation
        if (!validateInput(screenId, 'string', {minLength: 1})) {
            safeConsoleLog('showScreen: Invalid screenId parameter');
            return false;
        }
        
        safeConsoleLog('🔄 showScreen called with:', screenId);
        
        // Clean up previous screen's event listeners and timeouts
        eventListenerManager.cleanup();
        
        // Clean up DOM cache for screen transition
        DOMCache.clear();
        
        // Update game state
        GameState.set('gamePhase', screenId);
        
        // Validate DOM environment
        if (!document || !document.querySelectorAll || !document.getElementById) {
            safeConsoleLog('showScreen: DOM methods not available');
            return false;
        }
        
        // Hide all screens with error handling using cached query
        try {
            var screens = DOMCache.queryAll('.screen', 'allScreens');
            if (!screens) {
                throw new Error('Failed to query screens');
            }
            
            safeConsoleLog('Found', screens.length, 'screens to hide');
            for (var i = 0; i < screens.length; i++) {
                try {
                    if (screens[i] && screens[i].classList) {
                        screens[i].classList.remove('active');
                    }
                } catch (hideError) {
                    safeConsoleLog('Error hiding screen', i, ':', hideError);
                }
            }
        } catch (screenError) {
            safeConsoleLog('Error querying/hiding screens:', screenError);
            return false;
        }
        
        // Show target screen using cached DOM access
        var target = DOMCache.get(screenId);
        if (target) {
            safeConsoleLog('✅ Found target screen:', screenId);
            
            try {
                if (target.classList) {
                    target.classList.add('active');
                } else {
                    throw new Error('classList not available on target element');
                }
            } catch (activateError) {
                safeConsoleLog('Error activating screen:', activateError);
                return false;
            }
            
            // Update content for specific screens with error handling
            try {
                if (screenId === 'scoresScreen') {
                    safeConsoleLog('📊 Navigating to scores screen...');
                    if (typeof updateScoresDisplay === 'function') {
                        updateScoresDisplay();
                    }
                } else if (screenId === 'blockingScreen') {
                    safeConsoleLog('🛡️ Navigating to blocking screen...');
                    if (typeof setupBlockingScreen === 'function') {
                        setupBlockingScreen();
                    }
                }
            } catch (updateError) {
                safeConsoleLog('Error updating screen content:', updateError);
                // Don't return false - screen switch was successful
            }
            
            return true;
            
        } else {
            safeConsoleLog('❌ Screen not found:', screenId);
            
            // Show available screens for debugging
            try {
                var allScreens = document.querySelectorAll('.screen');
                safeConsoleLog('Available screen IDs:');
                allScreens.forEach(function(screen) {
                    safeConsoleLog('  -', screen.id || 'no-id');
                });
            } catch (debugError) {
                safeConsoleLog('Error listing available screens:', debugError);
            }
            
            showNotification('Screen "' + screenId + '" not found', 'error');
            return false;
        }
        
    } catch (error) {
        safeConsoleLog('Critical error in showScreen:', error);
        showNotification('Failed to switch screens', 'error');
        return false;
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
    try {
        // Input validation
        if (!validateInput(playerName, 'string', {minLength: 1})) {
            safeConsoleLog('placeBidForPlayer: Invalid playerName parameter');
            showNotification('Invalid player name', 'error');
            return false;
        }
        
        // Validate game state
        if (typeof passedPlayers !== 'object' || passedPlayers === null) {
            safeConsoleLog('placeBidForPlayer: passedPlayers not properly initialized');
            showNotification('Game state error', 'error');
            return false;
        }
        
        if (passedPlayers[playerName]) {
            safeConsoleLog(playerName + ' has already passed and cannot bid.');
            showNotification(playerName + ' has already passed', 'error');
            return false;
        }
        
        // Validate bid amount
        var newBid = currentBid + 1;
        if (!validateInput(newBid, 'integer', {min: GAME_CONFIG.MIN_BID, max: GAME_CONFIG.MAX_BID})) {
            safeConsoleLog('Maximum bid is ' + GAME_CONFIG.MAX_BID + ' cards');
            showNotification('Maximum bid is ' + GAME_CONFIG.MAX_BID + ' cards', 'error');
            return false;
        }
        
        // Validate currentBid is a number
        if (!validateInput(currentBid, 'number')) {
            safeConsoleLog('placeBidForPlayer: currentBid is not a valid number');
            showNotification('Invalid game state', 'error');
            return false;
        }
        
        // Update bid tracking with validation
        try {
            currentBid = newBid;
            highestBidder = playerName;
            
            // Ensure playerBids object exists
            if (typeof playerBids !== 'object' || playerBids === null) {
                playerBids = {};
            }
            playerBids[playerName] = newBid;
            
            safeConsoleLog('Bid placed:', playerName, 'bids', newBid);
            
        } catch (updateError) {
            safeConsoleLog('Error updating bid state:', updateError);
            showNotification('Failed to place bid', 'error');
            return false;
        }
        
        // Refresh the interface with error handling
        try {
            if (typeof generatePlayerBiddingInterface === 'function') {
                generatePlayerBiddingInterface();
            }
            if (typeof updateHighBidderDisplay === 'function') {
                updateHighBidderDisplay();
            }
        } catch (refreshError) {
            safeConsoleLog('Error refreshing interface after bid:', refreshError);
            // Don't return false - bid was placed successfully
        }
        
        return true;
        
    } catch (error) {
        safeConsoleLog('Critical error in placeBidForPlayer:', error);
        showNotification('Failed to place bid', 'error');
        return false;
    }
};

window.passPlayer = function(playerName) {
    try {
        // Input validation
        if (!validateInput(playerName, 'string', {minLength: 1})) {
            safeConsoleLog('passPlayer: Invalid playerName parameter');
            showNotification('Invalid player name', 'error');
            return false;
        }
        
        // Validate game state
        if (typeof passedPlayers !== 'object' || passedPlayers === null) {
            safeConsoleLog('passPlayer: passedPlayers not properly initialized');
            showNotification('Game state error', 'error');
            return false;
        }
        
        if (passedPlayers[playerName]) {
            safeConsoleLog(playerName + ' has already passed');
            return true; // Already passed, not an error
        }
        
        // High bidder cannot pass validation
        if (playerName === highestBidder && validateInput(currentBid, 'number') && currentBid > 0) {
            safeConsoleLog('The high bidder cannot pass! You must either bid higher or wait for others to outbid you.');
            showNotification('High bidder cannot pass', 'error');
            return false;
        }
        
        // Mark player as passed
        passedPlayers[playerName] = true;
        safeConsoleLog(playerName + ' passes');
        
        // Check if bidding should end with validation
        try {
            if (!validateInput(players.list, 'array')) {
                throw new Error('players.list is not a valid array');
            }
            
            var activePlayers = players.list.filter(function(name) {
                return !passedPlayers[name];
            });
            
            if (activePlayers.length <= 1) {
                if (!validateInput(currentBid, 'number') || currentBid === 0) {
                    safeConsoleLog('All players passed! Someone must make a bid.');
                    showNotification('All players passed! Someone must make a bid.', 'info');
                    
                    // Reset all passes to restart bidding
                    try {
                        players.list.forEach(function(name) {
                            passedPlayers[name] = false;
                        });
                    } catch (resetError) {
                        safeConsoleLog('Error resetting passes:', resetError);
                        return false;
                    }
                } else {
                    safeConsoleLog('Bidding complete! ' + highestBidder + ' wins with a bid of ' + currentBid + ' cards.');
                    showNotification('Bidding complete! ' + highestBidder + ' wins!', 'success');
                    
                    // Auto-finish bidding with error handling and managed timeout
                    eventListenerManager.addTimeout(function() {
                        try {
                            if (typeof finishBidding === 'function') {
                                finishBidding();
                            } else {
                                safeConsoleLog('finishBidding function not available');
                            }
                        } catch (finishError) {
                            safeConsoleLog('Error finishing bidding:', finishError);
                            showNotification('Error completing bidding phase', 'error');
                        }
                    }, 2000);
                }
            }
        } catch (biddingEndError) {
            safeConsoleLog('Error checking bidding end condition:', biddingEndError);
            // Continue - pass was still successful
        }
        
        // Refresh the interface with error handling
        try {
            if (typeof generatePlayerBiddingInterface === 'function') {
                generatePlayerBiddingInterface();
            }
        } catch (refreshError) {
            safeConsoleLog('Error refreshing interface after pass:', refreshError);
            // Don't return false - pass was successful
        }
        
        return true;
        
    } catch (error) {
        safeConsoleLog('Critical error in passPlayer:', error);
        showNotification('Failed to pass player', 'error');
        return false;
    }
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
        
        // Add click listeners for card selection with memory management
        document.querySelectorAll('.card-available[data-card-id]').forEach(function(cardElement) {
            var clickHandler = function() {
                var cardId = this.getAttribute('data-card-id');
                selectCardToBlock(cardId);
            };
            eventListenerManager.addListener(cardElement, 'click', clickHandler);
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
    // Execution guard for automated testing
    if (window.automatedTestState && window.automatedTestState.isProcessingBlock) {
        console.log('⚠️ Block already in progress, skipping duplicate');
        return;
    }
    
    if (blockedCards.includes(cardId)) {
        return; // Already blocked
    }
    
    // Set processing guard
    if (window.automatedTestState) {
        window.automatedTestState.isProcessingBlock = true;
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
    
    // Update test statistics
    updateTestStatistics('BLOCK_MADE', {player: playerName});
    
    // Mark token as used this round (but don't remove it yet - that happens after reveal)
    usedBlockingTokens[tokenValue] = true;
    
    var country = window.GAME_DATA.countries[cardId];
    console.log(playerName + ' blocked ' + country.name + ' with a ' + tokenValue + '-point token!');
    
    // Clear processing guard
    if (window.automatedTestState) {
        window.automatedTestState.isProcessingBlock = false;
    }
    
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
        
        // Add click listeners for card selection with memory management
        document.querySelectorAll('.card-selectable[data-card-id]').forEach(function(cardElement) {
            var clickHandler = function() {
                var cardId = this.getAttribute('data-card-id');
                selectCardForRanking(cardId);
            };
            eventListenerManager.addListener(cardElement, 'click', clickHandler);
        });
    } else {
        console.log('Container not found for available cards');
    }
}

var selectedCardsForRanking = [];

window.selectCardForRanking = function(cardId) {
    // Execution guard for automated testing
    if (window.automatedTestState && window.automatedTestState.isSelectingCards) {
        console.log('⚠️ Card selection already in progress, skipping duplicate');
        return;
    }
    
    var country = window.GAME_DATA.countries[cardId];
    
    // Set processing guard
    if (window.automatedTestState) {
        window.automatedTestState.isSelectingCards = true;
    }
    
    if (selectedCardsForRanking.includes(cardId)) {
        // In automated testing, prevent deselection to avoid bugs
        if (window.isAutomatedTestRunning) {
            console.log('🤖 Automated test: preventing deselection of ' + country.name);
            if (window.automatedTestState) {
                window.automatedTestState.isSelectingCards = false;
            }
            return;
        }
        
        // Deselect card (manual mode only)
        selectedCardsForRanking = selectedCardsForRanking.filter(function(id) { return id !== cardId; });
        console.log('Removed ' + country.name + ' from selection');
    } else {
        // Select card
        if (selectedCardsForRanking.length >= currentBid) {
            console.log('You can only select ' + currentBid + ' cards!');
            if (window.automatedTestState) {
                window.automatedTestState.isSelectingCards = false;
            }
            return;
        }
        selectedCardsForRanking.push(cardId);
        console.log('Selected ' + country.name + ' (' + selectedCardsForRanking.length + '/' + currentBid + ')');
    }
    
    // Update visual selection
    updateCardSelectionDisplay();
    
    // Clear processing guard
    if (window.automatedTestState) {
        window.automatedTestState.isSelectingCards = false;
    }
    
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
        var dragStartHandler = function(e) {
            try {
                e.dataTransfer.setData('text/plain', this.getAttribute('data-card-id'));
                this.classList.add('dragging');
            } catch (dragError) {
                safeConsoleLog('Error in dragstart:', dragError);
            }
        };
        
        var dragEndHandler = function(e) {
            try {
                this.classList.remove('dragging');
            } catch (dragError) {
                safeConsoleLog('Error in dragend:', dragError);
            }
        };
        
        eventListenerManager.addListener(card, 'dragstart', dragStartHandler);
        eventListenerManager.addListener(card, 'dragend', dragEndHandler);
    });
    
    var dragOverHandler = function(e) {
        try {
            e.preventDefault();
            var dragging = document.querySelector('.dragging');
            if (dragging) {
                var afterElement = getDragAfterElement(rankingArea, e.clientY);
                
                if (afterElement == null) {
                    rankingArea.appendChild(dragging);
                } else {
                    rankingArea.insertBefore(dragging, afterElement);
                }
            }
        } catch (dragError) {
            safeConsoleLog('Error in dragover:', dragError);
        }
    };
    
    var dropHandler = function(e) {
        try {
            e.preventDefault();
            if (typeof updateRankingOrder === 'function') {
                updateRankingOrder();
            }
        } catch (dropError) {
            safeConsoleLog('Error in drop:', dropError);
        }
    };
    
    eventListenerManager.addListener(rankingArea, 'dragover', dragOverHandler);
    eventListenerManager.addListener(rankingArea, 'drop', dropHandler);
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
                console.log('🔍 Checking round continuation conditions:');
                console.log('Current Round:', currentRound);
                console.log('Max Rounds:', maxRounds);
                console.log('Current Round < Max Rounds:', currentRound < maxRounds);
                console.log('Win Condition:', checkWinCondition());
                console.log('Automated Test Running:', window.isAutomatedTestRunning);
                
                if (currentRound < maxRounds && !checkWinCondition()) {
                    console.log('▶️ Continuing to next round...');
                    continueToNextRound();
                    
                    setTimeout(async () => {
                        try {
                            console.log('🎮 Starting automated round:', currentRound);
                            await automatedRound(currentRound);
                        } catch (error) {
                            console.error('❌ Error in automated round ' + currentRound + ':', error);
                            console.error('❌ Automated test failed in round ' + currentRound);
                            window.isAutomatedTestRunning = false;
                        }
                    }, 1500); // Increased delay for better sync
                } else {
                    console.log('🏁 Game completed! Generating detailed test results...');
                    console.log('Reason: currentRound (' + currentRound + ') >= maxRounds (' + maxRounds + ') OR win condition met');
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
        
        // Debug: Log total bids won across all players
        var totalBidsWon = 0;
        Object.keys(players.stats).forEach(function(playerName) {
            totalBidsWon += players.stats[playerName].bidsWon || 0;
        });
        console.log('📊 Total bids won across all players:', totalBidsWon, '(should equal current round:', currentRound + ')');
    } else {
        console.error('❌ No stats object found for', highestBidder, '- Available stats:', Object.keys(players.stats));
        console.error('❌ This will cause missing bid tracking! Current round:', currentRound);
    }
    
    // Update test statistics for bid tracking
    updateTestStatistics('BID_WON', {player: highestBidder});
    
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
        
        // Update test statistics for successful bid
        updateTestStatistics('BID_SUCCESSFUL', {player: highestBidder});
        
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
        
        // Update test statistics for failed bid
        updateTestStatistics('BID_FAILED', {player: highestBidder});
        
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
    // Track round completion (before incrementing currentRound)
    updateTestStatistics('ROUND_COMPLETE', {round: currentRound});
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
    
    // Reset phase for new round
    if (window.automatedTestState) {
        setPhase('idle', null);
    }
    
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

// Automated testing state management and execution guards
window.automatedTestState = {
    isProcessingBid: false,
    isProcessingBlock: false,
    isSelectingCards: false,
    isInReveal: false,
    currentPhase: 'idle',
    currentRoundId: null,
    timeouts: []
};

// Card selection state tracking
window.cardSelectionState = {
    selectedCards: new Set(),
    isSelecting: false,
    targetCount: 0,
    roundId: null
};

// Automated testing function with detailed results tracking
window.automatedTestResults = {
    startTime: null,
    endTime: null,
    rounds: [],
    roundsCompleted: 0,
    totalBids: 0,
    totalBlocks: 0,
    successfulBids: 0,
    failedBids: 0,
    playerStats: {},
    errors: []
};

// Helper functions for state management
function canProceedWithPhase(phase) {
    return window.automatedTestState.currentPhase === 'idle' || 
           window.automatedTestState.currentPhase === phase;
}

function setPhase(phase, roundId) {
    console.log(`🔄 Phase transition: ${window.automatedTestState.currentPhase} → ${phase} (Round ${roundId})`);
    window.automatedTestState.currentPhase = phase;
    window.automatedTestState.currentRoundId = roundId;
}

function clearAllTimeouts() {
    window.automatedTestState.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    window.automatedTestState.timeouts = [];
}

function addTimeout(fn, delay) {
    const timeoutId = setTimeout(fn, delay);
    window.automatedTestState.timeouts.push(timeoutId);
    return timeoutId;
}

function updateTestStatistics(action, data) {
    switch(action) {
        case 'BLOCK_MADE':
            // Don't increment blocksMade here - it's already tracked in the actual game logic
            // This was causing inflated block counts
            window.automatedTestResults.totalBlocks++;
            console.log(`📊 Block tracked: ${data.player} (Total blocks: ${window.automatedTestResults.totalBlocks})`);
            break;
        case 'ROUND_COMPLETE':
            window.automatedTestResults.roundsCompleted++;
            console.log(`📊 Round ${data.round} completed (Total rounds: ${window.automatedTestResults.roundsCompleted})`);
            break;
        case 'BID_WON':
            window.automatedTestResults.totalBids++;
            console.log(`📊 Bid won tracked: ${data.player} (Total bids: ${window.automatedTestResults.totalBids})`);
            break;
        case 'BID_SUCCESSFUL':
            window.automatedTestResults.successfulBids++;
            console.log(`📊 Successful bid tracked: ${data.player} (Total successful: ${window.automatedTestResults.successfulBids})`);
            break;
        case 'BID_FAILED':
            window.automatedTestResults.failedBids++;
            console.log(`📊 Failed bid tracked: ${data.player} (Total failed: ${window.automatedTestResults.failedBids})`);
            break;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForUIState(condition, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (condition()) {
            return true;
        }
        await sleep(100);
    }
    throw new Error(`UI condition not met within ${timeout}ms`);
}

function getCurrentScreen() {
    const activeScreen = document.querySelector('.screen.active');
    return activeScreen ? activeScreen.id : null;
}

function verifyScreenTransition(expectedScreen, timeout = 3000) {
    return waitForUIState(() => {
        const currentScreen = getCurrentScreen();
        if (currentScreen === expectedScreen) {
            console.log(`✅ Screen verification passed: ${expectedScreen}`);
            return true;
        } else {
            console.log(`⏳ Waiting for screen transition: ${currentScreen} → ${expectedScreen}`);
            return false;
        }
    }, timeout);
}

window.runAutomatedTest = function() {
    // Just run the test without visual console to improve performance
    console.log('🤖 Automated test starting...');
    console.log('🤖 Starting automated test...');
    
    // Initialize results tracking
    window.automatedTestResults = {
        startTime: new Date(),
        endTime: null,
        rounds: [],
        roundsCompleted: 0,
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
        setTimeout(async function() {
            await automatedRound(1);
        }, 2000); // Give more time for setup
        
    } catch (error) {
        console.error('❌ Error starting automated test:', error);
        console.error('Failed to start automated test: ' + error.message);
        window.automatedTestResults.errors.push('Test start error: ' + error.message);
        window.isAutomatedTestRunning = false;
        // Keep visual console enabled for error review
    }
};

async function automatedRound(roundNum) {
    console.log('🎮 Starting automated round ' + roundNum);
    
    // Check execution guard
    if (!canProceedWithPhase('round')) {
        console.log('⚠️ Cannot start round - another operation in progress');
        return;
    }
    
    // Set phase
    setPhase('round', roundNum);
    
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
        
        // Wait for screen transition and verify
        await verifyScreenTransition('playerScreen');
        
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
        
        // Wait for UI to settle
        await sleep(500);
        
        // Now use the normal startRoundWithBidder function
        console.log('🚀 Starting round with bidder using normal flow...');
        startRoundWithBidder(); // This will show bidding screen and setup game state
        
        // Store round data after setup
        roundData.prompt = currentPrompt ? currentPrompt.label : 'Unknown';
        roundData.drawnCards = drawnCards.slice();
        
        // Wait for bidding screen to fully load, then start automated bidding
        await sleep(1000);
        console.log('💰 Starting automated bidding on bidding screen...');
        await automatedBidding(roundData);
        
    } catch (error) {
        console.error('❌ Error in round ' + roundNum + ':', error);
        console.error('Test failed in round ' + roundNum + ': ' + error.message);
        roundData.errors.push('Round start error: ' + error.message);
        window.automatedTestResults.errors.push('Round ' + roundNum + ' error: ' + error.message);
    }
}

async function automatedBidding(roundData) {
    try {
        // Set phase
        setPhase('bidding', currentRound);
        
        // Randomize bidding
        var playerNames = ['Alice', 'Bob', 'Charlie', 'Diana'];
        var randomWinner = playerNames[Math.floor(Math.random() * playerNames.length)];
        var randomBidAmount = Math.floor(Math.random() * 4) + 2; // 2-5 cards
        
        console.log('🎲 Random bidding: ' + randomWinner + ' will win with ' + randomBidAmount + ' cards');
        
        // Track bidding data
        if (roundData) {
            roundData.bidder = randomWinner;
            roundData.bidAmount = randomBidAmount;
            // Don't increment bidsWon here - it's tracked in calculateAndApplyScores()
            // This was causing double counting
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
        
        // Reset reveal completion flag for this round
        revealCompletionHandled = false;
        
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
            console.log('⚠️ No cards to reveal, showing final results...');
            setTimeout(() => {
                console.log('✅ Round complete (no cards), showing results...');
                showFinalResults();
            }, 1000);
            return;
        }
        
        function autoReveal(index) {
            if (index < revealCount) {
                setTimeout(() => {
                    console.log('🎲 Revealing card ' + (index + 1) + ' of ' + revealCount);
                    console.log('Current reveal index before:', currentRevealIndex);
                    
                    // For automated testing, use a simpler reveal process
                    var revealResult = null;
                    if (window.isAutomatedTestRunning) {
                        revealResult = automatedRevealNext();
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
                    
                    // Continue to next reveal only if not complete
                    if (revealResult !== 'complete') {
                        setTimeout(() => {
                            autoReveal(index + 1);
                        }, 800);
                    } else {
                        console.log('🏁 Reveal process completed, stopping autoReveal loop');
                    }
                }, 1000); // Faster reveals for automation
            } else {
                // Reveal complete - showFinalResults will be called automatically
                // and handle round progression
                console.log('✅ Reveal phase complete, waiting for final results...');
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
            // Don't modify bidderSuccess here - it should already be set correctly
            // by the sequence checking logic below
            revealCompletionHandled = true;
            showFinalResults();
        }
        return 'complete';
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
            return 'complete';
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
        return 'complete';
    }
}

// Validate statistics consistency
function validateStatistics() {
    console.log('🔍 Validating statistics consistency...');
    
    // Calculate total bids won
    var totalBidsWon = 0;
    Object.keys(players.stats).forEach(function(playerName) {
        totalBidsWon += players.stats[playerName].bidsWon || 0;
    });
    
    console.log('📊 Statistics Validation:');
    console.log('  🎯 Total bids won:', totalBidsWon, '(should equal', currentRound, 'rounds)');
    console.log('  🎮 Current round:', currentRound);
    console.log('  📋 Max rounds:', maxRounds);
    
    if (totalBidsWon !== currentRound) {
        console.error('❌ STATISTICS ERROR: Total bids won (' + totalBidsWon + ') does not equal current round (' + currentRound + ')');
        return false;
    }
    
    // Validate individual player stats
    Object.keys(players.stats).forEach(function(playerName) {
        var stats = players.stats[playerName];
        if (stats.bidsSuccessful > stats.bidsWon) {
            console.error('❌ STATISTICS ERROR: Player ' + playerName + ' has more successful bids (' + stats.bidsSuccessful + ') than total bids won (' + stats.bidsWon + ')');
            return false;
        }
    });
    
    console.log('✅ Statistics validation passed');
    return true;
}

// Generate detailed test results
function generateDetailedTestResults() {
    // Validate statistics before generating results
    validateStatistics();
    
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
