# FourFor4 Multiplayer - Version History

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

## Current Development: v5.0.1 (In Progress)
**Status**: Active Development
**Branch**: v5.0

**Planned Features:**
- Playable card mechanics (multipliers, wildcards, actions)
- Passive effect cards integration
- Full online multiplayer testing

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
