# Outrank V4 - AI Assistant Context

**For AI Assistants working on this project**

## 🎯 Project Summary

Outrank V4 is a strategic drafting and guessing game with 160 tokens across 4 categories. This file provides essential context for AI assistants to effectively help with development, debugging, and feature implementation.

## 📂 File Locations

**Working Directory:** `/home/randycass/projects/know-it-all/Outrank-V4/`
**Production Directory:** `/home/randycass/projects/know-it-all/outrank-deploy/v4/`

## 🔑 Key Files

### Essential Files
- `outrank-v4-prototype.html` (104KB) - Main game interface
- `v4_token_datasets.js` (228KB) - Token database with 160 tokens
- `v4_token_datasets_COMPLETE_160_TOKENS.js` - Backup copy

### Documentation
- `README_V4_PROJECT.md` - Complete project documentation (READ THIS FIRST)
- `README_DATASET.md` - Dataset structure and tag distribution
- `GAME_RULES_V4.md` - Complete game rules
- `GAMEFLOW_V4.md` - Detailed gameplay flow
- `AI_CONTEXT.md` - This file

## 🎮 Core Game Mechanics

### Game State Structure
```javascript
gameState = {
    phase: 'setup' | 'playing' | 'ended',
    round: 1-5,
    maxRounds: 5,
    challengeMode: 'cards',
    drawnChallengeCards: [],      // Array of {challenge, roundsAvailable}
    playedChallenges: [],          // NEW: Tracks played challenges
    currentPlayer: 0,
    firstGuesser: 0,
    players: [],
    centerToken: null,
    draftPool: [],
    categoryPools: {               // Tokens available for drawing
        movies: [],
        countries: [],
        companies: [],
        sports: []
    },
    selectedCategory: null,
    previousCategory: null,        // NEW: For token persistence
    retiredTokens: [],
    currentChallenge: null,
    selectedDraftToken: null
}
```

### Recent Feature Implementations (Oct 1, 2025)

#### 1. Token Persistence Across Rounds
**Location:** `selectChallengeCard()` function (lines 1288-1367)

**How it works:**
- Checks if `challenge.category === gameState.previousCategory`
- If same category: Keeps existing center token and draft pool
- Calculates: `tokensNeeded = 13 - (1 + draftPool.length)`
- Only draws new tokens to fill up to 13 total
- Updates `gameState.previousCategory` after selection

**Example:**
```javascript
// Round 2: Movies selected, end with 4 tokens in draft pool
// Round 4: Movies selected again
existingTokenCount = 1 (center) + 4 (draft) = 5
tokensNeeded = 13 - 5 = 8
// Draw only 8 new movie tokens
```

#### 2. Played Challenge Tracking
**Location:** Challenge drawing (lines 1130-1181), selection (lines 1293-1297)

**How it works:**
- When challenge is selected: `gameState.playedChallenges.push({name, category})`
- When drawing new challenges: Filter out played ones
```javascript
const categoryChallenges = CHALLENGES.filter(c =>
    c.category === category &&
    !gameState.playedChallenges.some(played =>
        played.name === c.name && played.category === c.category
    )
);
```

#### 3. Draft Pool Display on Challenge Cards
**Location:** `showCategorySelectionModal()` (lines 1216-1219)

**Calculation:**
```javascript
const hasExistingDraft = (gameState.previousCategory === challenge.category &&
                          gameState.draftPool.length > 0);
const existingTokenCount = hasExistingDraft ? (1 + gameState.draftPool.length) : 0;
const tokensNeeded = hasExistingDraft ? Math.max(0, 13 - existingTokenCount) : 13;
```

**Display:**
- Fresh: "40 tokens available"
- With carryover: "🔄 5 in draft pool · 32 in pool · Need 8 more"

#### 4. Data Visibility Toggle
**Location:** `toggleDataVisibility()` (lines 2168-2179)

**Implementation:**
```javascript
function toggleDataVisibility() {
    const isHidden = document.body.classList.toggle('hide-data');
    const btn = document.getElementById('toggleDataBtn');
    btn.textContent = isHidden ? '👁️ Show Data' : '👁️ Hide Data';
}
```

**CSS:**
```css
body.hide-data .token-value {
    display: none;
}
```

## 🏗️ Code Architecture

### Key Functions

**Token Drawing:**
- `drawTokens(count, category)` - Line 1458
  - Draws random tokens from category pool
  - Removes drawn tokens from pool

**Challenge Selection:**
- `showCategorySelectionModal()` - Line 1195
  - Displays challenge cards or manual selection
  - Calculates token availability
  - Shows draft pool info

**Token Rendering:**
- `renderCenterToken()` - Line 1535
- `renderDraftPool()` - Line 1550
  - Display token name, value, and tags

**Game State Updates:**
- `updateGameUI()` - Line 1497
  - Updates all UI elements after state changes

### Data Structure

**Token Format:**
```javascript
{
    id: '001',
    name: 'Germany',
    tags: ['A1', 'B1', 'C1', 'D1'],
    stats: {
        population: 83240525,
        gdp: 4259935911000,
        // ... more stats
    }
}
```

**Challenge Format:**
```javascript
{
    name: 'Population',
    category: 'countries',
    stat: 'population',
    description: 'Which country has the highest population?'
}
```

## 🎨 Tag System

### Perfect Distribution Template (40 tokens)
- **A tags**: Each appears 8× (A1: 8×, A2: 8×, A3: 8×, A4: 8×, A5: 8×)
- **B tags**: Each appears 6× (B1: 6×, B2: 6×, B3: 6×, B4: 6×, B5: 6×)
- **C tags**: Each appears 6× (C1: 6×, C2: 6×, C3: 6×, C4: 6×, C5: 6×)
- **D tags**: Each appears 4× (D1: 4×, D2: 4×, D3: 4×, D4: 4×, D5: 4×)

