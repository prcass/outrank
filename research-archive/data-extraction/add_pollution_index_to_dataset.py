#!/usr/bin/env python3
"""
Add Pollution Index to the final 40-country dataset
All 40 countries have pollution index data (100% coverage)
Updates dataset from 31 to 32 indicators
"""

import json
from datetime import datetime

def add_pollution_index():
    """Add Numbeo Pollution Index to our final dataset"""
    
    print("🏭 Adding Pollution Index to Final Dataset")
    print("=" * 50)
    
    # Load existing final dataset with 31 indicators
    with open('know_it_all_final_40_countries_31_indicators_20250719_181445.json', 'r') as f:
        dataset = json.load(f)
    
    # Pollution Index data from Numbeo - EXACT VALUES (No Assumptions)
    # Source: https://www.numbeo.com/pollution/rankings_by_country.jsp?title=2025-mid&displayColumn=0
    # Date: 2025 Mid-Year
    # Higher score = higher pollution (worse environmental quality)
    pollution_data = {
        "Germany": 28.83,
        "Denmark": 20.90,
        "Austria": 20.64,
        "Turkey": 64.07,
        "United States": 36.87,
        "China": 76.74,
        "Japan": 38.21,
        "United Kingdom": 40.69,
        "France": 43.67,
        "Italy": 53.40,
        "Canada": 29.84,
        "Australia": 26.89,
        "Spain": 35.26,
        "Netherlands": 20.91,
        "Sweden": 17.58,
        "Norway": 18.27,
        "Finland": 11.72,
        "Iceland": 16.67,
        "Switzerland": 23.97,
        "Belgium": 49.25,
        "New Zealand": 26.00,
        "Singapore": 32.33,
        "Israel": 56.70,
        "Ireland": 34.85,
        "Brazil": 52.78,
        "Mexico": 58.35,
        "Argentina": 50.81,
        "Chile": 77.37,
        "Colombia": 62.22,
        "Poland": 55.34,
        "Czech Republic": 34.56,
        "Thailand": 75.56,
        "Malaysia": 60.87,
        "Philippines": 72.51,
        "Indonesia": 68.07,
        "Vietnam": 83.82,
        "India": 72.81,
        "South Africa": 56.68,
        "Egypt": 82.73,
        "Pakistan": 73.20
    }
    
    # Update dataset info
    dataset['dataset_info']['indicator_count'] = 32
    dataset['dataset_info']['version'] = "2.2"
    dataset['dataset_info']['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    dataset['dataset_info']['changes_from_v2.1'] = [
        "Added Pollution Index indicator (Numbeo source)",
        "100% coverage across all 40 countries", 
        "31 → 32 total indicators"
    ]
    
    # Update data sources
    dataset['data_sources']['pollution_index'] = {
        "indicators": 1,
        "coverage": "100%",
        "source": "Numbeo Pollution Index",
        "url": "https://www.numbeo.com/pollution/rankings_by_country.jsp?title=2025-mid&displayColumn=0",
        "verification": "Manual extraction July 2025",
        "date": "2025 Mid-Year",
        "note": "Higher score = higher pollution (worse environmental quality)"
    }
    
    # Add pollution index to each country
    print("🌍 Adding pollution index data to all 40 countries...")
    
    for country in dataset['countries']:
        country_name = country['name']
        if country_name in pollution_data:
            country['pollution_index'] = pollution_data[country_name]
            print(f"   ✅ {country_name}: {pollution_data[country_name]}")
        else:
            # Handle any name mismatches
            print(f"   ⚠️  {country_name}: Pollution data not found")
            country['pollution_index'] = None
    
    # Update indicators section
    dataset['indicators']['total_count'] = 32
    dataset['indicators']['pollution_indicators'] = 1
    dataset['indicators']['added_in_v2.2'] = ["Pollution Index (Numbeo)"]
    
    # Add pollution indicator definition
    if 'pollution_indicators_details' not in dataset['indicators']:
        dataset['indicators']['pollution_indicators_details'] = [
            {
                "name": "Pollution Index",
                "description": "Which country has the lowest pollution (cleanest environment)?",
                "data_field": "pollution_index",
                "type": "lower_better",
                "unit": "Index score (0-100)",
                "source": "Numbeo Pollution Index 2025 Mid-Year",
                "note": "Higher score = higher pollution (worse environmental quality)"
            }
        ]
    
    # Save updated dataset
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"know_it_all_final_40_countries_32_indicators_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"\n✅ Pollution Index Added Successfully!")
    print(f"📁 Updated dataset: {filename}")
    print(f"🌍 Countries: 40")
    print(f"📊 Indicators: 32 (was 31)")
    print(f"🎯 Pollution Index Coverage: 100%")
    
    # Verify coverage
    countries_with_pollution = sum(1 for country in dataset['countries'] if country.get('pollution_index') is not None)
    print(f"📈 Verification: {countries_with_pollution}/40 countries have pollution data")
    
    print(f"\n📋 Updated Dataset Summary:")
    print(f"   • World Bank indicators: 20 (100%)")
    print(f"   • UNESCO Heritage: 4 (100%)")
    print(f"   • Happiness: 1 (100%)")
    print(f"   • Agriculture: 3 (100%)")
    print(f"   • Food security: 1 (97.5%)")
    print(f"   • Nobel Laureates: 1 (100%)")
    print(f"   • Crime Index: 1 (100%)")
    print(f"   • Pollution Index: 1 (100%) ← NEW")
    print(f"   • Total: 32 indicators")
    
    print(f"\n🌟 Environmental & Safety Coverage:")
    print(f"   • Crime Index: Safety/security dimension")
    print(f"   • Pollution Index: Environmental quality dimension")
    print(f"   • Both with 100% coverage across all 40 countries")
    
    return filename

if __name__ == "__main__":
    add_pollution_index()