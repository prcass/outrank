# Outrank V4 - Production

**Version:** 4.0
**Last Updated:** October 1, 2025
**Status:** ✅ Production Ready

## 🚀 Quick Start

### Running Locally
```bash
cd /home/randycass/projects/know-it-all/outrank-deploy/v4
python3 -m http.server 8000
```

Then visit: **http://localhost:8000/outrank-v4-prototype.html**

## 📁 Files in This Directory

### Game Files
- **outrank-v4-prototype.html** (102KB) - Main game interface
- **v4_token_datasets.js** (223KB) - Complete 160-token dataset
- **index.html** (96KB) - Optional landing page

### Documentation Files
- **README.md** - This file (production quick start)
- **README_V4_PROJECT.md** - Complete project documentation
- **AI_CONTEXT.md** - AI assistant reference guide
- **STATUS.md** - Current development status
- **README_DATASET.md** - Dataset structure and tag system
- **GAME_RULES_V4.md** - Complete game rules
- **GAMEFLOW_V4.md** - Detailed gameplay flow

## 🎮 Game Features

### Current Implementation ✅
- 160 tokens (40 per category: Countries, Movies, Companies, Sports)
- Perfect tag distribution system (A1-A5, B1-B5, C1-C5, D1-D5)
- Challenge card selection (4 cards per round)
- Token persistence across rounds (same category)
- Played challenge tracking (no repeats)
- Data visibility toggle (hide/show stats)
- Draft pool carryover display

### Gameplay
1. **Setup**: 2-6 players, enter names
2. **Challenge Selection**: First guesser selects one of 4 challenge cards
3. **Token Display**: 13 tokens shown (1 center + 12 draft pool)
4. **Round Progression**: Tokens persist if same category selected again
5. **Data Control**: Toggle stat visibility for competitive play

## 📖 Documentation Guide

**For quick reference:**
- Start with `STATUS.md` for current state
- Read `README_V4_PROJECT.md` for complete overview

**For AI assistants:**
- Start with `AI_CONTEXT.md` for quick reference
- Contains function locations, implementation details
- Includes recent feature implementations

**For game rules:**
- Read `GAME_RULES_V4.md` for player-facing rules
- Read `GAMEFLOW_V4.md` for detailed mechanics

**For dataset info:**
- Read `README_DATASET.md` for tag distribution
- Contains restore instructions and validation

## 🔄 Version History

**October 1, 2025 - v4.0**
- ✅ Token persistence across rounds
- ✅ Challenge tracking (no repeats)
- ✅ Draft pool display on challenge cards
- ✅ Data visibility toggle
- ✅ Complete documentation suite

**September 30, 2025 - v4.0 Beta**
- ✅ 160-token dataset created
- ✅ Perfect tag distribution
- ✅ Random sports team selection

## 🐛 Known Issues

None currently identified. All features tested and working.

## 📞 Support

**For development:**
- Development directory: `/home/randycass/projects/know-it-all/Outrank-V4/`
- Check `STATUS.md` for current state
- Check `AI_CONTEXT.md` for implementation details

**For questions:**
- Review documentation files listed above
- Check specific sections in `README_V4_PROJECT.md`

## 🎯 Next Steps

See `STATUS.md` section "Next Session Priorities" for planned enhancements.

---

**Production Directory:** `/home/randycass/projects/know-it-all/outrank-deploy/v4/`
**Development Directory:** `/home/randycass/projects/know-it-all/Outrank-V4/`
