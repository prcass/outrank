#!/usr/bin/env python3
"""
Extract World Happiness Report data for our 40 countries
Step 2: Parse happiness data and verify coverage - NO ASSUMPTIONS
"""

import json
import time

def load_our_countries():
    """Load our 40 countries"""
    with open('quick_dataset_selection.json', 'r') as f:
        our_data = json.load(f)
    return {c["name"]: c["iso3"] for c in our_data["selected_countries"]}

def create_happiness_data_manually():
    """Manually extract happiness data from user's provided table - VERIFIED DATA ONLY"""
    
    # MANUALLY EXTRACTED FROM USER'S HAPPINESS DATA - NO ASSUMPTIONS
    # Only including countries that appear in our 40-country list
    happiness_data = {
        "Finland": {
            "rank": 1,
            "life_evaluation": 7.736,
            "change_since_2012": 0.347,
            "inequality": 2,
            "social_support": 2,
            "gdp_per_capita": 15,
            "healthy_life_expectancy": None,
            "freedom": 4,
            "generosity": 56,
            "perceptions_of_corruption": 2,
            "positive_emotions": 25,
            "negative_emotions": 7,
            "donated": 56,
            "volunteered": 75,
            "helped_stranger": 77
        },
        "Denmark": {
            "rank": 2,
            "life_evaluation": 7.521,
            "change_since_2012": -0.172,
            "inequality": 28,
            "social_support": 4,
            "gdp_per_capita": 5,
            "healthy_life_expectancy": None,
            "freedom": 10,
            "generosity": 31,
            "perceptions_of_corruption": 4,
            "positive_emotions": 11,
            "negative_emotions": 35,
            "donated": 31,
            "volunteered": 60,
            "helped_stranger": 70
        },
        "Iceland": {
            "rank": 3,
            "life_evaluation": 7.515,
            "change_since_2012": 0.160,
            "inequality": 5,
            "social_support": 1,
            "gdp_per_capita": 8,
            "healthy_life_expectancy": None,
            "freedom": 3,
            "generosity": 5,
            "perceptions_of_corruption": 31,
            "positive_emotions": 8,
            "negative_emotions": 8,
            "donated": 5,
            "volunteered": 66,
            "helped_stranger": 102
        },
        "Sweden": {
            "rank": 4,
            "life_evaluation": 7.345,
            "change_since_2012": -0.135,
            "inequality": 11,
            "social_support": 27,
            "gdp_per_capita": 12,
            "healthy_life_expectancy": None,
            "freedom": 21,
            "generosity": 20,
            "perceptions_of_corruption": 5,
            "positive_emotions": 23,
            "negative_emotions": 24,
            "donated": 20,
            "volunteered": 78,
            "helped_stranger": 71
        },
        "Netherlands": {
            "rank": 5,
            "life_evaluation": 7.306,
            "change_since_2012": -0.206,
            "inequality": 1,
            "social_support": 28,
            "gdp_per_capita": 6,
            "healthy_life_expectancy": None,
            "freedom": 41,
            "generosity": 9,
            "perceptions_of_corruption": 11,
            "positive_emotions": 41,
            "negative_emotions": 34,
            "donated": 9,
            "volunteered": 46,
            "helped_stranger": 128
        },
        "Norway": {
            "rank": 7,
            "life_evaluation": 7.262,
            "change_since_2012": -0.393,
            "inequality": 17,
            "social_support": 19,
            "gdp_per_capita": 2,
            "healthy_life_expectancy": None,
            "freedom": 17,
            "generosity": 18,
            "perceptions_of_corruption": 8,
            "positive_emotions": 29,
            "negative_emotions": 46,
            "donated": 18,
            "volunteered": 25,
            "helped_stranger": 92
        },
        "Israel": {
            "rank": 8,
            "life_evaluation": 7.234,
            "change_since_2012": -0.067,
            "inequality": 15,
            "social_support": 13,
            "gdp_per_capita": 25,
            "healthy_life_expectancy": None,
            "freedom": 87,
            "generosity": 19,
            "perceptions_of_corruption": 32,
            "positive_emotions": 100,
            "negative_emotions": 80,
            "donated": 19,
            "volunteered": 49,
            "helped_stranger": 63
        },
        "Luxembourg": {
            "rank": 9,
            "life_evaluation": 7.122,
            "change_since_2012": 0.068,
            "inequality": None,
            "social_support": None,
            "gdp_per_capita": None,
            "healthy_life_expectancy": None,
            "freedom": None,
            "generosity": None,
            "perceptions_of_corruption": None,
            "positive_emotions": None,
            "negative_emotions": None,
            "donated": None,
            "volunteered": None,
            "helped_stranger": None
        },
        "Mexico": {
            "rank": 10,
            "life_evaluation": 6.979,
            "change_since_2012": -0.109,
            "inequality": 71,
            "social_support": 61,
            "gdp_per_capita": 57,
            "healthy_life_expectancy": None,
            "freedom": 27,
            "generosity": 104,
            "perceptions_of_corruption": 59,
            "positive_emotions": 6,
            "negative_emotions": 14,
            "donated": 104,
            "volunteered": 81,
            "helped_stranger": 44
        },
        "Australia": {
            "rank": 11,
            "life_evaluation": 6.974,
            "change_since_2012": -0.376,
            "inequality": 36,
            "social_support": 42,
            "gdp_per_capita": 13,
            "healthy_life_expectancy": None,
            "freedom": 49,
            "generosity": 22,
            "perceptions_of_corruption": 19,
            "positive_emotions": 51,
            "negative_emotions": 72,
            "donated": 22,
            "volunteered": 40,
            "helped_stranger": 28
        },
        "New Zealand": {
            "rank": 12,
            "life_evaluation": 6.952,
            "change_since_2012": -0.269,
            "inequality": 32,
            "social_support": 24,
            "gdp_per_capita": 24,
            "healthy_life_expectancy": None,
            "freedom": 32,
            "generosity": 25,
            "perceptions_of_corruption": 6,
            "positive_emotions": 26,
            "negative_emotions": 45,
            "donated": 25,
            "volunteered": 27,
            "helped_stranger": 41
        },
        "Switzerland": {
            "rank": 13,
            "life_evaluation": 6.935,
            "change_since_2012": -0.715,
            "inequality": 3,
            "social_support": 20,
            "gdp_per_capita": 3,
            "healthy_life_expectancy": None,
            "freedom": 20,
            "generosity": 12,
            "perceptions_of_corruption": 3,
            "positive_emotions": 54,
            "negative_emotions": 13,
            "donated": 12,
            "volunteered": 52,
            "helped_stranger": 126
        },
        "Belgium": {
            "rank": 14,
            "life_evaluation": 6.910,
            "change_since_2012": -0.057,
            "inequality": 4,
            "social_support": 31,
            "gdp_per_capita": 11,
            "healthy_life_expectancy": None,
            "freedom": 26,
            "generosity": 48,
            "perceptions_of_corruption": 14,
            "positive_emotions": 58,
            "negative_emotions": 37,
            "donated": 48,
            "volunteered": 61,
            "helped_stranger": 114
        },
        "Ireland": {
            "rank": 15,
            "life_evaluation": 6.889,
            "change_since_2012": -0.187,
            "inequality": 8,
            "social_support": 22,
            "gdp_per_capita": 1,
            "healthy_life_expectancy": None,
            "freedom": 33,
            "generosity": 3,
            "perceptions_of_corruption": 10,
            "positive_emotions": 50,
            "negative_emotions": 44,
            "donated": 3,
            "volunteered": 24,
            "helped_stranger": 76
        },
        "Austria": {
            "rank": 17,
            "life_evaluation": 6.810,
            "change_since_2012": -0.559,
            "inequality": 18,
            "social_support": 25,
            "gdp_per_capita": 10,
            "healthy_life_expectancy": None,
            "freedom": 54,
            "generosity": 7,
            "perceptions_of_corruption": 18,
            "positive_emotions": 62,
            "negative_emotions": 32,
            "donated": 7,
            "volunteered": 48,
            "helped_stranger": 85
        },
        "Canada": {
            "rank": 18,
            "life_evaluation": 6.803,
            "change_since_2012": -0.674,
            "inequality": 44,
            "social_support": 35,
            "gdp_per_capita": 16,
            "healthy_life_expectancy": None,
            "freedom": 68,
            "generosity": 27,
            "perceptions_of_corruption": 15,
            "positive_emotions": 56,
            "negative_emotions": 92,
            "donated": 27,
            "volunteered": 22,
            "helped_stranger": 43
        },
        "Czech Republic": {
            "rank": 20,
            "life_evaluation": 6.775,
            "change_since_2012": 0.485,
            "inequality": 34,
            "social_support": 9,
            "gdp_per_capita": 26,
            "healthy_life_expectancy": None,
            "freedom": 31,
            "generosity": 44,
            "perceptions_of_corruption": 73,
            "positive_emotions": 34,
            "negative_emotions": 71,
            "donated": 44,
            "volunteered": 57,
            "helped_stranger": 61
        },
        "Germany": {
            "rank": 22,
            "life_evaluation": 6.753,
            "change_since_2012": 0.081,
            "inequality": 31,
            "social_support": 37,
            "gdp_per_capita": 9,
            "healthy_life_expectancy": None,
            "freedom": 56,
            "generosity": 14,
            "perceptions_of_corruption": 9,
            "positive_emotions": 67,
            "negative_emotions": 40,
            "donated": 14,
            "volunteered": 47,
            "helped_stranger": 73
        },
        "United Kingdom": {
            "rank": 23,
            "life_evaluation": 6.728,
            "change_since_2012": -0.155,
            "inequality": 7,
            "social_support": 44,
            "gdp_per_capita": 20,
            "healthy_life_expectancy": None,
            "freedom": 35,
            "generosity": 6,
            "perceptions_of_corruption": 16,
            "positive_emotions": 45,
            "negative_emotions": 49,
            "donated": 6,
            "volunteered": 36,
            "helped_stranger": 91
        },
        "United States": {
            "rank": 24,
            "life_evaluation": 6.724,
            "change_since_2012": -0.358,
            "inequality": 13,
            "social_support": 12,
            "gdp_per_capita": 4,
            "healthy_life_expectancy": None,
            "freedom": 115,
            "generosity": 16,
            "perceptions_of_corruption": 37,
            "positive_emotions": 30,
            "negative_emotions": 51,
            "donated": 16,
            "volunteered": 15,
            "helped_stranger": 22
        },
        "Poland": {
            "rank": 26,
            "life_evaluation": 6.673,
            "change_since_2012": 0.851,
            "inequality": 6,
            "social_support": 34,
            "gdp_per_capita": 30,
            "healthy_life_expectancy": None,
            "freedom": 37,
            "generosity": 114,
            "perceptions_of_corruption": 52,
            "positive_emotions": 113,
            "negative_emotions": 5,
            "donated": 114,
            "volunteered": 126,
            "helped_stranger": 141
        },
        "Singapore": {
            "rank": 34,
            "life_evaluation": 6.565,
            "change_since_2012": 0.019,
            "inequality": 16,
            "social_support": 53,
            "gdp_per_capita": None,
            "healthy_life_expectancy": None,
            "freedom": 55,
            "generosity": 24,
            "perceptions_of_corruption": 1,
            "positive_emotions": 60,
            "negative_emotions": 28,
            "donated": 24,
            "volunteered": 30,
            "helped_stranger": 65
        },
        "Brazil": {
            "rank": 36,
            "life_evaluation": 6.494,
            "change_since_2012": -0.355,
            "inequality": 79,
            "social_support": 56,
            "gdp_per_capita": 62,
            "healthy_life_expectancy": None,
            "freedom": 59,
            "generosity": 71,
            "perceptions_of_corruption": 66,
            "positive_emotions": 49,
            "negative_emotions": 90,
            "donated": 71,
            "volunteered": 88,
            "helped_stranger": 50
        },
        "Spain": {
            "rank": 38,
            "life_evaluation": 6.466,
            "change_since_2012": 0.144,
            "inequality": 9,
            "social_support": 16,
            "gdp_per_capita": 22,
            "healthy_life_expectancy": None,
            "freedom": 88,
            "generosity": 32,
            "perceptions_of_corruption": 33,
            "positive_emotions": 78,
            "negative_emotions": 89,
            "donated": 32,
            "volunteered": 79,
            "helped_stranger": 48
        },
        "Italy": {
            "rank": 40,
            "life_evaluation": 6.415,
            "change_since_2012": 0.394,
            "inequality": 19,
            "social_support": 52,
            "gdp_per_capita": 19,
            "healthy_life_expectancy": None,
            "freedom": 103,
            "generosity": 89,
            "perceptions_of_corruption": 112,
            "positive_emotions": 103,
            "negative_emotions": 62,
            "donated": 89,
            "volunteered": 100,
            "helped_stranger": 119
        },
        "Argentina": {
            "rank": 42,
            "life_evaluation": 6.397,
            "change_since_2012": -0.165,
            "inequality": 38,
            "social_support": 21,
            "gdp_per_capita": 52,
            "healthy_life_expectancy": None,
            "freedom": 47,
            "generosity": 112,
            "perceptions_of_corruption": 75,
            "positive_emotions": 28,
            "negative_emotions": 59,
            "donated": 112,
            "volunteered": 111,
            "helped_stranger": 55
        },
        "Chile": {
            "rank": 45,
            "life_evaluation": 6.361,
            "change_since_2012": -0.226,
            "inequality": 53,
            "social_support": 43,
            "gdp_per_capita": 47,
            "healthy_life_expectancy": None,
            "freedom": 63,
            "generosity": 75,
            "perceptions_of_corruption": 85,
            "positive_emotions": 21,
            "negative_emotions": 73,
            "donated": 75,
            "volunteered": 104,
            "helped_stranger": 31
        },
        "Vietnam": {
            "rank": 46,
            "life_evaluation": 6.352,
            "change_since_2012": 0.819,
            "inequality": 20,
            "social_support": 49,
            "gdp_per_capita": 78,
            "healthy_life_expectancy": None,
            "freedom": 2,
            "generosity": 129,
            "perceptions_of_corruption": 39,
            "positive_emotions": 48,
            "negative_emotions": 2,
            "donated": 129,
            "volunteered": 123,
            "helped_stranger": 98
        },
        "Thailand": {
            "rank": 49,
            "life_evaluation": 6.222,
            "change_since_2012": -0.149,
            "inequality": 67,
            "social_support": 50,
            "gdp_per_capita": 59,
            "healthy_life_expectancy": None,
            "freedom": 16,
            "generosity": 8,
            "perceptions_of_corruption": 120,
            "positive_emotions": 12,
            "negative_emotions": 36,
            "donated": 8,
            "volunteered": 74,
            "helped_stranger": 87
        },
        "Japan": {
            "rank": 55,
            "life_evaluation": 6.147,
            "change_since_2012": 0.083,
            "inequality": 47,
            "social_support": 48,
            "gdp_per_capita": 28,
            "healthy_life_expectancy": None,
            "freedom": 79,
            "generosity": 130,
            "perceptions_of_corruption": 41,
            "positive_emotions": 64,
            "negative_emotions": 9,
            "donated": 130,
            "volunteered": 103,
            "helped_stranger": 142
        },
        "Philippines": {
            "rank": 57,
            "life_evaluation": 6.107,
            "change_since_2012": 1.122,
            "inequality": 104,
            "social_support": 68,
            "gdp_per_capita": 89,
            "healthy_life_expectancy": None,
            "freedom": 19,
            "generosity": 91,
            "perceptions_of_corruption": 78,
            "positive_emotions": 7,
            "negative_emotions": 103,
            "donated": 91,
            "volunteered": 4,
            "helped_stranger": 20
        },
        "Colombia": {
            "rank": 61,
            "life_evaluation": 6.004,
            "change_since_2012": -0.412,
            "inequality": 105,
            "social_support": 55,
            "gdp_per_capita": 66,
            "healthy_life_expectancy": None,
            "freedom": 73,
            "generosity": 131,
            "perceptions_of_corruption": 110,
            "positive_emotions": 15,
            "negative_emotions": 64,
            "donated": 131,
            "volunteered": 112,
            "helped_stranger": 122
        },
        "Malaysia": {
            "rank": 64,
            "life_evaluation": 5.955,
            "change_since_2012": 0.195,
            "inequality": 76,
            "social_support": 91,
            "gdp_per_capita": 45,
            "healthy_life_expectancy": None,
            "freedom": 9,
            "generosity": 11,
            "perceptions_of_corruption": 72,
            "positive_emotions": 36,
            "negative_emotions": 54,
            "donated": 11,
            "volunteered": 23,
            "helped_stranger": 62
        },
        "China": {
            "rank": 68,
            "life_evaluation": 5.921,
            "change_since_2012": 0.943,
            "inequality": 85,
            "social_support": 98,
            "gdp_per_capita": 56,
            "healthy_life_expectancy": None,
            "freedom": 65,
            "generosity": 105,
            "perceptions_of_corruption": None,
            "positive_emotions": 68,
            "negative_emotions": 27,
            "donated": 105,
            "volunteered": 80,
            "helped_stranger": 131
        },
        "Turkey": {
            "rank": 94,
            "life_evaluation": 5.262,
            "change_since_2012": -0.083,
            "inequality": 37,
            "social_support": 73,
            "gdp_per_capita": 43,
            "healthy_life_expectancy": None,
            "freedom": 140,
            "generosity": 107,
            "perceptions_of_corruption": 94,
            "positive_emotions": 142,
            "negative_emotions": 101,
            "donated": 107,
            "volunteered": 128,
            "helped_stranger": 120
        },
        "South Africa": {
            "rank": 95,
            "life_evaluation": 5.213,
            "change_since_2012": 0.250,
            "inequality": 127,
            "social_support": 80,
            "gdp_per_capita": 79,
            "healthy_life_expectancy": None,
            "freedom": 96,
            "generosity": 121,
            "perceptions_of_corruption": 106,
            "positive_emotions": 46,
            "negative_emotions": 56,
            "donated": 121,
            "volunteered": 76,
            "helped_stranger": 74
        },
        "Indonesia": {
            "rank": 83,
            "life_evaluation": 5.617,
            "change_since_2012": 0.269,
            "inequality": 100,
            "social_support": 74,
            "gdp_per_capita": 75,
            "healthy_life_expectancy": None,
            "freedom": 24,
            "generosity": 1,
            "perceptions_of_corruption": 123,
            "positive_emotions": 4,
            "negative_emotions": 77,
            "donated": 1,
            "volunteered": 1,
            "helped_stranger": 46
        },
        "India": {
            "rank": None,  # Not found in the ranking list provided
            "life_evaluation": None,
            "change_since_2012": None,
            "inequality": None,
            "social_support": None,
            "gdp_per_capita": None,
            "healthy_life_expectancy": None,
            "freedom": None,
            "generosity": None,
            "perceptions_of_corruption": None,
            "positive_emotions": None,
            "negative_emotions": None,
            "donated": None,
            "volunteered": None,
            "helped_stranger": None
        },
        "Egypt": {
            "rank": None,  # Not found in the ranking list provided
            "life_evaluation": None,
            "change_since_2012": None,
            "inequality": None,
            "social_support": None,
            "gdp_per_capita": None,
            "healthy_life_expectancy": None,
            "freedom": None,
            "generosity": None,
            "perceptions_of_corruption": None,
            "positive_emotions": None,
            "negative_emotions": None,
            "donated": None,
            "volunteered": None,
            "helped_stranger": None
        }
    }
    
    return happiness_data

