# Know-It-All Development Commands & Workflow

## Core Development Workflow

### Explore, Plan, Code, Test
When implementing features:

**Explore:** Use parallel agents to find relevant files and understand existing patterns
**Plan:** Write detailed implementation plan with testing strategy
**Code:** Follow existing codebase patterns and standards
**Test:** Use automated test system + manual verification
**Write-up:** Document changes and decisions made + update relevant documentation files

### For Know-It-All specifically:
1. **Explore**: Check `game.js` patterns, `data.js` structure, existing UI screens
2. **Plan**: Consider game state integrity, token management, card lifecycle  
3. **Code**: Follow vanilla JS patterns, use centralized state management
4. **Test**: Use "Run Automated Test" button + manual browser testing

## Local Development Commands

### Starting the Game
```bash
# Primary method
python3 -m http.server 8000

# Alternatives
./start-server.sh
node server.js
```
Access at: http://localhost:8000

### Testing Commands
```bash
# Automated Testing
# → Click "Run Automated Test" button in game interface
# → Check console output and Test Results screen

# Manual Testing Checklist:
# 1. Create game with 2-4 players
# 2. Test bidding phase (1-10 cards)
# 3. Test blocking phase (token usage)
# 4. Test ranking phase (drag and drop)
# 5. Verify scoring calculations
# 6. Test end-game scenarios
# 7. Check all UI screens function properly
```

### Debugging Commands
```bash
# Browser Console (F12)
# Look for JavaScript errors
# Check Network tab for failed requests
# Use Elements tab to inspect DOM changes

# Game-Specific Debugging:
# → Visual console in Test Results screen
# → Console messages have emoji prefixes:
#   ✅ Success messages
#   ❌ Error messages  
#   🎯 Game logic messages
#   📊 Statistics messages
```

## File Structure Commands

### Core Game Files
- `game.js` - Main game logic (3000+ lines)
- `data.js` - Game data with countries/movies (2800+ lines)
- `index.html` - Complete UI structure
- `styles.css` - Mobile-first styling

### Development Files
- `CLAUDE.md` - Project context for AI
- `DEVELOPMENT.md` - Development standards
- `COMMANDS.md` - This file

### Deployment
- `outrank-deploy/` - Production-ready files
- `start-server.sh` - Server startup script
- `server.js` - Node.js alternative server

## Know-It-All Specific Commands

### Game State Validation
```javascript
// In browser console, check game state:
console.log('Players:', players);
console.log('Cards drawn:', drawnCards.length);
console.log('Token distribution:', players.blockingTokens);

// Verify token sum (should equal starting total)
let totalTokens = Object.values(players.blockingTokens)
  .reduce((sum, playerTokens) => {
    return sum + Object.values(playerTokens).reduce((a,b) => a+b, 0);
  }, 0);
console.log('Total tokens:', totalTokens);
```

### Data Validation
```bash
# Check data file syntax
node -e "
const window = {};
eval(require('fs').readFileSync('data.js', 'utf8'));
console.log('Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length);
console.log('Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length);
"
```

### Performance Testing
- Test with maximum players (6)
- Test with maximum cards (10 bid)
- Test all categories and challenges
- Test on mobile viewport (375px width)
- Test blocking scenarios with all token types

## Error Resolution Protocol

### Console Errors Found:
1. **Stop current task immediately**
2. **Screenshot/copy the exact error**
3. **Identify error location (file:line)**
4. **Fix the specific issue**
5. **Refresh browser and verify fix**
6. **Test affected functionality**
7. **Resume original task**

### Common Error Types:
- **Undefined variables**: Check variable scope and declaration
- **DOM not found**: Verify element IDs and timing of access
- **Game state corruption**: Check token/card counting logic
- **UI update failures**: Verify screen switching and element updates

## Deployment Commands

### Local Testing
```bash
# Test both server options
python3 -m http.server 8000
# ctrl+c to stop, then:
node server.js

# Test different browsers
# Chrome: http://localhost:8000
# Firefox: http://localhost:8000  
# Mobile: Use browser dev tools device emulation
```

### Production Deployment
```bash
# Files ready in outrank-deploy/
cp -r outrank-deploy/* /your/web/server/path/
# Or upload via your hosting provider's method
```

No external dependencies, no build process needed - just serve static files.