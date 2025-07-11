# Know-It-All Game - Project Context for Claude

## Overview
Know-It-All is a JavaScript-based trivia ranking game where players bid on how many cards they can rank correctly in various categories (e.g., countries by coffee consumption, happiness rankings). It's designed as a mobile-first web application with a phone-like interface.

## Key Game Mechanics

### Core Gameplay Loop
1. **Bidding Phase**: Players bid on how many cards (1-10) they can rank correctly
2. **Blocking Phase**: Other players can use blocking tokens to prevent the bidder from using specific cards
3. **Ranking Phase**: The winning bidder attempts to rank their selected cards
4. **Scoring**: Points awarded based on successful ranking and blocking

### Token System
- Each player starts with blocking tokens (2, 4, and 6 point values)
- Tokens can be used to block cards and earn points
- Token ownership: When you successfully block a card, you can own that card for future rounds
- End-game bonuses: 1 point per remaining blocking token and 1 point per owned country token

### Card Lifecycle
- Cards used in ranking attempts are permanently removed from the game
- Cards owned through blocking can be used by the owner when they're the bidder
- Card pool refreshes with new cards to replace removed ones each round

## Project Structure

### Main Files
- `game.js` - Core game logic, state management, and UI updates
- `index.html` - HTML structure with all game screens
- `styles.css` - All styling for the mobile-first interface
- `data.js` - Country data and ranking categories

### Key Functions and Systems
- **State Management**: Centralized `players` object tracks all game state
- **Card Management**: `drawnCards`, `selectedCards`, `players.ownedCards`
- **Scoring System**: `calculateAndApplyScores()`, end-game bonuses
- **UI Management**: Screen switching, dynamic content updates
- **Rules Configuration**: `ACTIVE_RULES` object for game customization

## Recent Implementations

### Latest Features Added
1. **End-game blocking token scoring**: Awards 1 point per remaining blocking token
2. **Card changes notification**: Shows which cards were removed and their replacements each round
3. **Card usage statistics**: Tracks total cards used by each player
4. **Test Results card statistics**: Shows total cards ranked, owned, and left in play

### Important Game Rules
- Bidding always starts at 1 card minimum
- Maximum bid is 10 cards
- Blocking tokens are worth their face value when successfully blocking
- Cards are permanently removed when used in ranking attempts
- Token ownership transfers on successful blocks (if enabled in rules)

## Development Guidelines

### Code Style
- Use vanilla JavaScript (no frameworks)
- Avoid adding comments unless specifically requested
- Follow existing patterns in the codebase
- Use descriptive console.log messages with emojis for debugging

### Testing
- Automated test system available via "Run Automated Test" button
- Visual console output for debugging
- Test results screen shows detailed statistics and card tracking

### Common Tasks
- **Running locally**: Use Python HTTP server (`python -m http.server 8080`)
- **Lint/typecheck commands**: Not currently configured (ask user if needed)
- **Debugging**: Check browser console and visual console in Test Results screen

## Current State
- Game is fully functional with all core mechanics implemented
- Automated testing system works properly
- Card statistics tracking is implemented globally
- All scoring systems including end-game bonuses are working

## Known Considerations
- Card IDs are country codes (e.g., "US", "CN", "JP")
- Game supports 2-6 players
- Mobile-first design with fixed phone container width
- No external dependencies - pure vanilla JavaScript

## Development Process
See DEVELOPMENT.md for detailed development guidelines, workflow, and standards.