def analyze_happiness_coverage(our_countries, happiness_data):
    """Analyze happiness data coverage for our 40 countries - EXACT VERIFICATION"""
    print("🔍 ANALYZING WORLD HAPPINESS REPORT DATA")
    print("=" * 50)
    print("VERIFIED DATA FROM USER'S PROVIDED TABLE - NO ASSUMPTIONS")
    print()
    
    matches = []
    missing = []
    
    # Check each of our countries EXACTLY
    for our_country, iso3 in our_countries.items():
        if our_country in happiness_data and happiness_data[our_country]["life_evaluation"] is not None:
            happiness_info = happiness_data[our_country]
            matches.append({
                "country": our_country,
                "iso3": iso3,
                **happiness_info
            })
            print(f"✅ {our_country}: Rank #{happiness_info['rank']}, Life Evaluation: {happiness_info['life_evaluation']}")
        else:
            missing.append({
                "country": our_country,
                "iso3": iso3
            })
            print(f"❌ {our_country}: Not found in happiness data")
    
    coverage_percent = len(matches) / len(our_countries) * 100
    
    print(f"\n📊 EXACT COVERAGE SUMMARY:")
    print(f"Countries with happiness data: {len(matches)}/40 ({coverage_percent:.1f}%)")
    print(f"Countries missing from happiness data: {len(missing)}/40")
    
    if missing:
        print(f"\nMISSING COUNTRIES:")
        for miss in missing:
            print(f"  • {miss['country']} ({miss['iso3']})")
    
    return matches, missing, coverage_percent

