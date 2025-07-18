# Quick Start: AI Data Validation for Outrank Game

## For ChatGPT, Claude, and Other AI Assistants

**Task:** Validate 5,346 data points across 4 categories for accuracy using authoritative sources.

---

## 🎯 What You're Validating

**Game:** Outrank - Trivia ranking game with 132 challenges across 4 categories
**Dataset:** 5,346 individual data points requiring verification

### Categories:
- **🌍 Countries (40 items)**: Economic, social, geographic data
- **🎬 Movies (40 items)**: Box office, ratings, awards, technical data  
- **🏈 Sports (42 items)**: Team values, performance, fan engagement
- **🏢 Companies (40 items)**: Financial, operational, governance metrics

---

## 📊 Sample Data to Validate

### Countries Example:
```
USA: coffee_consumption: 4.7 kg/capita/year, happiness_ranking: 24, life_expectancy: 78.9
China: coffee_consumption: 0.05 kg/capita/year, happiness_ranking: 52, life_expectancy: 77.4
Japan: coffee_consumption: 4.1 kg/capita/year, happiness_ranking: 51, life_expectancy: 84.6
```

### Movies Example:
```
Avatar (2009): box_office_gross: 2923.7M, imdb_rating: 7.9, oscar_wins: 3
Titanic (1997): box_office_gross: 2264.8M, imdb_rating: 7.9, oscar_wins: 11
Avengers Endgame: box_office_gross: 2798.0M, imdb_rating: 8.4, oscar_wins: 0
```

---

## 🔍 Your Validation Task

### Step 1: Identify Inaccuracies
Using authoritative sources, identify any incorrect values in the provided dataset.

### Step 2: Provide Corrections
Format corrections exactly like this:
```json
{
  "USA": {
    "coffee_consumption": 4.2,
    "happiness_ranking": 19,
    "life_expectancy": 79.2
  },
  "CHN": {
    "coffee_consumption": 0.38,
    "happiness_ranking": 84
  },
  "AVATAR": {
    "imdb_rating": 8.2,
    "box_office_gross": 2923.7,
    "production_budget": 240
  }
}
```

### Step 3: Source Documentation
For each correction, provide:
- **Source**: Authoritative source (World Bank, Box Office Mojo, etc.)
- **Year**: Data collection year
- **Confidence**: High/Medium/Low
- **URL**: Link to source if possible

---

## 📋 Recommended Sources

### Countries Data:
- **World Bank Open Data**: Economic indicators
- **UN Statistics**: Population, development metrics
- **World Happiness Report**: Happiness rankings
- **WHO**: Health statistics
- **ITU**: Internet/technology statistics

### Movies Data:
- **Box Office Mojo**: Box office earnings
- **IMDb**: Ratings, cast, technical details
- **Academy Awards Database**: Oscar data
- **The Numbers**: Production budgets, financial data

### Sports Data:
- **Forbes**: Team valuations
- **ESPN**: Performance statistics
- **Official League Sites**: Championship records
- **Sports Reference**: Historical data

### Companies Data:
- **SEC EDGAR**: Public company filings
- **Fortune 500**: Revenue rankings
- **Yahoo Finance**: Market data
- **Company Annual Reports**: Official figures

---

## ⚠️ Important Notes

### Data Validation Priorities:
1. **High Priority**: Objective, verifiable data (box office, GDP, awards)
2. **Medium Priority**: Survey-based data (happiness, satisfaction)
3. **Low Priority**: Subjective scores (cultural impact, brand recognition)

### Common Issues:
- **Outdated data**: Ensure recent figures (last 3 years preferred)
- **Unit inconsistencies**: Verify all use same measurement units
- **Conflicting sources**: Flag discrepancies between authoritative sources
- **Impossible values**: Identify logically inconsistent data

### Quality Standards:
- **Accuracy**: Cross-reference minimum 2 sources
- **Recency**: Prefer recent data over outdated figures
- **Authority**: Use official sources over secondary reporting
- **Consistency**: Ensure related metrics make logical sense

---

## 🚀 Processing Your Corrections

Once you provide corrections in the specified JSON format, they can be processed using:

1. **Precision Updates**: Update specific items without affecting others
2. **Mass Updates**: Update properties across all items
3. **Audit Trails**: Complete before/after documentation
4. **Rollback Capability**: Instant restoration if needed

**Performance**: System can process 50,000+ corrections per second with full safety checks.

---

## 📝 Example Validation Response

```
"I've validated the provided data against authoritative sources. Here are the corrections needed:

CORRECTIONS:
{
  "USA": {
    "coffee_consumption": 4.2,
    "happiness_ranking": 19
  },
  "CHN": {
    "coffee_consumption": 0.38,
    "happiness_ranking": 84
  },
  "AVATAR": {
    "imdb_rating": 8.2,
    "box_office_gross": 2923.7
  }
}

SOURCES:
- USA coffee consumption: International Coffee Organization 2023 Report
- USA happiness ranking: World Happiness Report 2023 (ranked 15th, not 24th)
- China coffee consumption: ICO Market Report 2023
- China happiness ranking: World Happiness Report 2023 (ranked 84th)
- Avatar IMDb rating: Current IMDb score as of 2023
- Avatar box office: Box Office Mojo adjusted figures

CONFIDENCE LEVELS:
- High: Official rankings and box office figures
- Medium: Survey-based happiness data
- Low: Subjective rating scores

NOTES:
- Several happiness rankings appear outdated (using 2019 data instead of 2023)
- Box office figures should specify if adjusted for inflation
- IMDb ratings fluctuate slightly over time"
```

---

**Your validation helps ensure the game uses accurate, up-to-date information from authoritative sources. Thank you for your assistance!**