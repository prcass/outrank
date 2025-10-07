# Outrank V4 - Complete Token Dataset

## 📁 File Information

**Main Dataset File**: `v4_token_datasets_COMPLETE_160_TOKENS.js`

This is the **master reference dataset** containing all 160 tokens with perfect tag distribution.

## 📊 Dataset Structure

### Token Counts
- **Countries**: 40 tokens (🌍)
- **Movies**: 40 tokens (🎬)
- **Companies**: 40 tokens (🏢)
- **Sports**: 40 tokens (⚽)
- **Total**: 160 tokens

### Tag Distribution (Perfect Template)

All 4 categories use the **identical 40-token tag template**:

```
Token #1:  [A1, B1, C1, D1]    Token #21: [A1, B5, D4]
Token #2:  [A2, B2, C2, D2]    Token #22: [A2, B4, D1]
Token #3:  [A3, B3, C3, D3]    Token #23: [A3, B5]
Token #4:  [A4, B4, C4, D4]    Token #24: [A4, B5]
Token #5:  [A5, B5, C5, D5]    Token #25: [A5, B1, C4]
Token #6:  [A1, B2, C3, D1]    Token #26: [A1, B2, C5]
Token #7:  [A2, B3, C4, D2]    Token #27: [A2, B3, C1]
Token #8:  [A3, B4, C5, D3]    Token #28: [A3, B4, C4]
Token #9:  [A4, C1, D4]        Token #29: [A4, B5, C3]
Token #10: [A5, C2, D5]        Token #30: [A5, B4, C1]
Token #11: [A1, C4, D4]        Token #31: [A1, B3, C2]
Token #12: [A2, C5, D5]        Token #32: [A2, B1, C2]
Token #13: [A3, C1, D5]        Token #33: [A3, B2, C2]
Token #14: [A4, C4, D1]        Token #34: [A4, B2, C1]
Token #15: [A5, C3, B1]        Token #35: [A5, B3]
Token #16: [A1, C5, B5]        Token #36: [A1, B1]
Token #17: [A2, B1, D3]        Token #37: [A2, C2]
Token #18: [A3, B2, D2]        Token #38: [A3, C3]
Token #19: [A4, B3, D3]        Token #39: [A4, C3]
Token #20: [A5, B4, D2]        Token #40: [A5, C5]
```

## 🎯 Tag Frequency Analysis

### Per Category (40 tokens each)
- **A tags**: Each appears 8× (A1: 8×, A2: 8×, A3: 8×, A4: 8×, A5: 8×)
- **B tags**: Each appears 6× (B1: 6×, B2: 6×, B3: 6×, B4: 6×, B5: 6×)
- **C tags**: Each appears 6× (C1: 6×, C2: 6×, C3: 6×, C4: 6×, C5: 6×)
- **D tags**: Each appears 4× (D1: 4×, D2: 4×, D3: 4×, D4: 4×, D5: 4×)

### Across All 160 Tokens
- **A tags**: 32 appearances each (160 total A tags)
- **B tags**: 24 appearances each (120 total B tags)
- **C tags**: 24 appearances each (120 total C tags)
- **D tags**: 16 appearances each (80 total D tags)

### Token Variety
- **4 tags**: 32 tokens (20% of dataset)
- **3 tags**: 96 tokens (60% of dataset)
- **2 tags**: 8 tokens (20% of dataset)

## ⚽ Sports Team Uniqueness

The 40 sports teams were **randomly selected** with the constraint that:
- **10 teams from each league**: NBA, NFL, NHL, MLB
- **40 completely unique cities** (no city appears twice)

Example teams: Washington Wizards, Los Angeles Chargers, Seattle Kraken, Philadelphia Phillies, Chicago Bulls, Brooklyn Nets, Miami Dolphins, Vancouver Canucks, etc.

## ✅ Validation Properties

1. ✅ All 4 categories use identical tag template
2. ✅ No duplicate tokens within categories
3. ✅ No two tokens share more than 2 tags
4. ✅ Perfect frequency distribution maintained
5. ✅ Strategic scarcity: D tags rarest, A tags most common

## 🔄 Restoring the Dataset

To restore the complete dataset at any time:

```bash
cp v4_token_datasets_COMPLETE_160_TOKENS.js v4_token_datasets.js
```

## 📝 Version History

- **2025-10-01**: Complete 160-token dataset created
  - Perfect tag template applied to all categories
  - Sports teams: Random selection with unique cities
  - All validation checks passed

## 🎮 Game Design Notes

### Strategic Tag Scarcity
- **D tags** (16× each): Premium/Rare - High strategic value
- **B/C tags** (24× each): Medium - Tactical positioning
- **A tags** (32× each): Common - Strategic baseline

### Set Collection Mechanics
The distribution enables multiple collection strategies:
- Complete sets (A1-A5, B1-B5, etc.)
- Category completion
- Cross-category matching
- Rarity-based value assessment

---

**Created**: October 1, 2025
**Status**: ✅ Complete and Validated
**Purpose**: Master reference for Outrank V4 game development
