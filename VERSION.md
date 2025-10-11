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

## Current Development: v5.1.15 (In Progress)
**Status**: Active Development
**Branch**: v5.1

**Planned Features:**
- Full online multiplayer testing with all cards
- Additional balance tweaks
- Bug fixes and polish

---

## v5.1.14 - Saboteur Card & Guess Button UI (2025-10-11)
**Tag**: `v5.1.14`
**Status**: Stable

### New Features:
✅ **Redesigned Recycle Card → Saboteur**
- Renamed: `♻️ Recycle` → `♻️ Saboteur`
- New effect: "Return 1 token from any opponent's hand to draft pool"
- Old effect was useless (returning your own tokens)
- Two-step selection: Choose opponent → Choose their token to return
- Uses new `showPlayerSelectionModal()` for opponent selection
- Implementation: `executeReturnOpponentToken()` (lines 2933-3003)

### UI Improvements:
✅ **Guess Button Layout Redesign**
- Buttons positioned at vertical center of challenge card (not below)
- Token name displays above each button (1.3em, bold)
- Larger buttons: 18px/28px padding, 1.2em font size
- Auto-hide after selection for cleaner UI
- Left: LOWER (red) | Right: HIGHER (green)

### User Request:
- "Let's redesign [Recycle] but make it so that you can return any token from any of your opponent's hands to the draft pool"
- "The buttons should go up in the Challenge card window... make the buttons bigger... name of token above button... disappear once choice is made"

---

## v5.1.13 - Trade Card Category Restriction (2025-10-08)
**Tag**: `v5.1.13`
**Status**: Stable

### Bug Fixes:
✅ **Trade Card Now Restricted to Same Category**
- Trade card can only swap tokens within same category
- Movies swap with movies, countries with countries, etc.
- After selecting your token, pool filtered to show only matching category
- Shows helpful message: "Trading away [Token] (category). Select category token from pool"
- Prevents cross-category swaps

### User Request:
"Swap a token from your hand with one in the draft pool can only be played on tokens that are in the same category"

### Implementation:
- Modified `executeSwapTokens()` (lines 2743-2758)
- Added category filter: `sameCategory = draftPool.filter(t => t.category === playerToken.category)`
- Shows warning if no same-category tokens available in pool
- Uses `findIndex()` to map filtered selection back to full draft pool

---

## v5.1.12 - Fixed Wildcard Slot Mechanic (2025-10-08)
**Tag**: `v5.1.12`
**Status**: Stable

### Bug Fixes:
✅ **Wildcard Now Works as Extra Slot, Not Tag Matching**
- Wildcard adds ONE extra slot to any existing set, not tag matching
- Shows "🌈 Add Wildcard Slot" button in each set (if < 4 tokens)
- Clicking opens modal to select ANY unused token
- Selected wildcard token appears in gold with 🌈 emoji
- Can turn 2-set into 3-set, or 3-set into 4-set

### User Clarification:
"The wildcard should be shown as an additional token on any set you already have but then the player should be asked to choose which of their unused tokens (not in the set being cashed in) they want to use as the wildcard token"

### Example:
**Tokens:** A, B (both Action), C (Comedy)
- **Action set shows:** A, B, 🌈 Add Wildcard Slot
- **Click wildcard button** → Modal shows C
- **Select C** → Now have A, B, C🌈 (3 tokens = 5 points)

### Implementation:
- Modified `openCashOutModal()` (lines 4262-4392)
- Removed tag expansion logic from v5.1.11
- Added "🌈 Add Wildcard Slot" button to each set
- Button opens `showTokenSelectionModal()` with non-matching tokens
- Selected token replaces button with gold-highlighted token button
- Wildcard tokens auto-selected and marked with 🌈

---

## v5.1.11 - Fixed Wildcard Joker Mechanic (2025-10-08)
**Tag**: `v5.1.11`
**Status**: Stable

### Bug Fixes:
✅ **Wildcard Now Works Like a Joker**
- Fixed wildcard to allow ONE mismatched token, not all tokens
- Tag sets now expand to show "Tag 🌈" with wildcard candidates
- Wildcard candidates highlighted in gold with 🌈 emoji
- Matching tokens shown normally (purple)
- Tags displayed on wildcard candidates: `Token Name 🌈 [Tags]`

### User Request:
"But the wildcard should only allow ONE token to be different than it's tags...not all tokens"

### Example:
- Token A: `[Action, Thriller]`
- Token B: `[Action, Drama]`
- Token C: `[Comedy, Romance]`

**Without wildcard:** Can only cash in A+B (both have Action)
**With wildcard:** Can cash in A+B+C - wildcard makes C count as "Action"

