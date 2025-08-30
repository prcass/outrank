# Outrank Project - AI Assistant Quick Start

## Project Overview
**Outrank** is a JavaScript-based trivia ranking game where players bid on their ability to correctly rank items (countries, movies, sports teams, companies) according to various criteria.

- **Tech Stack**: Vanilla JavaScript, no frameworks or dependencies
- **Live Site**: https://prcass.github.io/outrank/
- **Current Version**: v5.4 (Last updated: August 5, 2025)
- **Platform**: Mobile-first web app (375px minimum width)
- **Performance**: 97% faster load with lazy loading (464KB → 15KB initial)

## Repository Structure
```
Development: /home/randycass/projects/know-it-all/
├── All development work, research, experiments
├── GitHub: https://github.com/prcass/development.git
└── Contains: source code, research-archive/, validation scripts

Production: /home/randycass/projects/know-it-all/outrank-deploy/
├── Clean production deployment only  
├── GitHub: https://github.com/prcass/outrank.git
├── Auto-deploys to: https://prcass.github.io/outrank/
└── Contains: game.js, data.js, index.html, styles.css
```

**IMPORTANT**: Always work in the outrank-deploy directory for production changes.

## Core Files
- **game.js** (3000+ lines) - All game logic, state management, UI controls
- **data.js** (470KB) - Complete game dataset, lazy-loaded in chunks
- **index.html** - Complete UI screens and structure
- **styles.css** - Mobile-first responsive styling
- **data-loader.js** - Lazy loading system for performance

## Game Data Structure
- **4 Categories Total**:
  - Countries: 40 items, 32 challenges
  - Movies: 40 items, 33 challenges
  - Sports Teams: 124 items, 22 challenges
  - Companies: 40 items, 66 challenges
- **Total**: 244 items, 153 ranking challenges

## Key Documentation Files
- **CLAUDE.md** - Comprehensive project context and history
- **COMMANDS.md** - Development workflows and commands
- **DEVELOPMENT.md** - Coding standards and mandatory practices
- **OUTRANK_FINAL_RULEBOOK.md** - Official game rules

## Critical Development Rules

### MANDATORY Practices
1. **NEVER create new files unless absolutely necessary** - Always prefer editing existing files
2. **Fix ALL console errors immediately** - Stop work and fix any errors before continuing
3. **No frameworks/libraries** - Pure vanilla JavaScript only
4. **Test everything** - Use "Run Automated Test" button after changes
5. **Mobile-first** - Must work perfectly at 375px width
6. **Clean commits** - Use auto-save.sh for consistent Git commits

### Code Standards
- Use `const`/`let`, never `var`
- Use `===` not `==` for comparisons
- No `eval()` or `new Function()` - security risk
- Use `textContent` not `innerHTML` for user data
- Try-catch for all user interactions
- Clean up all console.log statements

### State Management
- Centralized `GameState` system with get/set methods
- Dot notation paths: `GameState.get('players.scores.playerName')`
- All state changes through centralized functions
- Token counts must always sum correctly

## Quick Start Commands

```bash
# Start local development server
python3 -m http.server 8000
# Access at: http://localhost:8000

# Alternative servers
./start-server.sh
node server.js

# Save and push changes (includes commit)
./auto-save.sh "description of changes"

# Check data integrity
node -e "console.log(require('./data.js'))"

# Run automated tests
# → Click "Run Automated Test" button in game UI
```

## Current Game Mechanics

### Core Gameplay Loop
1. **Category Selection** - Player chooses category for round
2. **Bidding Phase** - Players bid 1-10 tokens they can rank
3. **Blocking Phase** - Opponents use block chips (2, 4, 6 points)
4. **Ranking Phase** - Winner arranges tokens in order
5. **Scoring** - All-or-nothing: get all correct or 0 points

### Scoring System
- **Successful Ranking**: 1 point per token ranked correctly (must get ALL correct)
- **Failed Ranking**: Blockers get their chip values as points + own blocked tokens
- **End Game Bonuses**: +1 per remaining block chip, +1 per owned token

## Performance Features (v5.4)
- **Lazy Loading**: Data loads on-demand by category
- **GPU Acceleration**: 60fps animations with transform3d
- **DOM Caching**: Optimized getElementById calls
- **Memory Management**: Bounded arrays, cleanup routines
- **Mobile Optimized**: Instant touch response, no 300ms delay

## Working with This Codebase

### When Adding Features
1. **Research First**: Use Grep/Glob to find patterns, don't read entire files
2. **Plan Implementation**: Write detailed plan before coding
3. **Follow Patterns**: Match existing code style and structure
4. **Test Thoroughly**: Automated test + manual verification
5. **Update Docs**: Update CLAUDE.md for major changes

### Common Tasks
- **Find code**: `grep -r "pattern" .` or use Grep tool
- **Check state**: Browser console → `GameState.get('players')`
- **Debug**: Look for emoji prefixes in console (✅ ❌ 🎯 📊)
- **Test changes**: Refresh browser, run automated test

## Debugging Tips
- **Console Errors**: Fix immediately, check file:line location
- **State Issues**: Verify token counts sum correctly
- **UI Problems**: Check screen switching functions
- **Performance**: Monitor with browser DevTools

## Version History Highlights
- **v5.4** (Jul 28, 2025): 97% performance boost, lazy loading
- **v5.3** (Jul 28, 2025): Reveal animations, master dataset
- **v2.3** (Jul 20, 2025): Scoring fixes, game mechanics clarification
- **v2.2** (Jul 20, 2025): Expanded to 40 countries, 32 challenges

## Repository Best Practices
1. Work in `/outrank-deploy/` directory
2. Test locally before pushing
3. Use descriptive commit messages
4. Tag stable versions: `git tag outrank-vX.X`
5. Keep console clean (no errors or debug logs)

## Getting Help
- **Full Context**: Read CLAUDE.md for comprehensive details
- **Commands**: See COMMANDS.md for all development commands
- **Standards**: Check DEVELOPMENT.md for coding requirements
- **Game Rules**: Refer to OUTRANK_FINAL_RULEBOOK.md

## Contact & Resources
- **Creator**: Randy Cass
- **Game Site**: https://prcass.github.io/outrank/
- **GitHub Issues**: https://github.com/prcass/outrank/issues

---

*This document provides everything an AI assistant needs to start working on the Outrank project effectively. For deeper context on any topic, refer to the specialized documentation files listed above.*