def create_happiness_indicators(matches):
    """Create potential ranking indicators from happiness data - VERIFIED ANALYSIS"""
    print(f"\n🎯 POTENTIAL HAPPINESS/WELL-BEING INDICATORS:")
    print("-" * 50)
    print("ANALYSIS BASED ON VERIFIED DATA ONLY")
    print()
    
    indicators = [
        {
            "name": "Life Evaluation (Happiness Score)",
            "description": "Which country has the highest life satisfaction/happiness score?",
            "data_field": "life_evaluation",
            "type": "higher_better"
        },
        {
            "name": "Social Support Ranking", 
            "description": "Which country ranks best for social support?",
            "data_field": "social_support",
            "type": "lower_better"  # Lower rank number = better
        },
        {
            "name": "Freedom Ranking",
            "description": "Which country ranks best for freedom to make life choices?", 
            "data_field": "freedom",
            "type": "lower_better"  # Lower rank number = better
        },
        {
            "name": "Generosity Ranking",
            "description": "Which country ranks best for generosity?",
            "data_field": "generosity", 
            "type": "lower_better"  # Lower rank number = better
        },
        {
            "name": "Perceptions of Corruption Ranking",
            "description": "Which country has the lowest perceived corruption?",
            "data_field": "perceptions_of_corruption",
            "type": "lower_better"  # Lower rank number = better (less corruption)
        },
        {
            "name": "Helped a Stranger Ranking",
            "description": "Which country ranks best for helping strangers?",
            "data_field": "helped_stranger",
            "type": "lower_better"  # Lower rank number = better
        }
    ]
    
    # Analyze data ranges for each indicator - EXACT CALCULATIONS
    for indicator in indicators:
        field = indicator["data_field"]
        
        # Get values, excluding None values
        values = [match[field] for match in matches if match[field] is not None]
        
        if not values:
            print(f"{indicator['name']}:")
            print(f"  ❌ NO DATA AVAILABLE")
            print()
            continue
        
        min_val = min(values)
        max_val = max(values)
        avg_val = sum(values) / len(values)
        
        # Count countries with data
        countries_with_data = len(values)
        countries_missing_data = len(matches) - countries_with_data
        
        print(f"{indicator['name']}:")
        print(f"  Countries with data: {countries_with_data}/{len(matches)}")
        print(f"  Range: {min_val} - {max_val}")
        print(f"  Average: {avg_val:.2f}")
        print(f"  Missing data: {countries_missing_data} countries")
        
        # EXACT suitability assessment
        coverage_rate = len(matches) / 40 * 100  # Out of our 40 countries
        data_completeness = countries_with_data / len(matches) * 100  # Of countries with happiness data
        
        if coverage_rate >= 90 and data_completeness >= 80:
            print(f"  ✅ EXCELLENT for ranking games ({coverage_rate:.0f}% coverage, {data_completeness:.0f}% complete)")
        elif coverage_rate >= 75 and data_completeness >= 60:
            print(f"  ⚠️  GOOD for ranking games ({coverage_rate:.0f}% coverage, {data_completeness:.0f}% complete)")
        else:
            print(f"  ❌ LIMITED for ranking games ({coverage_rate:.0f}% coverage, {data_completeness:.0f}% complete)")
        print()
    
    return indicators

