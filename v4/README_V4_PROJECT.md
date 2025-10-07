# Outrank V4 - Complete Project Documentation

**Last Updated:** October 1, 2025
**Version:** 4.0
**Status:** ✅ Fully Functional

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Quick Start](#quick-start)
- [Game Features](#game-features)
- [Technical Architecture](#technical-architecture)
- [Recent Updates](#recent-updates)
- [File Structure](#file-structure)
- [Development Notes](#development-notes)

## 🎮 Project Overview

Outrank V4 is a strategic drafting and guessing game where players compete to rank tokens (countries, movies, companies, sports teams) based on various statistical challenges. The game features:

- **160 Total Tokens**: 40 each from Countries, Movies, Companies, and Sports
- **Strategic Tag System**: Each token has 2-4 tags (A1-A5, B1-B5, C1-C5, D1-D5) for collection mechanics
- **Draft & Guess Gameplay**: Players draft tokens from a shared pool and guess rankings
- **Token Persistence**: Unused tokens carry over when the same category is selected again
- **Challenge Variety**: Multiple statistical challenges per category

## 🚀 Quick Start

### Running the Game Locally

```bash
cd /home/randycass/projects/know-it-all/Outrank-V4
python3 -m http.server 8000
# Visit: http://localhost:8000/outrank-v4-prototype.html
```

### Running from Production

```bash
cd /home/randycass/projects/know-it-all/outrank-deploy/v4
python3 -m http.server 8000
# Visit: http://localhost:8000/outrank-v4-prototype.html
```

## 🎯 Game Features

### Core Mechanics

1. **Challenge Selection**
   - 4 challenge cards drawn each round (one per category)
   - First guesser selects one challenge card
   - Played challenges are removed from future rounds
   - Shows existing draft pool counts for each category

2. **Token Drafting**
   - 13 tokens per round: 1 center token + 12 draft pool
   - Tokens persist across rounds when same category is selected
   - Only draws new tokens to fill up to 13 total

3. **Data Visibility Toggle**
   - **👁️ Hide Data**: Play without seeing stat values
   - **👁️ Show Data**: View all statistics
   - Perfect for competitive play or learning mode

4. **Token Carryover Display**
   - Shows "🔄 X tokens carried over + Y new tokens drawn"
   - Visible in challenge info area throughout the round
   - Challenge cards show existing draft pool counts

### Tag System

**Tag Distribution (Same for all 4 categories):**
- **A tags**: 32 appearances each across 160 tokens (8 per category)
- **B tags**: 24 appearances each (6 per category)
- **C tags**: 24 appearances each (6 per category)
- **D tags**: 16 appearances each (4 per category)

**Tag Variety:**
- 20% of tokens have 4 tags
- 60% of tokens have 3 tags
- 20% of tokens have 2 tags

**Design Principles:**
- No duplicate tokens within categories
- No two tokens share more than 2 tags
- Strategic scarcity: D tags rarest, A tags most common

## 🏗️ Technical Architecture

### File Structure

```
Outrank-V4/
├── outrank-v4-prototype.html    # Main game file (104KB)
├── v4_token_datasets.js         # Token data (228KB)
├── v4_token_datasets_COMPLETE_160_TOKENS.js  # Backup
├── README_V4_PROJECT.md         # This file
├── README_DATASET.md            # Dataset documentation
├── GAME_RULES_V4.md            # Complete game rules
├── GAMEFLOW_V4.md              # Gameplay flow
└── [utility scripts]           # Tag generation, validation, etc.
```

### Key Components

**HTML Structure:**
- Setup Screen: Player names and game configuration
- Game Screen: Challenge selection, token drafting, gameplay
- End Game Screen: Final scores and statistics

**JavaScript Architecture:**
```javascript
gameState = {
    phase: 'setup' | 'playing' | 'ended',
    round: 1-5,
    challengeMode: 'cards',
    drawnChallengeCards: [],
    playedChallenges: [],        // Tracks played challenges
    players: [],
    centerToken: null,
    draftPool: [],
    categoryPools: {},
    selectedCategory: null,
    previousCategory: null,       // For token persistence
    // ... more state
}
```

**Data Loading:**
- External file: `v4_token_datasets.js` with cache buster (`?v=7`)
- 160 tokens loaded into category pools on game start
- Tokens drawn randomly and removed from pool

## 🆕 Recent Updates (October 1, 2025)

### Token Persistence Across Rounds
- **Feature**: Tokens left in draft pool persist when same category is selected again
- **Implementation**: Only draws enough new tokens to reach 13 total
- **Display**: Shows carryover count in challenge info area
- **Example**: 5 movies remain → Select movies again → Only draw 8 new tokens

### Played Challenge Tracking
- **Feature**: Challenges played during game are removed from future rounds
- **Implementation**: `gameState.playedChallenges` array tracks all played challenges
- **Prevention**: Same challenge cannot appear twice in one game
- **Fallback**: If category runs out of challenges, keeps last card with warning

### Draft Pool Display on Challenge Cards
- **Feature**: Challenge cards show existing draft pool information
- **Display Format**:
  - Fresh category: "40 tokens available"
  - With carryover: "🔄 5 in draft pool · 32 in pool · Need 8 more"
- **Benefit**: Players can see token availability before selecting

### Data Visibility Toggle
- **Feature**: "👁️ Hide Data" / "👁️ Show Data" button
- **Location**: Top-right corner of game screen
- **Effect**: Hides/shows all stat values on tokens
- **Use Case**: Competitive play without spoilers, or learning mode

### Cache Busting
- Updated to `v=7` for dataset loading
- Ensures browsers load latest changes

## 📁 File Structure

### Production Files (in outrank-deploy/v4/)
- `outrank-v4-prototype.html` - Main game interface
- `v4_token_datasets.js` - Token database
- `index.html` - Landing page (optional)

### Development Files
- `v4_token_datasets_COMPLETE_160_TOKENS.js` - Master backup
- `README_DATASET.md` - Dataset documentation
- Utility scripts for tag generation and validation

### Documentation Files
- `README_V4_PROJECT.md` - This file
- `GAME_RULES_V4.md` - Complete game rules
- `GAMEFLOW_V4.md` - Detailed gameplay flow
- `QUICK_REFERENCE.md` - Quick reference guide
- `CHANGELOG_V3_TO_V4.md` - Migration notes

## 💡 Development Notes

### Tag Template (40 tokens per category)

```
Token #1:  [A1, B1, C1, D1]    Token #21: [A1, B5, D4]
Token #2:  [A2, B2, C2, D2]    Token #22: [A2, B4, D1]
Token #3:  [A3, B3, C3, D3]    Token #23: [A3, B5]
Token #4:  [A4, B4, C4, D4]    Token #24: [A4, B5]
Token #5:  [A5, B5, C5, D5]    Token #25: [A5, B1, C4]
Token #6:  [A1, B2, C3, D1]    Token #26: [A1, B2, C5]
Token #7:  [A2, B3, C4, D2]    Token #27: [A2, B3, C1]
Token #8:  [A3, B4, C5, D3]    Token #28: [A3, B4, C4]
Token #9:  [A4, C1, D4]        Token #29: [A4, B5, C3]
Token #10: [A5, C2, D5]        Token #30: [A5, B4, C1]
Token #11: [A1, C4, D4]        Token #31: [A1, B3, C2]
Token #12: [A2, C5, D5]        Token #32: [A2, B1, C2]
Token #13: [A3, C1, D5]        Token #33: [A3, B2, C2]
Token #14: [A4, C4, D1]        Token #34: [A4, B2, C1]
Token #15: [A5, C3, B1]        Token #35: [A5, B3]
Token #16: [A1, C5, B5]        Token #36: [A1, B1]
Token #17: [A2, B1, D3]        Token #37: [A2, C2]
Token #18: [A3, B2, D2]        Token #38: [A3, C3]
Token #19: [A4, B3, D3]        Token #39: [A4, C3]
Token #20: [A5, B4, D2]        Token #40: [A5, C5]
```

### Restoring Complete Dataset

```bash
cp v4_token_datasets_COMPLETE_160_TOKENS.js v4_token_datasets.js
```

### Key Functions in HTML

**Token Persistence:**
- `selectChallengeCard()` - Lines 1288-1367
  - Checks if same category as previous round
  - Calculates tokens needed (13 - existing)
  - Draws only necessary new tokens

**Challenge Tracking:**
- Challenge drawing - Lines 1130-1181
  - Filters out played challenges
  - Tracks in `gameState.playedChallenges`

**Data Visibility:**
- `toggleDataVisibility()` - Lines 2168-2179
  - Toggles `hide-data` class on body
  - CSS hides `.token-value` elements

### Sports Team Selection

40 sports teams randomly selected with constraints:
- 10 teams from each league: NBA, NFL, NHL, MLB
- 40 completely unique cities (no city appears twice)
- Examples: Washington Wizards, Los Angeles Chargers, Seattle Kraken, Philadelphia Phillies

## 🎨 Visual Design

**Color Scheme:**
- Primary: Purple gradient (#667eea to #764ba2)
- Accent: Gold (#ffd700) for carryover info
- Success: Green notifications
- Warning: Orange/yellow notifications

**Token Tags:**
- Position: A (Top), B (Right), C (Left), D (Bottom)
- Display: Small badge-style tags on each token
- Color: Gray background (#f0f0f0) with dark text

## 🔄 Version History

- **October 1, 2025**: V4.0 - Token persistence, challenge tracking, data visibility toggle
- **September 30, 2025**: V4.0 Beta - Complete 160-token dataset, perfect tag distribution
- **September 29, 2025**: V4.0 Development - Tag system design and implementation

## 📝 Next Steps / Future Enhancements

**Potential Features:**
- Player token collection tracking (tag sets)
- End-game scoring based on tag collections
- Challenge difficulty ratings
- Statistics tracking across multiple games
- Token rarity indicators
- Advanced filtering options

## 🐛 Known Issues

None currently identified.

## 📞 Support

For issues or questions:
1. Check existing documentation files
2. Review game rules in `GAME_RULES_V4.md`
3. Check gameplay flow in `GAMEFLOW_V4.md`

---

**Created:** October 1, 2025
**Purpose:** Complete documentation for Outrank V4 development and maintenance
**Maintained By:** Project team
