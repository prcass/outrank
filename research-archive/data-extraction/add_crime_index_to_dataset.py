#!/usr/bin/env python3
"""
Add Crime Index to the final 40-country dataset
All 40 countries have crime index data (100% coverage)
Updates dataset from 30 to 31 indicators
"""

import json
from datetime import datetime

def add_crime_index():
    """Add Numbeo Crime Index to our final dataset"""
    
    print("🚨 Adding Crime Index to Final Dataset")
    print("=" * 50)
    
    # Load existing final dataset
    with open('know_it_all_final_40_countries_20250719_175553.json', 'r') as f:
        dataset = json.load(f)
    
    # Crime Index data from Numbeo - EXACT VALUES (No Assumptions)
    # Source: https://www.numbeo.com/crime/rankings_by_country.jsp
    # Date: 2025 Mid-Year
    # Higher score = higher crime rate (worse safety)
    crime_data = {
        "Germany": 39.56,
        "Denmark": 26.02,
        "Austria": 28.26,
        "Turkey": 41.35,
        "United States": 49.17,
        "China": 23.53,
        "Japan": 22.70,
        "United Kingdom": 48.42,
        "France": 55.62,
        "Italy": 47.24,
        "Canada": 45.81,
        "Australia": 47.41,
        "Spain": 37.17,
        "Netherlands": 25.83,
        "Sweden": 48.06,
        "Norway": 32.83,
        "Finland": 26.54,
        "Iceland": 25.79,
        "Switzerland": 26.71,
        "Belgium": 49.50,
        "New Zealand": 48.45,
        "Singapore": 22.62,
        "Israel": 31.73,
        "Ireland": 48.64,
        "Brazil": 64.24,
        "Mexico": 53.17,
        "Argentina": 63.32,
        "Chile": 60.54,
        "Colombia": 60.97,
        "Poland": 28.71,
        "Czech Republic": 26.58,
        "Thailand": 36.84,
        "Malaysia": 48.62,
        "Philippines": 43.40,
        "Indonesia": 46.06,
        "Vietnam": 40.38,
        "India": 44.25,
        "South Africa": 74.57,
        "Egypt": 46.93,
        "Pakistan": 42.44
    }
    
    # Update dataset info
    dataset['dataset_info']['indicator_count'] = 31
    dataset['dataset_info']['version'] = "2.1"
    dataset['dataset_info']['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    dataset['dataset_info']['changes_from_v2'] = [
        "Added Crime Index indicator (Numbeo source)",
        "100% coverage across all 40 countries", 
        "30 → 31 total indicators"
    ]
    
    # Update data sources
    dataset['data_sources']['crime_index'] = {
        "indicators": 1,
        "coverage": "100%",
        "source": "Numbeo Crime Index",
        "url": "https://www.numbeo.com/crime/rankings_by_country.jsp",
        "verification": "Manual extraction July 2025",
        "note": "Higher score = higher crime rate (lower safety)"
    }
    
    # Add crime index to each country
    print("📊 Adding crime index data to all 40 countries...")
    
    for country in dataset['countries']:
        country_name = country['name']
        if country_name in crime_data:
            country['crime_index'] = crime_data[country_name]
            print(f"   ✅ {country_name}: {crime_data[country_name]}")
        else:
            # Handle any name mismatches
            print(f"   ⚠️  {country_name}: Crime data not found")
            country['crime_index'] = None
    
    # Update indicators section
    dataset['indicators']['total_count'] = 31
    dataset['indicators']['crime_indicators'] = 1
    dataset['indicators']['added_in_v2.1'] = ["Crime Index (Numbeo)"]
    
    # Add crime indicator definition
    if 'crime_indicators' not in dataset['indicators']:
        dataset['indicators']['crime_indicators_details'] = [
            {
                "name": "Crime Index",
                "description": "Which country has the lowest crime rate (safest)?",
                "data_field": "crime_index",
                "type": "lower_better",
                "unit": "Index score (0-100)",
                "source": "Numbeo Crime Index 2025",
                "note": "Higher score = higher crime rate (less safe)"
            }
        ]
    
    # Save updated dataset
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"know_it_all_final_40_countries_31_indicators_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"\n✅ Crime Index Added Successfully!")
    print(f"📁 Updated dataset: {filename}")
    print(f"🌍 Countries: 40")
    print(f"📊 Indicators: 31 (was 30)")
    print(f"🎯 Crime Index Coverage: 100%")
    
    # Verify coverage
    countries_with_crime = sum(1 for country in dataset['countries'] if country.get('crime_index') is not None)
    print(f"📈 Verification: {countries_with_crime}/40 countries have crime data")
    
    print(f"\n📋 Updated Dataset Summary:")
    print(f"   • World Bank indicators: 20 (100%)")
    print(f"   • UNESCO Heritage: 4 (100%)")
    print(f"   • Happiness: 1 (100%)")
    print(f"   • Agriculture: 3 (100%)")
    print(f"   • Food security: 1 (97.5%)")
    print(f"   • Nobel Laureates: 1 (100%)")
    print(f"   • Crime Index: 1 (100%) ← NEW")
    print(f"   • Total: 31 indicators")
    
    return filename

if __name__ == "__main__":
    add_crime_index()