#!/usr/bin/env python3
"""
Check which country is missing corruption data in the 38-country dataset
"""

import json

def check_corruption_data():
    """Check which country is missing corruption perception data"""
    
    with open('happiness_indicators_38_countries.json', 'r') as f:
        happiness_data = json.load(f)
    
    print("🔍 CHECKING CORRUPTION DATA COMPLETENESS")
    print("=" * 45)
    
    countries = happiness_data["countries_with_data"]
    
    print(f"Total countries: {len(countries)}")
    print(f"Checking 'perceptions_of_corruption' field for each country:")
    print()
    
    missing_corruption = []
    has_corruption = []
    
    for country in countries:
        corruption_data = country.get("perceptions_of_corruption")
        if corruption_data is None:
            missing_corruption.append(country["country"])
            print(f"❌ {country['country']}: No corruption data")
        else:
            has_corruption.append(country["country"])
            print(f"✅ {country['country']}: {corruption_data}")
    
    print(f"\n📊 CORRUPTION DATA SUMMARY:")
    print(f"Countries with corruption data: {len(has_corruption)}/38")
    print(f"Countries missing corruption data: {len(missing_corruption)}/38")
    
    if missing_corruption:
        print(f"\nMISSING CORRUPTION DATA:")
        for country in missing_corruption:
            print(f"  • {country}")
    
    completion_rate = len(has_corruption) / len(countries) * 100
    print(f"\nCompletion rate: {completion_rate:.1f}%")
    
    if completion_rate == 100.0:
        print("✅ Corruption indicator ready for use!")
    else:
        print("⚠️  Consider removing corruption indicator or missing countries")

def main():
    check_corruption_data()

if __name__ == "__main__":
    main()