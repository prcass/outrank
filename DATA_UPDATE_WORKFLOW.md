# Data Update Workflow Guide

## Complete Process: From Validation to Game Integration

### Phase 1: AI Validation
1. **Share validation files** with ChatGPT/Claude:
   - `VALIDATION_DATASET.md`
   - `SAMPLE_DATA_FOR_VALIDATION.md`

2. **Request specific format** from AI:
   ```
   "Please provide corrections in this exact JSON format:
   {
     "countries": {
       "USA": {
         "coffee_consumption": 4.2,
         "happiness_ranking": 19
       },
       "CHN": {
         "coffee_consumption": 0.4,
         "happiness_ranking": 84
       }
     },
     "movies": {
       "AVATAR": {
         "worldwide_box_office": 2923706026,
         "oscar_wins": 0
       }
     }
   }
   ```

3. **Get source documentation**:
   - Request citations for each correction
   - Ask for confidence levels (High/Medium/Low)
   - Identify any values that need manual verification

### Phase 2: Data Organization
1. **Save validated data** as JSON files:
   - `validated_countries.json`
   - `validated_movies.json`
   - `validated_sports.json`
   - `validated_companies.json`

2. **Consolidate into single file**:
   - `validated_data_complete.json`

### Phase 3: Integration Methods

#### Method A: Automated Script (Recommended)
```bash
# Make script executable
chmod +x update_data.js

# Run updates
node update_data.js validated_data_complete.json
```

**Benefits:**
- Handles large datasets efficiently
- Creates automatic backup
- Provides detailed update log
- Validates changes before applying

#### Method B: Claude Code Manual Updates
```
"Claude, please update the following values in data.js:
- USA coffee_consumption: change from 4.7 to 4.2
- China happiness_ranking: change from 72 to 84
- Avatar worldwide_box_office: change from 2847246203 to 2923706026"
```

**Benefits:**
- More controlled updates
- Immediate testing after each change
- Better for small corrections
- Human verification of each change

#### Method C: Hybrid Approach
1. Use automated script for bulk updates
2. Use Claude Code for problematic values
3. Manual verification for subjective scores

### Phase 4: Quality Assurance

#### Immediate Testing
```bash
# Test the game locally
python3 -m http.server 8000
# Navigate to localhost:8000 and test functionality
```

#### Validation Checklist
- [ ] Game loads without errors
- [ ] All categories display correctly
- [ ] Token replacement screen works
- [ ] Automated test passes
- [ ] No console errors
- [ ] Rankings make logical sense

#### Data Integrity Checks
- [ ] All numerical values are positive (where expected)
- [ ] No missing values (null/undefined)
- [ ] Consistent units across similar metrics
- [ ] Logical relationships (e.g., domestic + international = worldwide)

### Phase 5: Documentation & Backup

#### Update Documentation
1. **Source tracking**: Document all data sources used
2. **Change log**: Record what was changed and why
3. **Validation status**: Mark confidence levels
4. **Update CLAUDE.md**: Note data validation completion

#### Version Control
```bash
# Commit changes
git add data.js
git commit -m "Update game data with validated values from [sources]"

# Create checkpoint
./auto-save.sh "Data validation complete - all values verified"
```

### Phase 6: Advanced Integration (Future)

#### API Integration Setup
For automatic updates, consider:
- World Bank API for country data
- Box Office Mojo API for movie data
- Sports databases for athlete statistics
- Financial APIs for company data

#### Data Refresh Schedule
- Annual updates for stable metrics
- Quarterly updates for changing data
- Real-time integration for dynamic values

---

## Error Handling

### Common Issues & Solutions

**Issue**: Script can't find data pattern
**Solution**: Check item codes match exactly (USA, CHN, AVATAR, etc.)

**Issue**: Game doesn't load after update
**Solution**: Restore from backup and check for syntax errors

**Issue**: Values not updating
**Solution**: Verify JSON format and property names match exactly

**Issue**: Inconsistent data types
**Solution**: Ensure numbers are unquoted, strings are quoted

### Rollback Procedure
```bash
# Restore from backup
cp data.js.backup data.js

# Or use git
git checkout HEAD~1 data.js
```

---

## Example Complete Workflow

### 1. Get Validated Data
```json
{
  "countries": {
    "USA": {
      "coffee_consumption": 4.2,
      "happiness_ranking": 19
    },
    "CHN": {
      "coffee_consumption": 0.4,
      "happiness_ranking": 84
    }
  },
  "movies": {
    "AVATAR": {
      "worldwide_box_office": 2923706026,
      "production_budget": 237000000
    }
  }
}
```

### 2. Save as validated_data.json

### 3. Run Update Script
```bash
node update_data.js validated_data.json
```

### 4. Test Game
```bash
python3 -m http.server 8000
# Test at localhost:8000
```

### 5. Commit Changes
```bash
git add data.js
git commit -m "Update game data with validated values from World Bank, Box Office Mojo, World Happiness Report"
```

---

## Next Steps

1. **Choose integration method** based on validation scope
2. **Set up JSON template** for AI responses
3. **Run validation** on priority categories first
4. **Test integration** with sample data
5. **Scale to full dataset** once workflow is proven

The automated script can handle thousands of updates in seconds, while manual updates through Claude Code provide more control and verification.