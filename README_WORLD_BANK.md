# World Bank Data Integration for Outrank

This directory contains scripts to download World Bank data for updating the Outrank game's country statistics.

## Quick Start (10 countries, 6 indicators)

```bash
# Install required packages
pip install requests pandas

# Run quick download (takes ~2 minutes)
python world_bank_quick_start.py

# Update game data
node precision_update.js world_bank_updates.json
```

## Full Download (40 countries, 40+ indicators)

```bash
# Run full download (takes ~15-25 minutes)
python world_bank_downloader.py

# Results will be in world_bank_data/ directory
# Use game_data_updates.json with precision_update.js
```

## Files Created

### Quick Start:
- `world_bank_quick_data.csv` - Raw data from World Bank
- `world_bank_updates.json` - Ready for game updates

### Full Download:
- `world_bank_data/` - Directory with all data
  - `economy_data.csv` - Economic indicators
  - `demographics_data.csv` - Population data
  - `health_data.csv` - Health statistics
  - `education_data.csv` - Education metrics
  - `technology_data.csv` - Tech adoption
  - `environment_data.csv` - Environmental data
  - `social_data.csv` - Social indicators
  - `world_bank_master_data.csv` - All data combined
  - `game_data_updates.json` - Ready for game updates

## Indicators Downloaded

### Quick Version (6 core indicators):
- GDP per capita
- Population
- Life expectancy
- Internet penetration
- Inflation rate
- Unemployment rate

### Full Version (40+ indicators):
- All economic indicators (GDP, inflation, unemployment, etc.)
- Demographics (population, growth, urbanization, etc.)
- Health metrics (life expectancy, healthcare access, etc.)
- Education stats (literacy, enrollment, etc.)
- Technology adoption (internet, mobile, patents, etc.)
- Environmental data (CO2, renewable energy, forests, etc.)
- Social indicators (inequality, gender gaps, crime, etc.)

## Handling Missing Data

- Taiwan (TWN) - Not in World Bank database, skipped
- Recent years prioritized (2020-2024)
- Falls back to most recent available data
- NULL values preserved in CSV, omitted from JSON

## Rate Limiting

- 0.5 second delay between requests
- Exponential backoff on rate limit errors
- Progress saved automatically (can resume if interrupted)

## Integration with Game

After downloading, use the generated JSON files:

```bash
# Quick update (6 indicators)
node precision_update.js world_bank_updates.json

# Full update (all indicators)
node precision_update.js world_bank_data/game_data_updates.json
```

The updates will modify `data.js` with fresh World Bank data while preserving all other game data.