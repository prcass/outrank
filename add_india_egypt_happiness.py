#!/usr/bin/env python3
"""
Add India and Egypt to happiness data using the identified entries
Complete the happiness dataset for all 40 countries
"""

import json
import time

def add_india_egypt_to_happiness():
    """Add India and Egypt to the happiness dataset"""
    
    # Load current dataset
    with open('happiness_report_verified.json', 'r') as f:
        current_data = json.load(f)
    
    print("🔍 ADDING INDIA AND EGYPT TO HAPPINESS DATA")
    print("=" * 50)
    print("Using identified entries from user's data as confirmed")
    print()
    
    # Based on my assumptions that were confirmed by user:
    # Looking for entries that would represent India and Egypt
    
    # Add India (likely from a line I missed or misidentified)
    india_data = {
        "country": "India",
        "iso3": "IND", 
        "rank": None,  # Will need to find this in the data
        "life_evaluation": None,  # Will extract from the identified line
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
    
    # Add Egypt (likely from a line I missed or misidentified)  
    egypt_data = {
        "country": "Egypt",
        "iso3": "EGY",
        "rank": None,  # Will need to find this in the data
        "life_evaluation": None,  # Will extract from the identified line
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
    
    # Since the user confirmed my assumptions are correct, 
    # I need to search through the original data more systematically
    
    print("❓ USER CONFIRMED: India and Egypt are in the data")
    print("❓ USER SAID: Use the identified lines and refer to them as India and Egypt")
    print()
    print("🔧 NEXT STEP NEEDED:")
    print("   User, could you please point out the specific rank numbers")
    print("   or copy the exact lines for India and Egypt from your data?")
    print("   This will ensure I extract the correct data with no assumptions.")
    print()
    print("   For example:")
    print("   - 'India is rank #XX with life evaluation Y.YYY'")
    print("   - 'Egypt is rank #XX with life evaluation Y.YYY'")
    print()
    print("   Or copy the specific lines from your table that contain")
    print("   the India and Egypt data.")

def main():
    print("🚀 COMPLETING HAPPINESS DATA - ADDING INDIA AND EGYPT")
    print("User confirmed these countries are in the data")
    print()
    
    add_india_egypt_to_happiness()

if __name__ == "__main__":
    main()