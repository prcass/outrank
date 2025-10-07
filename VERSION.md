# FourFor4 Multiplayer - Version History

## ⚠️ IMPORTANT: Version Number Update Protocol
**ALWAYS update version numbers in ALL 5 locations when making changes:**
1. **VERSION.md** - Update "Current Development" section to next version
2. **multiplayer.html** `<title>` tag (line 6) - Browser title
3. **multiplayer.html** Mode Selection `<h1>` (line 762) - Main menu heading
4. **multiplayer.html** Online Setup `<h1>` (line 816) - Online mode heading
5. **multiplayer.html** Game Screen `<h1>` (line 1002) - In-game heading

**Example workflow:**
```bash
# 1. Search and replace all instances of version number:
#    - <title>: "4f4 V5.0.X - Description"
#    - <h1>: "4f4 V5.0.X" (appears 3 times)
# 2. Update VERSION.md: Add new version section, bump "Current Development"
# 3. Commit and tag:
git add multiplayer.html VERSION.md
git commit -m "vX.X.X: Description"
git tag -a vX.X.X -m "Version X.X.X"
```

**Quick find/replace tip:**
```bash
# Find all version occurrences in multiplayer.html:
grep -n "V5\.0\." multiplayer.html
```

## Versioning Strategy
- **Major (X.0.0)**: New game-changing features (e.g., bonus card system)
- **Minor (5.X.0)**: New features, significant changes
- **Patch (5.0.X)**: Bug fixes, small improvements, UI tweaks

## Rollback Instructions
```bash
# List all versions
git tag -l "v5.*"

# Rollback to specific version
git checkout v5.0.0

# Or rollback to previous commit
git reset --hard HEAD~1
```

---

## Current Development: v5.0.6 (In Progress)
**Status**: Active Development
**Branch**: v5.0

**Planned Features:**
- Enhanced player choice UI for card targets (not random)
- Full online multiplayer testing with all cards
- Bug fixes and balance tweaks

---

## v5.0.5 - Passive Effects + Card Hand Limit (2025-10-07)
**Tag**: `v5.0.5`
**Status**: Stable - Complete Bonus Card System

### Features Added:
✅ **Passive Effect Cards**
- 🧠 **Genius**: +1 bonus point for every correct guess
  - Integrated into handleCorrectGuess()
  - Shows +2 points with 🧠 emoji in notifications
  - Passive - always active once acquired
- 🍀 **Lucky**: Draw 1 extra token at start of each turn
  - Integrated into advanceTurn()
  - Automatically draws random token from pool
  - Updates thisRound pile
  - Firebase sync support

✅ **4-Card Hand Limit**
- Players can only hold 4 bonus cards maximum
- When at limit, must discard a card to pick new one
- Beautiful discard modal shows all 5 cards (4 old + 1 new)
- New card highlighted with orange gradient and "NEW" badge
- Can discard new card (choose not to take it)
- Smooth UI flow with proper modal management

✅ **Complete Card System**
- All 20 card types fully implemented and functional
- Immediate points: Auto-activate on pick
- Multipliers: Auto-apply on cash-in
- Token manipulation: Steal, Draw, Swap, Return
- Defensive: Block cash-in, Force discard
- Peek: View top 3 tokens
- Passive: Genius (+1/guess), Lucky (draw extra)
- End-game bonuses: Token count, Cash-out count, Card count

### Code Changes:
- Modified handleCorrectGuess() to check for Genius
- Modified advanceTurn() to check for Lucky
- Added showDiscardCardModal() function
- Added discardCardAndAddNew() function
- Updated selectBonusCard() to check 4-card limit
- Enhanced notifications to show passive effects
- Added discard modal HTML structure

### Game Balance:
- 4-card hand limit creates strategic decisions
- Passive cards are always active (no need to play)
- Genius scales with correct guesses (high risk/reward)
- Lucky gives consistent advantage each turn