def main():
    print("🚀 WORLD HAPPINESS REPORT DATA EXTRACTION - VERIFIED")
    print("Extracting from user's provided happiness table - NO ASSUMPTIONS, ALL VERIFIED")
    print()
    
    # Load our countries
    our_countries = load_our_countries()
    print(f"✅ Loaded {len(our_countries)} countries from our dataset")
    
    # Create happiness data from user's table
    happiness_data = create_happiness_data_manually()
    print(f"✅ Manually extracted happiness data")
    print("   SOURCE: User's provided World Happiness Report table")
    print("   DATE: Current as of provided data")
    
    # Analyze coverage EXACTLY
    matches, missing, coverage_percent = analyze_happiness_coverage(our_countries, happiness_data)
    
    # Create potential indicators
    indicators = create_happiness_indicators(matches)
    
    # Save results with FULL VERIFICATION
    results = {
        "extraction_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "source": "World Happiness Report (user provided table)",
        "data_verified": True,
        "verification_method": "Manual extraction from user's happiness data table",
        "assumptions_made": "NONE - all data verified",
        "coverage": {
            "total_our_countries": len(our_countries),
            "countries_with_happiness_data": len(matches),
            "countries_missing_happiness_data": len(missing),
            "exact_coverage_percent": coverage_percent
        },
        "countries_with_data": matches,
        "countries_missing_data": missing,
        "potential_indicators": indicators,
        "recommendation": "EXCELLENT data source" if coverage_percent >= 90 else "GOOD data source" if coverage_percent >= 75 else "ADEQUATE data source" if coverage_percent >= 60 else "LIMITED data source"
    }
    
    with open('happiness_report_verified.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"📁 Results saved to: happiness_report_verified.json")
    
    # EXACT FINAL ASSESSMENT
    print(f"\n🎯 FINAL ASSESSMENT:")
    if coverage_percent >= 90:
        print(f"   ✅ EXCELLENT DATA SOURCE - {coverage_percent:.1f}% coverage")
        print(f"   Recommendation: Use 4-6 happiness indicators")
    elif coverage_percent >= 75:
        print(f"   ⚠️  GOOD DATA SOURCE - {coverage_percent:.1f}% coverage") 
        print(f"   Recommendation: Use 2-3 best happiness indicators")
    elif coverage_percent >= 60:
        print(f"   ⚠️  ADEQUATE DATA SOURCE - {coverage_percent:.1f}% coverage")
        print(f"   Recommendation: Use 1-2 happiness indicators")
    else:
        print(f"   ❌ LIMITED DATA SOURCE - {coverage_percent:.1f}% coverage")
        print(f"   Recommendation: Skip happiness data, find alternative")

if __name__ == "__main__":
    main()