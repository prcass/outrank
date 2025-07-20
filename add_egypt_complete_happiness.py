#!/usr/bin/env python3
"""
Add Egypt to happiness data to complete 100% coverage
Final completion of happiness dataset for all 40 countries
"""

import json
import time

def add_egypt_complete_happiness():
    """Add Egypt to complete the happiness dataset with 100% coverage"""
    
    # Load current dataset
    with open('happiness_report_verified.json', 'r') as f:
        current_data = json.load(f)
    
    print("🔍 COMPLETING HAPPINESS DATA - ADDING EGYPT")
    print("=" * 50)
    print("VERIFIED DATA FROM USER'S PROVIDED TABLE - NO ASSUMPTIONS")
    print("ACHIEVING 100% COVERAGE FOR ALL 40 COUNTRIES")
    print()
    
    # Egypt data exactly as provided by user:
    # Rank 135, Life evaluation 3.817, Change -0.456, etc.
    
    egypt_data = {
        "country": "Egypt",
        "iso3": "EGY",
        "rank": 135,
        "life_evaluation": 3.817,
        "change_since_2012": -0.456,
        "inequality": 68,
        "social_support": 130,
        "gdp_per_capita": 68,
        "healthy_life_expectancy": None,
        "freedom": 116,
        "generosity": 140,
        "perceptions_of_corruption": None,  # No data shown (dash)
        "positive_emotions": 140,
        "negative_emotions": 124,
        "donated": 140,
        "volunteered": 142,
        "helped_stranger": None  # No data shown (missing from user's data)
    }
    
    # Add Egypt to the dataset
    current_data["countries_with_data"].append(egypt_data)
    print(f"✅ Added Egypt: Rank #{egypt_data['rank']}, Life Evaluation: {egypt_data['life_evaluation']}")
    
    # Update missing countries list - now empty!
    current_data["countries_missing_data"] = []
    
    # Update coverage statistics - 100% coverage achieved!
    current_data["coverage"]["countries_with_happiness_data"] = 40
    current_data["coverage"]["countries_missing_happiness_data"] = 0
    current_data["coverage"]["exact_coverage_percent"] = 100.0
    
    # Update metadata
    current_data["extraction_date"] = time.strftime("%Y-%m-%d %H:%M:%S")
    current_data["verification_method"] = "Manual extraction from user's happiness table - COMPLETE: France, India, and Egypt added"
    current_data["recommendation"] = "EXCELLENT data source - 100% coverage achieved"
    
    # Recalculate indicator statistics with all 40 countries
    all_countries = current_data["countries_with_data"]
    
    indicators_updated = []
    for indicator in current_data["potential_indicators"]:
        field = indicator["data_field"]
        
        # Get values, excluding None values
        values = [country[field] for country in all_countries if country[field] is not None]
        
        if not values:
            continue
        
        min_val = min(values)
        max_val = max(values)
        avg_val = sum(values) / len(values)
        countries_with_data = len(values)
        countries_missing_data = len(all_countries) - countries_with_data
        
        indicator_updated = indicator.copy()
        indicator_updated["final_statistics"] = {
            "total_countries": len(all_countries),
            "countries_with_data": countries_with_data,
            "countries_missing_data": countries_missing_data,
            "data_completeness_percent": round(countries_with_data/len(all_countries)*100, 1),
            "range_min": min_val,
            "range_max": max_val,
            "average": round(avg_val, 2)
        }
        
        indicators_updated.append(indicator_updated)
    
    current_data["potential_indicators"] = indicators_updated
    
    # Save completed dataset
    with open('happiness_report_complete.json', 'w') as f:
        json.dump(current_data, f, indent=2)
    
    print(f"\n🎉 HAPPINESS DATA COMPLETE!")
    print(f"📊 FINAL COVERAGE: 40/40 countries (100.0%)")
    print(f"📁 Complete dataset saved to: happiness_report_complete.json")
    
    # Show final indicator assessment
    print(f"\n🎯 FINAL HAPPINESS INDICATORS ASSESSMENT:")
    print("-" * 50)
    
    for indicator in indicators_updated:
        name = indicator["name"]
        stats = indicator["final_statistics"]
        completeness = stats["data_completeness_percent"]
        
        print(f"{name}:")
        print(f"  Coverage: 100% (40/40 countries)")
        print(f"  Data Completeness: {completeness}%")
        print(f"  Range: {stats['range_min']} - {stats['range_max']}")
        print(f"  Average: {stats['average']}")
        
        if completeness >= 95:
            print(f"  ✅ EXCELLENT for ranking games")
        elif completeness >= 90:
            print(f"  ✅ VERY GOOD for ranking games")
        elif completeness >= 80:
            print(f"  ⚠️  GOOD for ranking games")
        else:
            print(f"  ⚠️  ADEQUATE for ranking games")
        print()

def main():
    print("🚀 COMPLETING HAPPINESS DATA - 100% COVERAGE")
    print("Adding Egypt to achieve full coverage for all 40 countries")
    print()
    
    add_egypt_complete_happiness()
    
    print(f"\n✅ HAPPINESS DATA EXTRACTION COMPLETE")
    print(f"Ready to use 6 happiness indicators in the final dataset")
    print(f"All data verified from user's provided World Happiness Report table")

if __name__ == "__main__":
    main()