### Testing:
- ✅ Genius bonus applies correctly (+2 total per guess)
- ✅ Lucky draws extra token at turn start
- ✅ 4-card limit enforces properly
- ✅ Discard modal works correctly
- ⏳ Full game testing with all card combinations
- ⏳ Online multiplayer pending testing

---

## v5.0.4 - Defensive & Peek Cards (2025-10-07)
**Tag**: `v5.0.4`
**Status**: Stable - Ready for Testing

### Features Added:
✅ **Defensive Cards**
- 🛡️ **Veto (Block Cash-In)**: Block opponent's next cash-in attempt
  - Added to activeEffects when played
  - Automatically checks and blocks in executeCashOut()
  - Removes effect after blocking
- 💣 **Sabotage (Force Discard)**: Force random opponent to discard 2 tokens
  - Targets opponents with tokens
  - Random token selection
  - Updates player hands automatically

✅ **Peek Card**
- 👁️ **Foresight**: Look at top 3 tokens in draft pool
  - Shows custom modal with token names
  - Non-destructive (doesn't remove tokens)
  - Beautiful gradient card display

✅ **Integration**
- All defensive/peek cards integrated into playCardFromHand()
- Block check added to cash-in flow
- Force discard affects random opponents
- Peek shows modal overlay with token preview

### Code Changes:
- Added executeBlockCashout() function
- Added executeForceDiscard() with opponent targeting
- Added executePeekDeck() with custom modal
- Modified executeCashOut() to check for active block effects
- Updated playCardFromHand() switch statement

### Testing:
- ✅ Block card activates and shows in activeEffects
- ✅ Block prevents cash-in and removes effect
- ⏳ Force discard needs in-game testing
- ⏳ Peek modal needs in-game testing
- ⏳ Online multiplayer pending testing

### Known Limitations:
- Opponent targeting is random (no player selection UI)
- Token selection for discard is random
- Passive effects not yet implemented

---

## v5.0.3 - Token Manipulation Cards + Play Card UI (2025-10-07)
**Tag**: `v5.0.3`
**Status**: Stable - Ready for Testing

### Features Added:
✅ **Play Card UI System**
- New "Play Card" button added to action buttons
- Modal interface to select and play cards from hand
- Button enabled only when player has playable cards
- Beautiful card selection interface with descriptions

✅ **Token Manipulation Cards**
- 🎯 **Snatch**: Steal 1 random token from draft pool
- 🎴 **Double Pick**: Draw 2 extra tokens from pool
- 🔄 **Trade**: Swap 1 of your tokens with 1 from pool
- ♻️ **Recycle**: Return 1 token from hand to pool

✅ **Manual Card Activation**
- Players can now play multiplier/wildcard cards manually
- Cards move to activeEffects when played
- Automatic removal from hand after use
- Visual feedback for all card plays

✅ **Integration & Polish**
- All token manipulation cards fully functional
- Random selection for target tokens (can be enhanced later)
- Firebase sync support for online play
- Updated notifications for all card effects
- Proper state management and UI updates

### Code Changes:
- Added openPlayCardModal() and closePlayCardModal() functions
- Added playCardFromHand() with switch statement for card effects
- Implemented 4 token manipulation functions: executeStealToken(), executeExtraDraw(), executeSwapTokens(), executeReturnToken()
- Updated updateActionButtons() to enable Play Card button
- Added removeCardFromHand() helper function
- Added playCardModal HTML structure

### Testing:
- ✅ Play Card button enables/disables correctly
- ✅ Modal shows only playable cards
- ⏳ Token manipulation effects need in-game testing
- ⏳ Online multiplayer pending testing

### Known Limitations:
- Token selection is random (no player choice UI yet)
- Defensive cards not yet implemented
- Passive effects not yet integrated

---

## v5.0.2 - Multiplier Card Auto-Application (2025-10-07)
**Tag**: `v5.0.2`
**Status**: Stable - Tested in Local Mode

### Features Added:
✅ **Multiplier Card Auto-Application**
- Double Down (2x) and Triple Threat (3x) cards now auto-activate on cash-in
- Players no longer need to manually play multipliers
- When multiplier is in activeEffects, automatically applies to next cash-in points
- Use counting system: multipliers consumed after 1 use
- Enhanced notifications show when multiplier is applied

✅ **Active Effects Visual Display**
- Yellow gradient badges in player panels show active effects
- Display format: "✨ CARD_NAME ACTIVE (X use)"
- Visible to all players for transparency
- Updates automatically as effects are consumed

✅ **Enhanced Cash-In Notifications**
- Shows original points, multiplier value, and final points
- Example: "✨ Player used Double Down: 5 × 2 = 10 pts"
- Clear feedback when multiplier auto-activates

### Code Changes:
- Modified executeCashOut() to check activeEffects for multipliers
- Added auto-decrement of usesRemaining counter
- Auto-removal of effects when uses exhausted
- Updated renderPlayers() with active effects display section
- Enhanced console logging for multiplier tracking

### Testing:
- ✅ Multipliers auto-apply on cash-in
- ✅ Use counting works correctly
- ✅ Visual indicators update properly
- ✅ Effects removed after consumption
- ⏳ Online multiplayer pending testing

---

## v5.0.0 - Initial Bonus Card System (2025-10-07)
**Tag**: `v5.0.0`
**Status**: Stable - Fully Tested in Local Mode

### Features Added:
✅ **Bonus Card System**
- 20 unique bonus cards with diverse effects
- Mandatory card pick after every cash-in
- Pool of 3 cards visible to all players
- Cards automatically replenish from shuffled deck

✅ **Card Types Implemented:**
- Immediate points (2, 3, 5 pts) - Working
- Score multipliers (2x, 3x) - Stored, not yet playable
- Token manipulation - Stored, not yet playable
- Defensive cards - Stored, not yet playable
- End-game bonuses - Fully working with scoring
- Wildcards - Stored, not yet playable
- Passive effects - Stored, not yet playable

✅ **UI Enhancements:**
- Beautiful card selection modal
- Card pool display on game screen
- Visible bonus cards in player panels
- End-game bonus breakdown display
- (Out) indicator for all locked-out players
- Mobile-responsive design

✅ **Game Integration:**
- Cash-in flow modified for card selection
- End-game scoring includes card bonuses
- Firebase sync ready for online mode
- Turn advancement after card selection

### Files Modified:
- `multiplayer.html`: +347 lines
  - Added BONUS_CARDS database (19 cards)
  - Added card initialization and selection functions
  - Modified executeCashOut() flow
  - Updated renderPlayers() for card visibility
  - Enhanced showGameEndScreen() for bonus scoring

### Known Limitations:
- Playable cards stored but not activatable yet
- Passive effects not applied during gameplay
- Online multiplayer not fully tested with cards

### Testing:
- ✅ Local multiplayer fully tested
- ✅ Card pick flow works correctly
- ✅ End-game bonuses calculate properly
- ⏳ Online multiplayer pending testing

---

## Pre-v5.0 History

### v4.97.24 - Final v4 Release (2025-10-06)
**Last stable version before bonus cards**

### v4.97.0 - v4.97.23
Bug fixes for online multiplayer lockout system, Firebase sync improvements

### v4.0.0 - v4.96.0
FourFor4 multiplayer game with online/local modes

---

## Quick Reference

**Current Stable**: v5.0.0
**Current Development**: v5.0.1
**Last Pre-Cards**: v4.97.24

**Rollback Examples:**
```bash
# Rollback to v5.0.0 (latest stable)
git checkout v5.0.0

# Rollback to v4.97.24 (before cards)
git checkout v4.97.24

# Return to development
git checkout v5.0
```
