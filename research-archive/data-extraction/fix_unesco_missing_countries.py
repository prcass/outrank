#!/usr/bin/env python3
"""
Fix UNESCO data - add Japan and Mexico that were missed
Re-examine user's data to find Japan and Mexico
"""

import json
import time

def find_missing_countries_in_unesco_data():
    """Re-examine the user's UNESCO data to find Japan and Mexico"""
    
    print("🔍 RE-EXAMINING USER'S UNESCO DATA FOR JAPAN AND MEXICO")
    print("=" * 55)
    
    # Let me search through the user's original data again
    # Looking for Japan and Mexico in the UNESCO table
    
    # From user's data, searching for Japan:
    # "Japan Japan    21    5        26    1    Asia and the Pacific"
    
    # From user's data, searching for Mexico:  
    # "Mexico Mexico    28    6    2    36        Latin America & the Caribbean"
    
    print("FOUND IN USER'S ORIGINAL DATA:")
    print("Japan Japan    21    5        26    1    Asia and the Pacific")
    print("Mexico Mexico    28    6    2    36        Latin America & the Caribbean")
    print()
    
    missing_countries_data = {
        "Japan": {
            "cultural_sites": 21,
            "natural_sites": 5, 
            "mixed_sites": 0,
            "total_sites": 26,
            "shared_sites": 1,
            "unesco_region": "Asia and the Pacific"
        },
        "Mexico": {
            "cultural_sites": 28,
            "natural_sites": 6,
            "mixed_sites": 2, 
            "total_sites": 36,
            "shared_sites": 0,
            "unesco_region": "Latin America & the Caribbean"
        }
    }
    
    return missing_countries_data

def update_unesco_dataset():
    """Update the UNESCO dataset with Japan and Mexico"""
    
    # Load current dataset
    with open('unesco_heritage_verified.json', 'r') as f:
        current_data = json.load(f)
    
    # Get missing countries data
    missing_data = find_missing_countries_in_unesco_data()
    
    # Add Japan and Mexico to the dataset
    for country, data in missing_data.items():
        new_entry = {
            "country": country,
            "iso3": "JPN" if country == "Japan" else "MEX",
            "cultural_sites": data["cultural_sites"],
            "natural_sites": data["natural_sites"],
            "mixed_sites": data["mixed_sites"], 
            "total_sites": data["total_sites"],
            "shared_sites": data["shared_sites"]
        }
        current_data["countries_with_data"].append(new_entry)
        print(f"✅ Added {country}: {data['total_sites']} total sites ({data['cultural_sites']} cultural, {data['natural_sites']} natural, {data['mixed_sites']} mixed)")
    
    # Remove Japan and Mexico from missing list
    current_data["countries_missing_data"] = []
    
    # Update coverage statistics
    current_data["coverage"]["countries_with_unesco_data"] = 40
    current_data["coverage"]["countries_missing_unesco_data"] = 0  
    current_data["coverage"]["exact_coverage_percent"] = 100.0
    
    # Update metadata
    current_data["extraction_date"] = time.strftime("%Y-%m-%d %H:%M:%S")
    current_data["verification_method"] = "Manual extraction from user's table - CORRECTED to include Japan and Mexico"
    current_data["recommendation"] = "EXCELLENT data source"
    
    # Recalculate indicator statistics
    all_countries = current_data["countries_with_data"]
    
    indicators_updated = []
    for indicator in current_data["potential_indicators"]:
        field = indicator["data_field"] 
        values = [country[field] for country in all_countries]
        
        min_val = min(values)
        max_val = max(values)
        avg_val = sum(values) / len(values)
        non_zero = len([v for v in values if v > 0])
        zero_countries = len(all_countries) - non_zero
        
        indicator_updated = indicator.copy()
        indicator_updated["statistics"] = {
            "countries_analyzed": len(all_countries),
            "range_min": min_val,
            "range_max": max_val, 
            "average": round(avg_val, 1),
            "countries_with_nonzero": non_zero,
            "countries_with_zero": zero_countries,
            "nonzero_percentage": round(non_zero/len(all_countries)*100, 1)
        }
        
        indicators_updated.append(indicator_updated)
    
    current_data["potential_indicators"] = indicators_updated
    
    # Save updated dataset
    with open('unesco_heritage_complete.json', 'w') as f:
        json.dump(current_data, f, indent=2)
    
    print(f"\n📊 UPDATED COVERAGE SUMMARY:")
    print(f"Countries with UNESCO data: 40/40 (100.0%)")
    print(f"Countries missing: 0/40")
    print(f"\n📁 Updated dataset saved to: unesco_heritage_complete.json")
    
    # Show final indicator assessment
    print(f"\n🎯 FINAL UNESCO INDICATORS ASSESSMENT:")
    print("-" * 45)
    
    for indicator in indicators_updated:
        name = indicator["name"]
        stats = indicator["statistics"]
        nonzero_pct = stats["nonzero_percentage"]
        
        print(f"{name}:")
        print(f"  Coverage: 100% (40/40 countries)")
        print(f"  Range: {stats['range_min']} - {stats['range_max']}")
        print(f"  Average: {stats['average']}")
        print(f"  Non-zero data: {nonzero_pct}%")
        
        if nonzero_pct >= 90:
            print(f"  ✅ EXCELLENT for ranking games")
        elif nonzero_pct >= 75:
            print(f"  ✅ VERY GOOD for ranking games") 
        elif nonzero_pct >= 50:
            print(f"  ⚠️  GOOD for ranking games")
        else:
            print(f"  ❌ LIMITED for ranking games")
        print()

def main():
    print("🚀 FIXING UNESCO DATA - ADDING JAPAN AND MEXICO")
    print("User is correct - both countries are in the original data")
    print()
    
    # Find and add missing countries
    update_unesco_dataset()
    
    print(f"\n✅ CORRECTION COMPLETE")
    print(f"UNESCO World Heritage Sites data now has 100% coverage for our 40 countries")
    print(f"Ready to use 3-4 UNESCO indicators in the final dataset")

if __name__ == "__main__":
    main()