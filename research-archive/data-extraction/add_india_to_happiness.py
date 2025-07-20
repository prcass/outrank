#!/usr/bin/env python3
"""
Add India to happiness data using the provided data
Extract India's data from user's table
"""

import json
import time

def add_india_to_happiness():
    """Add India to the happiness dataset with provided data"""
    
    # Load current dataset
    with open('happiness_report_verified.json', 'r') as f:
        current_data = json.load(f)
    
    print("🔍 ADDING INDIA TO HAPPINESS DATA")
    print("=" * 40)
    print("VERIFIED DATA FROM USER'S PROVIDED TABLE - NO ASSUMPTIONS")
    print()
    
    # India data exactly as provided by user:
    # Rank 118, Life evaluation 4.389, Change -0.383, etc.
    
    india_data = {
        "country": "India",
        "iso3": "IND",
        "rank": 118,
        "life_evaluation": 4.389,
        "change_since_2012": -0.383,
        "inequality": 118,
        "social_support": 128,
        "gdp_per_capita": 93,
        "healthy_life_expectancy": None,
        "freedom": 23,
        "generosity": 51,
        "perceptions_of_corruption": 56,
        "positive_emotions": 89,
        "negative_emotions": 117,
        "donated": 51,
        "volunteered": 16,
        "helped_stranger": 80
    }
    
    # Add India to the dataset
    current_data["countries_with_data"].append(india_data)
    print(f"✅ Added India: Rank #{india_data['rank']}, Life Evaluation: {india_data['life_evaluation']}")
    
    # Update missing countries list - remove India, keep only Egypt
    current_data["countries_missing_data"] = [
        {"country": "Egypt", "iso3": "EGY"}
    ]
    
    # Update coverage statistics
    current_data["coverage"]["countries_with_happiness_data"] = 39
    current_data["coverage"]["countries_missing_happiness_data"] = 1
    current_data["coverage"]["exact_coverage_percent"] = 97.5
    
    # Update metadata
    current_data["extraction_date"] = time.strftime("%Y-%m-%d %H:%M:%S")
    current_data["verification_method"] = "Manual extraction from user's happiness table - CORRECTED to include France and India"
    
    # Save updated dataset
    with open('happiness_report_verified.json', 'w') as f:
        json.dump(current_data, f, indent=2)
    
    print(f"\n📊 UPDATED COVERAGE SUMMARY:")
    print(f"Countries with happiness data: 39/40 (97.5%)")
    print(f"Countries still missing: 1/40 (Egypt only)")
    print(f"\n📁 Updated dataset saved")
    
    print(f"\n🔍 STILL LOOKING FOR EGYPT")
    print(f"   Need Egypt's data to reach 100% coverage")
    print(f"   Egypt should be in the happiness data according to user")

def main():
    print("🚀 ADDING INDIA TO HAPPINESS DATA - VERIFIED")
    print("Using exact data provided by user")
    print()
    
    add_india_to_happiness()

if __name__ == "__main__":
    main()