### Tag Variety
- **4 tags**: 8 tokens (20%)
- **3 tags**: 24 tokens (60%)
- **2 tags**: 8 tokens (20%)

### Validation Properties
1. All 4 categories use identical tag template
2. No duplicate tokens within categories
3. No two tokens share more than 2 tags
4. Perfect frequency distribution maintained

## 🛠️ Development Workflow

### Running Locally
```bash
cd /home/randycass/projects/know-it-all/Outrank-V4
python3 -m http.server 8000
# Visit: http://localhost:8000/outrank-v4-prototype.html
```

### Deploying to Production
```bash
# Copy files from dev to production
cp outrank-v4-prototype.html /home/randycass/projects/know-it-all/outrank-deploy/v4/
cp v4_token_datasets.js /home/randycass/projects/know-it-all/outrank-deploy/v4/

# Update cache buster version in HTML if needed
# <script src="v4_token_datasets.js?v=X"></script>
```

### Cache Busting
Current version: `v=7`
Update when dataset changes to force browser reload.

### Restoring Dataset
```bash
cp v4_token_datasets_COMPLETE_160_TOKENS.js v4_token_datasets.js
```

## 🔍 Common Tasks

### Adding a New Feature
1. Read `README_V4_PROJECT.md` for context
2. Understand game state structure
3. Locate relevant function(s) in HTML file
4. Implement feature
5. Test locally
6. Copy to production
7. Update documentation

### Debugging Token Persistence
- Check `gameState.previousCategory` value
- Verify `gameState.draftPool.length`
- Check token drawing calculation in `selectChallengeCard()`
- Look for carryover message in challenge info area

### Debugging Challenge Tracking
- Check `gameState.playedChallenges` array
- Verify filtering in challenge drawing code
- Ensure challenge is added when selected

### Modifying Token Display
- Functions: `renderCenterToken()`, `renderDraftPool()`
- CSS: `.token`, `.token-value`, `.token-tag`
- Data hiding: `body.hide-data .token-value`

## 📊 Data Files

### Token Dataset
**File:** `v4_token_datasets.js` (228KB)
**Format:**
```javascript
const COUNTRIES_TOKENS = [/* 40 country tokens */];
const MOVIES_TOKENS = [/* 40 movie tokens */];
const COMPANIES_TOKENS = [/* 40 company tokens */];
const SPORTS_TOKENS = [/* 40 sports tokens */];
```

### Backup
**File:** `v4_token_datasets_COMPLETE_160_TOKENS.js`
**Purpose:** Master reference, restore from this if dataset is corrupted

## 🚨 Important Notes

### State Management
- Always update `gameState` before calling `updateGameUI()`
- Use `gameState.previousCategory` for token persistence
- Track played challenges in `gameState.playedChallenges`

### Token Pool Management
- Tokens are removed from `categoryPools` when drawn
- Never modify tokens in place, create new arrays
- Validate pool has enough tokens before drawing

### Challenge Card System
- Only one challenge can be played per game
- Challenge cards regenerate each round (except selected one)
- Filter out played challenges when drawing new ones

### UI Updates
- Always call `updateGameUI()` after state changes
- Use `showNotification()` for user feedback
- Update carryover info element when tokens persist

## 📝 Coding Standards

### JavaScript
- Use `const` and `let`, never `var`
- Comment complex logic
- Use descriptive variable names
- Validate inputs before processing

### HTML/CSS
- Inline styles for dynamic content
- External styles for static elements
- Use semantic class names
- Maintain consistent color scheme

### Notifications
- Success: Green (`'success'`)
- Warning: Orange (`'warning'`)
- Error: Red (`'error'`)
- Info: Blue (`'info'`)

## 🧪 Testing Checklist

After making changes:
1. Game starts correctly
2. Players can select challenges
3. Tokens persist when same category selected
4. Challenges don't repeat in same game
5. Draft pool info shows correctly
6. Data visibility toggle works
7. All notifications appear
8. No console errors

## 📚 Reference Documentation

**Read these for detailed information:**
- `README_V4_PROJECT.md` - Complete project overview
- `README_DATASET.md` - Dataset structure and tag distribution
- `GAME_RULES_V4.md` - Full game rules
- `GAMEFLOW_V4.md` - Step-by-step gameplay flow

## 🤖 AI Assistant Best Practices

1. **Always read README_V4_PROJECT.md first** for project context
2. **Check recent updates section** to understand latest changes
3. **Use search before reading entire file** - HTML is 104KB
4. **Test changes locally** before copying to production
5. **Update cache buster** when modifying dataset
6. **Update documentation** when adding features
7. **Preserve backup files** - never overwrite COMPLETE files
8. **Ask for clarification** if game rules are unclear

## 🔄 Recent Change History

**October 1, 2025:**
- ✅ Token persistence across rounds (same category)
- ✅ Played challenge tracking (no repeats)
- ✅ Draft pool display on challenge cards
- ✅ Data visibility toggle (hide/show stats)
- ✅ Carryover info display in challenge area
- ✅ Updated cache buster to v=7

**Previous:**
- Perfect tag distribution across 160 tokens
- Random sports team selection (unique cities)
- Complete dataset validation
- Challenge card system implementation

---

**Last Updated:** October 1, 2025
**Purpose:** Quick reference for AI assistants working on Outrank V4
**Keep Updated:** Yes - update when major features are added
