# Outrank Game - Project Context for Claude

@COMMANDS.md
@DEVELOPMENT.md

## Communication Style Preferences
- Tell it like it is, without having a dismissive tone; don't sugar-coat responses
- Get right to the point
- Adopt a skeptical, questioning approach
- Don't make assumptions without asking
- Be innovative and think outside the box
- **CRITICAL: Never make assumptions when asked specific questions unless given explicit permission**

## Token Efficiency Guidelines
- **Check conversation summary first** - Often contains needed context without file reads
- **Search before reading** - Use Grep/Glob to find specific information
- **Read only relevant sections** - Use offset/limit for large files
- **Batch operations** - Use parallel tool calls when multiple searches needed
- **Use Task tool for exploration** - Optimized for searching with fewer tokens
- **Avoid unnecessary file reads** - Don't read files for simple questions
- **For Know-It-All project**: CLAUDE.md has key context, use Grep for specific code sections

## Overview
Outrank is a JavaScript-based trivia ranking game where players bid on how many cards they can rank correctly in various categories. Mobile-first web application with phone-like interface.

**Categories Available:**
- **Countries** (40 items): Coffee consumption, happiness rankings, GDP, etc.
- **Movies** (47 items): Box office, ratings, budgets, awards, etc.

## Core Game Mechanics

### Gameplay Flow
1. **Bidding**: Players bid 1-10 tokens they can rank correctly
2. **Blocking**: Use block chips to block opponent's tokens
3. **Ranking**: Winner attempts to rank selected tokens
4. **Scoring**: Points for correct rankings + blocking bonuses

### Token Economy & Terminology
**IMPORTANT DISTINCTION:**
- **Block Chips**: The 2-point, 4-point, 6-point chips you use to block
- **Tokens**: The items you block (countries, movies, sports) - also called "cards" in code

**Game Mechanics:**
- Start with 3 block chips: one 2-point, one 4-point, one 6-point

**When bidder SUCCEEDS:**
- Bidder gets points for ranking + receives all block chips that were bet against them
- Blockers lose their block chips (transferred to bidder), get no points, get no tokens

**When bidder FAILS:**
- Blockers get points equal to their block chip value (2, 4, or 6 points)
- Blockers keep their block chips (no transfer)
- Blockers get ownership of the tokens they blocked
- End-game: 1 point per remaining block chip + owned tokens

**Statistics Tracking:**
- `blocksMade` = number of times you used a block chip
- `tokensGained` = number of tokens (items) you gained ownership of
- When bidder fails: `blocksMade` = `tokensGained` (each block gives you a token)
- When bidder succeeds: `blocksMade` > `tokensGained` (you lose chips, get no tokens)

### Token Lifecycle  
- Used tokens = permanently removed from pool
- Blocked tokens = owned by blocker when bidder fails
- Pool refreshes with new tokens each round
- Token replacement screen shows:
  - Cards removed due to gameplay (ranking/blocking)
  - Equal number of replacement cards added
  - Clear categorization of removal reasons

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
- **Scoring**: `calculateAndApplyScores()` with end-game bonuses, blocked token tracking
- **UI**: Screen switching, dynamic updates, error handling, token replacement notifications
- **Testing**: Built-in automated test system with visual console
- **Cards**: Comprehensive lifecycle tracking with statistics, 3-letter codes for identification
- **Token Replacement**: `showTokenReplacementNotification()` categorizes gameplay events vs pool management
- **Data Validation**: Complete ecosystem for validating and updating 5,346 game data points
  - `VALIDATION_DATASET.md` - Complete dataset for AI validation
  - `AI_VALIDATION_QUICK_START.md` - Quick guide for AI assistants
  - `DATA_VALIDATION_GUIDE.md` - Complete researcher workflow
  - `precision_update.js` - Surgical updates for specific items
  - `mass_update.js` - Bulk property updates across all items
  - `show_delta.js` - Comprehensive change reporting
  - `summarize_changes.js` - Concise change summaries

## Version History
- **2025-07-20 v2.3** `outrank-v2.3`: Critical scoring system fixes - performance optimization, statistics consistency, token transfer repairs, game mechanics clarification
- **2025-07-20 v2.2** `outrank-v2.2`: Major dataset expansion - 40 countries, 32 comprehensive challenges with Crime Index, Pollution Index, Airports, Unemployment Rate, and complete World Bank indicators
- **2025-07-14 v2.1** `outrank-v2.1`: All UI issues fixed, responsive design, leaderboard working
- **2025-07-12 v2.0**: State management migration completed, Fast Automated Test functional  
- **2025-07-06 v1.9**: Code quality improvements, security enhancements

## Current State (July 2025 - Last Updated: July 17)
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
- ✅ **Token replacement screen improvements (July 15):**
  - Shows only gameplay-related card removals (not all pool changes)
  - Categorizes removed cards: "Used in Ranking" vs "Used in Block and Now Owned"
  - Balanced 1:1 display of removed/added tokens
  - Count numbers in brackets [X] for at-a-glance totals
  - Tracks blocked tokens when bidder fails as removed cards
  - 3-letter codes displayed on all token circles
- ✅ **Bulk Data Validation & Update System (July 17):**
  - Complete dataset validation workflow for all 5,346 data points
  - Automated validation using AI (ChatGPT/Claude) with structured prompts
  - Three-tier update system: Mass updates, precision updates, manual updates
  - Performance: 50,000+ updates/second with full audit trails
  - Surgical precision: Update specific countries/movies/sports without affecting others
  - Safety: Automatic backups, rollback capability, comprehensive error handling
  - Documentation: Complete researcher workflow guides and validation templates

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

## Repository Structure & Recovery
- **Clean repository** → Core game files in root, research archived (July 2025)
- **Research archive** → All 270+ development/research files preserved in `research-archive/`
  - `data-extraction/` - Python scripts, CSV files, JSON datasets
  - `validation-scripts/` - JavaScript update/test tools 
  - `test-files/` - HTML test pages and debugging tools
  - `backups-old/` - Historical backup files
- **Fallback recovery options:**
  1. **Git tag backup:** `git checkout repository-backup-pre-cleanup-20250720-145957`
  2. **Research files:** All preserved in `research-archive/` directory structure
  3. **Core game focus:** Repository now optimized for game development/maintenance

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