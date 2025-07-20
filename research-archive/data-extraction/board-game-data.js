// Outrank Board Game Data Generator
// This script extracts data from the digital game for physical board game components

// Load the game data
if (typeof window !== 'undefined' && window.GAME_DATA) {
    // Browser environment - use existing data
    var gameData = window.GAME_DATA;
} else {
    // Node environment - need to load data
    try {
        const fs = require('fs');
        const dataContent = fs.readFileSync('./data.js', 'utf8');
        // Create a mock window object
        const window = {};
        eval(dataContent);
        var gameData = window.GAME_DATA;
    } catch (error) {
        console.error('Could not load game data:', error);
        var gameData = null;
    }
}

// Generate board game components
class BoardGameGenerator {
    constructor(data) {
        this.data = data;
    }

    // Generate category tokens with proper names and codes
    generateCategoryTokens(category) {
        if (!this.data || !this.data.categories[category]) {
            return [];
        }

        const categoryData = this.data.categories[category];
        const tokens = [];

        Object.keys(categoryData.items).forEach(key => {
            const item = categoryData.items[key];
            tokens.push({
                id: key,
                name: item.name,
                code: item.code || key,
                category: category,
                icon: categoryData.icon
            });
        });

        return tokens;
    }

    // Generate all category tokens
    generateAllTokens() {
        const categories = ['countries', 'movies', 'sports', 'companies'];
        const allTokens = {};

        categories.forEach(category => {
            allTokens[category] = this.generateCategoryTokens(category);
        });

        return allTokens;
    }

    // Generate challenge cards
    generateChallengeCards(category) {
        if (!this.data || !this.data.categories[category]) {
            return [];
        }

        const categoryData = this.data.categories[category];
        const challenges = [];

        categoryData.prompts.forEach((prompt, index) => {
            challenges.push({
                id: prompt.challenge,
                number: index + 1,
                category: category,
                icon: categoryData.icon,
                title: prompt.label,
                description: prompt.label,
                difficulty: this.calculateDifficulty(prompt.challenge, category)
            });
        });

        return challenges;
    }

    // Calculate challenge difficulty based on data variance
    calculateDifficulty(challengeId, category) {
        if (!this.data || !this.data.categories[category]) {
            return 'Medium';
        }

        const items = this.data.categories[category].items;
        const values = Object.values(items).map(item => item[challengeId]).filter(val => val !== undefined);
        
        if (values.length === 0) return 'Medium';

        // Calculate coefficient of variation
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        const cv = Math.sqrt(variance) / mean;

        // Determine difficulty based on variation
        if (cv < 0.3) return 'Hard';
        if (cv > 0.7) return 'Easy';
        return 'Medium';
    }

    // Generate all challenge cards
    generateAllChallenges() {
        const categories = ['countries', 'movies', 'sports', 'companies'];
        const allChallenges = {};

        categories.forEach(category => {
            allChallenges[category] = this.generateChallengeCards(category);
        });

        return allChallenges;
    }

    // Generate blocking tokens
    generateBlockingTokens(playerCount = 6) {
        const tokens = [];
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        
        for (let player = 1; player <= playerCount; player++) {
            [2, 4, 6].forEach(value => {
                tokens.push({
                    player: player,
                    value: value,
                    color: colors[player - 1] || '#999',
                    id: `P${player}_${value}`
                });
            });
        }

        return tokens;
    }

    // Generate player reference cards
    generatePlayerReferences() {
        return {
            gameFlow: [
                'Category Selection',
                'Bidding Phase',
                'Blocking Phase',
                'Ranking Phase',
                'Scoring & Cleanup'
            ],
            scoring: {
                ranking: 'All or Nothing: 1 point per token ranked correctly',
                blocking: 'Token value if bidder fails, lose token if bidder succeeds',
                endGame: '1 point per remaining token + 1 point per owned card'
            },
            bidding: {
                range: '1-10 cards',
                requirement: 'Must bid at least 1 higher than current bid',
                winner: 'Highest bidder attempts ranking'
            },
            blocking: {
                tokens: 'Each player starts with 2, 4, and 6 point tokens',
                usage: 'One token per card, one card per token',
                timing: 'After bidding, before ranking'
            }
        };
    }

    // Generate complete game statistics
    generateGameStats() {
        const tokens = this.generateAllTokens();
        const challenges = this.generateAllChallenges();
        
        return {
            totalTokens: Object.values(tokens).reduce((total, category) => total + category.length, 0),
            totalChallenges: Object.values(challenges).reduce((total, category) => total + category.length, 0),
            categories: Object.keys(tokens).length,
            tokensPerCategory: Object.fromEntries(
                Object.entries(tokens).map(([cat, items]) => [cat, items.length])
            ),
            challengesPerCategory: Object.fromEntries(
                Object.entries(challenges).map(([cat, items]) => [cat, items.length])
            ),
            estimatedGameTime: '45-60 minutes',
            playerCount: '2-6 players',
            ageRange: '12+'
        };
    }

    // Generate print-ready component data
    generatePrintData() {
        return {
            tokens: this.generateAllTokens(),
            challenges: this.generateAllChallenges(),
            blockingTokens: this.generateBlockingTokens(),
            playerReferences: this.generatePlayerReferences(),
            gameStats: this.generateGameStats(),
            printSettings: {
                tokenSize: {
                    small: { diameter: '1 inch', fontSize: '8pt' },
                    medium: { diameter: '1.5 inches', fontSize: '10pt' },
                    large: { diameter: '2 inches', fontSize: '12pt' }
                },
                cardSize: {
                    poker: { width: '2.5 inches', height: '3.5 inches' },
                    bridge: { width: '2.25 inches', height: '3.5 inches' },
                    mini: { width: '1.75 inches', height: '2.75 inches' }
                },
                paperSize: {
                    letter: { width: '8.5 inches', height: '11 inches' },
                    legal: { width: '8.5 inches', height: '14 inches' },
                    tabloid: { width: '11 inches', height: '17 inches' }
                }
            }
        };
    }
}

// Export for use in both browser and Node environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BoardGameGenerator, gameData };
} else if (typeof window !== 'undefined') {
    window.BoardGameGenerator = BoardGameGenerator;
}

// Auto-generate data if in browser
if (typeof window !== 'undefined' && gameData) {
    window.boardGameData = new BoardGameGenerator(gameData).generatePrintData();
}