### Implementation:
- Modified `openCashOutModal()` (lines 4270-4293)
- Expands tag groups to include non-matching tokens as `isWildcardCandidate`
- Gold highlighting for wildcard tokens (lines 4330-4369)
- Tag sections labeled "Tag 🌈" when wildcard active
- Validation in `executeCashOut()` already handles wildcard logic correctly

---

## v5.1.8 - Automated QA Tests for Bonus Cards (2025-10-08)
**Tag**: `v5.1.8`
**Status**: Stable

### Features:
✅ **Comprehensive Bonus Card Testing**
- Added 10 automated QA tests for all card types
- Tests immediate points cards (Jackpot)
- Tests multiplier card storage
- Tests wildcard functionality (Rainbow)
- Tests passive effects (Genius, Lucky)
- Tests defensive cards (Veto)
- Tests end-game bonus cards
- Tests 4-card hand limit enforcement
- Tests bonus card pool replenishment
- Tests all token manipulation cards

### Implementation:
- New test group "Bonus Card System (V5.1)" in qa-tests.js
- Tests run via `runQATests()` in browser console
- All tests check card storage, effects, and state management
- Integrated with existing QA test suite

---

## v5.1.7 - Token Selection Modal Bug Fixes (2025-10-08)
**Tag**: `v5.1.7`
**Status**: Stable

### Bug Fixes:
✅ **Fixed Recycle Card Errors**
- Replaced non-existent `updateDraftPoolUI()` with `renderDraftPool()`
- Fixed all 5 instances: Snatch, Double Pick, Trade, Recycle, Lucky

✅ **Fixed Double-Click Issue**
- Modal now closes BEFORE executing callback
- Callback cleared before execution to prevent re-entry
- Prevents tokens from being selected twice
- User reported: "token was able to be returned twice"

### Technical:
- Updated `selectToken()` function (lines 2609-2620)
- Close modal and clear `tokenSelectionCallback` before executing
- All token selection modals now work correctly

---

## v5.1.6 - Enhanced Sabotage Card (2025-10-08)
**Tag**: `v5.1.6`
**Status**: Stable

### Features:
✅ **Sabotage Two-Step Selection**
- Attacker chooses which player to sabotage (player selection modal)
- Target player chooses which 2 tokens to discard (sequential selection)
- Comprehensive debug logging with 💣 emoji
- Recursive token selection for multi-token discard
- Proper array/object handling for hand/thisRound state

### User Request:
"Sabotage you should be able to pick the player you target and they should be able to pick the 2 tokens they return"

---

## v5.1.0 - Player Choice UI for Token Selection (2025-10-07)
**Tag**: `v5.1.0`
**Status**: Stable

### Major Features:
✅ **Player Choice UI for Token Selection**
- Removed random selection from all token manipulation cards
- Players now choose specific tokens instead of random selection
- Beautiful modal interface with token circles showing ID and name
- Grid layout for easy selection

✅ **Token Manipulation Cards Enhanced:**
- 🎯 **Snatch**: Choose which token to steal from draft pool
- 🎴 **Double Pick**: Choose 2 tokens sequentially from draft pool
- 🔄 **Trade**: Two-step selection - choose your token, then pool token
- ♻️ **Recycle**: Choose which token to return to pool

✅ **Removed Foresight/Peek Card**
- Eliminated confusing "peek at top 3" mechanic (pool is shuffled)
- Simplified deck to 19 cards
- Removed executePeekDeck() function

### Implementation:
- Added `tokenSelectionModal` HTML structure
- Added `showTokenSelectionModal()` function with callback system
- Added `selectToken()` and `closeTokenSelectionModal()` functions
- Updated all 4 token manipulation functions to use player choice
- Sequential selection for multi-token cards (e.g., draw 2)
- Two-step selection for swap cards

### Game Balance:
- Much more strategic token manipulation
- Players can make informed decisions about which tokens to take/trade
- Removes randomness from card effects
- Increases skill ceiling for advanced play

### Testing:
- ⏳ Local multiplayer testing pending
- ⏳ Online multiplayer pending testing

---

## v5.0.6 - Enhanced Veto Mechanic (2025-10-07)
**Tag**: `v5.0.6`
**Status**: Stable

### Enhancement:
✅ **Veto Card Now Punishes Blocked Cash-Ins**
- When Veto blocks a cash-in, the attempted tokens are removed from game
- Makes Veto much more impactful and risky to play against
- Blocked player loses all tokens they tried to cash in
- Notification shows how many tokens were lost
- Firebase sync updates both players

### Implementation:
- Modified executeCashOut() to capture selected tokens before block check
- Added token removal logic when block detected
- Tokens removed from both hand and thisRound arrays
- Enhanced notification: "X tokens lost!"
- Added Firebase sync for both blocker and blocked player

### Balance Impact:
- Veto is now a high-impact defensive card
- Players must be more strategic about when to cash in
- Creates risk/reward tension around cash-in timing
- Encourages holding Veto as deterrent

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
