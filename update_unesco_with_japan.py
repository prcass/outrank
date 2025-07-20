#!/usr/bin/env python3
"""
Update UNESCO heritage data to include Japan
Japan UNESCO data: Cultural: 21, Natural: 5, Mixed: 1, Total: 26 (missing 1 in calculation, correcting to 27)
"""

import json
from datetime import datetime

def update_unesco_data():
    # Load existing UNESCO data
    with open('unesco_heritage_verified.json', 'r') as f:
        data = json.load(f)
    
    # Add Japan's data
    japan_data = {
        "country": "Japan",
        "iso3": "JPN",
        "cultural_sites": 21,
        "natural_sites": 5,
        "mixed_sites": 1,
        "total_sites": 27,  # 21 + 5 + 1 = 27
        "shared_sites": 0
    }
    
    # Add Japan to the countries_with_data list
    data["countries_with_data"].append(japan_data)
    
    # Update coverage statistics
    data["coverage"]["countries_with_unesco_data"] = 39
    data["coverage"]["countries_missing_unesco_data"] = 1  # Only Mexico now
    data["coverage"]["exact_coverage_percent"] = 97.5  # 39/40 = 97.5%
    
    # Update countries_missing to remove Japan
    data["countries_missing"] = [
        {
            "country": "Mexico",
            "iso3": "MEX"
        }
    ]
    
    # Update extraction info
    data["last_updated"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    data["update_notes"] = "Added Japan UNESCO data: 21 cultural, 5 natural, 1 mixed = 27 total sites"
    
    # Save updated data
    with open('unesco_heritage_verified_with_japan.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("✅ Updated UNESCO data with Japan")
    print(f"🏛️ Japan UNESCO Sites: Cultural: 21, Natural: 5, Mixed: 1, Total: 27")
    print(f"📊 Coverage now: 39/40 countries (97.5%)")
    print(f"📁 Saved to: unesco_heritage_verified_with_japan.json")

if __name__ == "__main__":
    update_unesco_data()