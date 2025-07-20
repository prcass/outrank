#!/usr/bin/env python3
"""
Add both Japan and Mexico UNESCO data to complete the dataset
Japan: Cultural: 21, Natural: 5, Mixed: 1, Total: 26 (user-provided)
Mexico: Cultural: 28, Natural: 6, Mixed: 2, Total: 36 (user-provided)
"""

import json
from datetime import datetime

def complete_unesco_data():
    # Load existing UNESCO data
    with open('unesco_heritage_verified.json', 'r') as f:
        data = json.load(f)
    
    # Add Japan's data (user-verified)
    japan_data = {
        "country": "Japan",
        "iso3": "JPN",
        "cultural_sites": 21,
        "natural_sites": 5,
        "mixed_sites": 1,
        "total_sites": 26,  # User-provided total
        "shared_sites": 0,
        "note": "User-verified data"
    }
    
    # Add Mexico's data (user-verified)
    mexico_data = {
        "country": "Mexico",
        "iso3": "MEX",
        "cultural_sites": 28,
        "natural_sites": 6,
        "mixed_sites": 2,
        "total_sites": 36,  # User-provided total
        "shared_sites": 0,
        "note": "User-verified data"
    }
    
    # Add both countries to the countries_with_data list
    data["countries_with_data"].extend([japan_data, mexico_data])
    
    # Update coverage statistics - NOW 100% COMPLETE!
    data["coverage"]["countries_with_unesco_data"] = 40
    data["coverage"]["countries_missing_unesco_data"] = 0
    data["coverage"]["exact_coverage_percent"] = 100.0  # 40/40 = 100%
    
    # Remove countries_missing section - no longer needed
    data["countries_missing"] = []
    
    # Update extraction info
    data["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data["update_notes"] = "COMPLETED: Added Japan (21+5+1=26) and Mexico (28+6+2=36) UNESCO data - 100% coverage achieved"
    
    # Save complete UNESCO data
    with open('unesco_heritage_complete_all40.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("🎉 UNESCO Dataset Now 100% COMPLETE!")
    print(f"🏛️ Japan UNESCO Sites: Cultural: 21, Natural: 5, Mixed: 1, Total: 26")
    print(f"🏛️ Mexico UNESCO Sites: Cultural: 28, Natural: 6, Mixed: 2, Total: 36")
    print(f"📊 Coverage: 40/40 countries (100%)")
    print(f"📁 Saved to: unesco_heritage_complete_all40.json")
    
    # Show top UNESCO countries
    print(f"\n🏆 Top UNESCO Heritage Countries:")
    all_countries = data["countries_with_data"]
    top_countries = sorted(all_countries, key=lambda x: x['total_sites'], reverse=True)[:5]
    for i, country in enumerate(top_countries, 1):
        print(f"   {i}. {country['country']}: {country['total_sites']} sites")

if __name__ == "__main__":
    complete_unesco_data()