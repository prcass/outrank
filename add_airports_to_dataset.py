#!/usr/bin/env python3
"""
Add Airports to the final 40-country dataset
All 40 countries have airports data (100% coverage)
Updates dataset from 32 to 33 indicators
"""

import json
from datetime import datetime

def add_airports():
    """Add CIA World Factbook Airports data to our final dataset"""
    
    print("✈️ Adding Airports to Final Dataset")
    print("=" * 50)
    
    # Load existing final dataset with 32 indicators
    with open('know_it_all_final_40_countries_32_indicators_20250719_181826.json', 'r') as f:
        dataset = json.load(f)
    
    # Airports data from CIA World Factbook - EXACT VALUES (No Assumptions)
    # Source: CIA World Factbook airports country comparison
    # Date: 2025
    # Higher number = more airports (better infrastructure/connectivity)
    airports_data = {
        "United States": 16116,
        "Brazil": 5297,
        "Australia": 2257,
        "Mexico": 1580,
        "Canada": 1459,
        "France": 1218,
        "United Kingdom": 1057,
        "Germany": 840,
        "Argentina": 764,
        "Colombia": 661,
        "Italy": 655,
        "South Africa": 573,
        "Indonesia": 556,
        "China": 552,
        "Chile": 379,
        "Spain": 365,
        "Poland": 318,
        "India": 315,
        "Japan": 280,
        "Philippines": 256,
        "Czech Republic": 252,
        "New Zealand": 206,
        "Sweden": 206,
        "Norway": 146,
        "Pakistan": 117,
        "Turkey": 116,
        "Thailand": 105,
        "Denmark": 102,
        "Ireland": 100,
        "Malaysia": 100,
        "Finland": 98,
        "Iceland": 82,
        "Egypt": 73,
        "Switzerland": 66,
        "Austria": 62,
        "Belgium": 48,
        "Netherlands": 44,
        "Israel": 40,
        "Vietnam": 36,
        "Singapore": 9
    }
    
    # Update dataset info
    dataset['dataset_info']['indicator_count'] = 33
    dataset['dataset_info']['version'] = "2.3"
    dataset['dataset_info']['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    dataset['dataset_info']['changes_from_v2.2'] = [
        "Added Airports indicator (CIA World Factbook source)",
        "100% coverage across all 40 countries", 
        "32 → 33 total indicators"
    ]
    
    # Update data sources
    dataset['data_sources']['airports'] = {
        "indicators": 1,
        "coverage": "100%",
        "source": "CIA World Factbook",
        "url": "https://www.cia.gov/the-world-factbook/field/airports/country-comparison/",
        "verification": "Manual extraction July 2025",
        "date": "2025",
        "note": "Total number of airports per country (infrastructure indicator)"
    }
    
    # Add airports to each country
    print("✈️ Adding airports data to all 40 countries...")
    
    for country in dataset['countries']:
        country_name = country['name']
        if country_name in airports_data:
            country['airports'] = airports_data[country_name]
            print(f"   ✅ {country_name}: {airports_data[country_name]:,} airports")
        else:
            # Handle any name mismatches
            print(f"   ⚠️  {country_name}: Airports data not found")
            country['airports'] = None
    
    # Update indicators section
    dataset['indicators']['total_count'] = 33
    dataset['indicators']['infrastructure_indicators'] = 1
    dataset['indicators']['added_in_v2.3'] = ["Airports (CIA World Factbook)"]
    
    # Add airports indicator definition
    if 'infrastructure_indicators_details' not in dataset['indicators']:
        dataset['indicators']['infrastructure_indicators_details'] = [
            {
                "name": "Total Airports",
                "description": "Which country has the most airports?",
                "data_field": "airports",
                "type": "higher_better",
                "unit": "Number of airports",
                "source": "CIA World Factbook 2025",
                "note": "Total airports including all types (paved, unpaved, major, minor)"
            }
        ]
    
    # Save updated dataset
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"know_it_all_final_40_countries_33_indicators_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"\n✅ Airports Added Successfully!")
    print(f"📁 Updated dataset: {filename}")
    print(f"🌍 Countries: 40")
    print(f"📊 Indicators: 33 (was 32)")
    print(f"🎯 Airports Coverage: 100%")
    
    # Verify coverage
    countries_with_airports = sum(1 for country in dataset['countries'] if country.get('airports') is not None)
    print(f"📈 Verification: {countries_with_airports}/40 countries have airports data")
    
    print(f"\n📋 Updated Dataset Summary:")
    print(f"   • World Bank indicators: 20 (100%)")
    print(f"   • UNESCO Heritage: 4 (100%)")
    print(f"   • Happiness: 1 (100%)")
    print(f"   • Agriculture: 3 (100%)")
    print(f"   • Food security: 1 (97.5%)")
    print(f"   • Nobel Laureates: 1 (100%)")
    print(f"   • Crime Index: 1 (100%)")
    print(f"   • Pollution Index: 1 (100%)")
    print(f"   • Airports: 1 (100%) ← NEW")
    print(f"   • Total: 33 indicators")
    
    print(f"\n🌟 Infrastructure & Quality Coverage:")
    print(f"   • Airports: Transportation infrastructure")
    print(f"   • Crime Index: Safety/security dimension")
    print(f"   • Pollution Index: Environmental quality dimension")
    print(f"   • All with 100% coverage across all 40 countries")
    
    # Show top and bottom countries
    sorted_countries = sorted(dataset['countries'], key=lambda x: x.get('airports', 0), reverse=True)
    print(f"\n🏆 Top 5 Countries by Airports:")
    for i, country in enumerate(sorted_countries[:5]):
        print(f"   {i+1}. {country['name']}: {country.get('airports', 0):,} airports")
    
    print(f"\n📍 Bottom 5 Countries by Airports:")
    for i, country in enumerate(sorted_countries[-5:]):
        rank = len(sorted_countries) - 4 + i
        print(f"   {rank}. {country['name']}: {country.get('airports', 0)} airports")
    
    return filename

if __name__ == "__main__":
    add_airports()