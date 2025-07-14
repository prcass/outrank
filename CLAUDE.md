# Outrank Game - Project Context for Claude

@COMMANDS.md
@DEVELOPMENT.md

## Communication Style Preferences
- Tell it like it is, without having a dismissive tone; don't sugar-coat responses
- Get right to the point
- Adopt a skeptical, questioning approach
- Don't make assumptions without asking
- Be innovative and think outside the box

## Overview
Outrank is a JavaScript-based trivia ranking game where players bid on how many cards they can rank correctly in various categories. Mobile-first web application with phone-like interface.

**Categories Available:**
- **Countries** (40 items): Coffee consumption, happiness rankings, GDP, etc.
- **Movies** (47 items): Box office, ratings, budgets, awards, etc.

## Core Game Mechanics

### Gameplay Flow
1. **Bidding**: Players bid 1-10 cards they can rank correctly
2. **Blocking**: Use tokens to block opponent's cards
3. **Ranking**: Winner attempts to rank selected cards
4. **Scoring**: Points for correct rankings + blocking bonuses

### Token Economy
- Start with blocking tokens: 2-point, 4-point, 6-point
- Block cards = earn token value + own that card
- End-game: 1 point per remaining token + owned cards

### Card Lifecycle
- Used cards = permanently removed
- Blocked cards = owned by blocker
- Pool refreshes with new cards each round

## Project Architecture

### Core Files
- `game.js` (3000+ lines) - All game logic, state management, UI
- `data.js` (2800+ lines) - Country/movie data with 33 ranking challenges each
- `index.html` - Complete UI screens and structure
- `styles.css` - Mobile-first styling

### State Management
- `GameState` - Centralized state management system with reactive updates
- All state access through `GameState.get(path)` and `GameState.set(path, value)`
- Dot notation paths for nested access (e.g., 'players.scores.playerName')
- `players` object - Central player state (scores, tokens, owned cards, stats)
- `drawnCards`, `selectedCards` - Card pools and selections
- `ACTIVE_RULES` - Game configuration toggles
- Global variables migrated to centralized system for consistency

### Key Systems
- **Scoring**: `calculateAndApplyScores()` with end-game bonuses
- **UI**: Screen switching, dynamic updates, error handling
- **Testing**: Built-in automated test system with visual console
- **Cards**: Comprehensive lifecycle tracking with statistics

## Version History
- **2025-07-14 v2.1** `outrank-v2.1`: All UI issues fixed, responsive design, leaderboard working
- **2025-07-12 v2.0**: State management migration completed, Fast Automated Test functional  
- **2025-07-06 v1.9**: Code quality improvements, security enhancements

## Current State (July 2025 - Last Updated: July 14)
- ✅ Fully functional with all mechanics implemented
- ✅ Movie category added with 47 comprehensive entries
- ✅ End-game token scoring (1 point per remaining token)
- ✅ Card replacement notifications each round
- ✅ Player statistics tracking (cards used, owned, left in play)
- ✅ Automated testing system with detailed reporting
- ✅ Local deployment working (Python/Node servers)
- ✅ **Code quality improvements completed:**
  - Memory leak prevention (timeout/event listener tracking)
  - XSS vulnerability mitigation (sanitization utilities)
  - Removed duplicate/incomplete code (TODO cleanup)
  - Centralized configuration (hardcoded values extracted)
  - Accessibility improvements (ARIA labels, semantic HTML)
  - Performance optimization (O(n) random selection algorithm)
- ✅ **State management migration completed:**
  - All global variables migrated to centralized GameState system
  - Consistent state access patterns throughout codebase
  - Fast Automated Test runs end-to-end successfully
  - Improved state consistency and debugging capability

## Technical Constraints
- **Pure vanilla JavaScript** - No frameworks or dependencies
- **Mobile-first** - Must work on 375px width
- **Browser compatibility** - Chrome/Firefox minimum
- **No external APIs** - Self-contained game data
- **Security** - No eval(), proper input sanitization

## Development Patterns
- **State updates** → Always through centralized functions
- **UI updates** → Dedicated screen switching functions
- **Error handling** → Try-catch for all user interactions
- **Testing** → Use built-in automated test button + manual verification
- **Debugging** → Console messages with emoji prefixes for easy filtering
- **Version Control** → AUTOMATIC: Use `./auto-save.sh` after changes, `checkpoint` for stable states

## Automatic Safeguards
- **Pre-commit hooks** → Automatically remind about documentation
- **Auto-save script** → `./auto-save.sh "description"` - saves and pushes to Outrank
- **Session commands** → `source session-commands.sh` for easy git operations
- **Emergency rollback** → `git checkout outrank-v2.1` always available

## Known Edge Cases
- Token distribution must always sum correctly
- Card IDs are country codes ("USA") or movie keys ("AVATAR")
- Player count: 2-6 players supported
- Bid validation: 1-10 cards, must have enough cards available
- Card ownership persists across rounds until game end

## Critical Implementation Notes
- Cards are removed permanently when used in ranking attempts
- Blocking transfers card ownership to the blocker
- End-game scoring includes remaining tokens + owned cards
- UI must handle all error states gracefully
- Game state must remain consistent throughout all operations