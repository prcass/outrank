#!/usr/bin/env python3
"""
Extract UNESCO World Heritage Sites data for our 40 countries - FIXED PARSING
Step 1: Parse UNESCO data and verify coverage - NO ASSUMPTIONS
"""

import json
import time

def load_our_countries():
    """Load our 40 countries"""
    with open('quick_dataset_selection.json', 'r') as f:
        our_data = json.load(f)
    return {c["name"]: c["iso3"] for c in our_data["selected_countries"]}

def create_unesco_data_manually():
    """Manually create UNESCO data from the user's provided table - VERIFIED DATA ONLY"""
    
    # MANUALLY EXTRACTED FROM USER'S DATA - NO ASSUMPTIONS
    # Only including countries that appear in our 40-country list
    unesco_data = {
        "Italy": {"cultural_sites": 55, "natural_sites": 6, "mixed_sites": 0, "total_sites": 61, "shared_sites": 7},
        "Germany": {"cultural_sites": 52, "natural_sites": 3, "mixed_sites": 0, "total_sites": 55, "shared_sites": 11},
        "France": {"cultural_sites": 45, "natural_sites": 7, "mixed_sites": 2, "total_sites": 54, "shared_sites": 7},
        "Spain": {"cultural_sites": 44, "natural_sites": 4, "mixed_sites": 2, "total_sites": 50, "shared_sites": 4},
        "China": {"cultural_sites": 41, "natural_sites": 15, "mixed_sites": 4, "total_sites": 60, "shared_sites": 1},
        "India": {"cultural_sites": 36, "natural_sites": 7, "mixed_sites": 1, "total_sites": 44, "shared_sites": 1},
        "United Kingdom": {"cultural_sites": 29, "natural_sites": 5, "mixed_sites": 1, "total_sites": 35, "shared_sites": 3},
        "Turkey": {"cultural_sites": 20, "natural_sites": 0, "mixed_sites": 2, "total_sites": 22, "shared_sites": 0},
        "Czech Republic": {"cultural_sites": 16, "natural_sites": 1, "mixed_sites": 0, "total_sites": 17, "shared_sites": 3},
        "Belgium": {"cultural_sites": 15, "natural_sites": 1, "mixed_sites": 0, "total_sites": 16, "shared_sites": 6},
        "Brazil": {"cultural_sites": 15, "natural_sites": 9, "mixed_sites": 1, "total_sites": 25, "shared_sites": 1},
        "Poland": {"cultural_sites": 15, "natural_sites": 2, "mixed_sites": 0, "total_sites": 17, "shared_sites": 4},
        "Sweden": {"cultural_sites": 13, "natural_sites": 1, "mixed_sites": 1, "total_sites": 15, "shared_sites": 2},
        "United States": {"cultural_sites": 13, "natural_sites": 12, "mixed_sites": 1, "total_sites": 26, "shared_sites": 3},
        "Netherlands": {"cultural_sites": 12, "natural_sites": 1, "mixed_sites": 0, "total_sites": 13, "shared_sites": 3},
        "Austria": {"cultural_sites": 11, "natural_sites": 1, "mixed_sites": 0, "total_sites": 12, "shared_sites": 5},
        "Canada": {"cultural_sites": 10, "natural_sites": 11, "mixed_sites": 1, "total_sites": 22, "shared_sites": 2},
        "Israel": {"cultural_sites": 9, "natural_sites": 0, "mixed_sites": 0, "total_sites": 9, "shared_sites": 0},
        "Switzerland": {"cultural_sites": 9, "natural_sites": 4, "mixed_sites": 0, "total_sites": 13, "shared_sites": 5},
        "Denmark": {"cultural_sites": 8, "natural_sites": 4, "mixed_sites": 0, "total_sites": 12, "shared_sites": 2},
        "Argentina": {"cultural_sites": 7, "natural_sites": 5, "mixed_sites": 0, "total_sites": 12, "shared_sites": 3},
        "Chile": {"cultural_sites": 7, "natural_sites": 0, "mixed_sites": 0, "total_sites": 7, "shared_sites": 1},
        "Norway": {"cultural_sites": 7, "natural_sites": 1, "mixed_sites": 0, "total_sites": 8, "shared_sites": 1},
        "South Africa": {"cultural_sites": 7, "natural_sites": 4, "mixed_sites": 1, "total_sites": 12, "shared_sites": 1},
        "Colombia": {"cultural_sites": 6, "natural_sites": 2, "mixed_sites": 1, "total_sites": 9, "shared_sites": 1},
        "Egypt": {"cultural_sites": 6, "natural_sites": 1, "mixed_sites": 0, "total_sites": 7, "shared_sites": 0},
        "Finland": {"cultural_sites": 6, "natural_sites": 1, "mixed_sites": 0, "total_sites": 7, "shared_sites": 2},
        "Indonesia": {"cultural_sites": 6, "natural_sites": 4, "mixed_sites": 0, "total_sites": 10, "shared_sites": 0},
        "Vietnam": {"cultural_sites": 6, "natural_sites": 2, "mixed_sites": 1, "total_sites": 9, "shared_sites": 0},
        "Australia": {"cultural_sites": 5, "natural_sites": 12, "mixed_sites": 4, "total_sites": 21, "shared_sites": 0},
        "Thailand": {"cultural_sites": 5, "natural_sites": 3, "mixed_sites": 0, "total_sites": 8, "shared_sites": 0},
        "Malaysia": {"cultural_sites": 4, "natural_sites": 2, "mixed_sites": 0, "total_sites": 6, "shared_sites": 0},
        "Philippines": {"cultural_sites": 3, "natural_sites": 3, "mixed_sites": 0, "total_sites": 6, "shared_sites": 0},
        "Ireland": {"cultural_sites": 2, "natural_sites": 0, "mixed_sites": 0, "total_sites": 2, "shared_sites": 0},
        "Luxembourg": {"cultural_sites": 1, "natural_sites": 0, "mixed_sites": 0, "total_sites": 1, "shared_sites": 0},
        "Singapore": {"cultural_sites": 1, "natural_sites": 0, "mixed_sites": 0, "total_sites": 1, "shared_sites": 0},
        "Iceland": {"cultural_sites": 1, "natural_sites": 2, "mixed_sites": 0, "total_sites": 3, "shared_sites": 0},
        "New Zealand": {"cultural_sites": 0, "natural_sites": 2, "mixed_sites": 1, "total_sites": 3, "shared_sites": 0}
    }
    
    return unesco_data

def analyze_coverage(our_countries, unesco_data):
    """Analyze UNESCO data coverage for our 40 countries - EXACT VERIFICATION"""
    print("🔍 ANALYZING UNESCO WORLD HERITAGE SITES DATA")
    print("=" * 50)
    print("VERIFIED DATA FROM USER'S PROVIDED TABLE - NO ASSUMPTIONS")
    print()
    
    matches = []
    missing = []
    
    # Check each of our countries EXACTLY
    for our_country, iso3 in our_countries.items():
        if our_country in unesco_data:
            unesco_info = unesco_data[our_country]
            matches.append({
                "country": our_country,
                "iso3": iso3,
                "cultural_sites": unesco_info["cultural_sites"],
                "natural_sites": unesco_info["natural_sites"],
                "mixed_sites": unesco_info["mixed_sites"],
                "total_sites": unesco_info["total_sites"],
                "shared_sites": unesco_info["shared_sites"]
            })
            print(f"✅ {our_country}: {unesco_info['total_sites']} total sites ({unesco_info['cultural_sites']} cultural, {unesco_info['natural_sites']} natural, {unesco_info['mixed_sites']} mixed)")
        else:
            missing.append({
                "country": our_country,
                "iso3": iso3
            })
            print(f"❌ {our_country}: Not found in UNESCO data")
    
    coverage_percent = len(matches) / len(our_countries) * 100
    
    print(f"\n📊 EXACT COVERAGE SUMMARY:")
    print(f"Countries with UNESCO data: {len(matches)}/40 ({coverage_percent:.1f}%)")
    print(f"Countries missing from UNESCO data: {len(missing)}/40")
    
    if missing:
        print(f"\nMISSING COUNTRIES:")
        for miss in missing:
            print(f"  • {miss['country']} ({miss['iso3']})")
    
    return matches, missing, coverage_percent

def create_unesco_indicators(matches):
    """Create potential ranking indicators from UNESCO data - VERIFIED ANALYSIS"""
    print(f"\n🎯 POTENTIAL UNESCO RANKING INDICATORS:")
    print("-" * 40)
    print("ANALYSIS BASED ON VERIFIED DATA ONLY")
    print()
    
    indicators = [
        {
            "name": "Total UNESCO World Heritage Sites",
            "description": "Which country has the most UNESCO World Heritage Sites?",
            "data_field": "total_sites",
            "type": "higher_better"
        },
        {
            "name": "Cultural UNESCO Sites", 
            "description": "Which country has the most UNESCO cultural heritage sites?",
            "data_field": "cultural_sites",
            "type": "higher_better"
        },
        {
            "name": "Natural UNESCO Sites",
            "description": "Which country has the most UNESCO natural heritage sites?", 
            "data_field": "natural_sites",
            "type": "higher_better"
        },
        {
            "name": "Mixed UNESCO Sites",
            "description": "Which country has the most UNESCO mixed heritage sites?",
            "data_field": "mixed_sites", 
            "type": "higher_better"
        }
    ]
    
    # Analyze data ranges for each indicator - EXACT CALCULATIONS
    for indicator in indicators:
        field = indicator["data_field"]
        values = [match[field] for match in matches]
        
        min_val = min(values)
        max_val = max(values)
        avg_val = sum(values) / len(values)
        
        # Count countries with data > 0 - EXACT COUNT
        non_zero = len([v for v in values if v > 0])
        zero_countries = len(matches) - non_zero
        
        print(f"{indicator['name']}:")
        print(f"  Data available: {len(matches)} countries")
        print(f"  Range: {min_val} - {max_val}")
        print(f"  Average: {avg_val:.1f}")
        print(f"  Countries with > 0: {non_zero}/{len(matches)} ({non_zero/len(matches)*100:.1f}%)")
        print(f"  Countries with 0: {zero_countries}")
        
        # EXACT suitability assessment
        coverage_rate = len(matches) / 40 * 100  # Out of our 40 countries
        non_zero_rate = non_zero / len(matches) * 100  # Of countries with data
        
        if coverage_rate >= 90 and non_zero_rate >= 75:
            print(f"  ✅ EXCELLENT for ranking games ({coverage_rate:.0f}% coverage, {non_zero_rate:.0f}% non-zero)")
        elif coverage_rate >= 75 and non_zero_rate >= 50:
            print(f"  ⚠️  GOOD for ranking games ({coverage_rate:.0f}% coverage, {non_zero_rate:.0f}% non-zero)")
        else:
            print(f"  ❌ LIMITED for ranking games ({coverage_rate:.0f}% coverage, {non_zero_rate:.0f}% non-zero)")
        print()
    
    return indicators

def main():
    print("🚀 UNESCO WORLD HERITAGE SITES DATA EXTRACTION - VERIFIED")
    print("Extracting from user's provided table - NO ASSUMPTIONS, ALL VERIFIED")
    print()
    
    # Load our countries
    our_countries = load_our_countries()
    print(f"✅ Loaded {len(our_countries)} countries from our dataset")
    
    # Create UNESCO data from user's table
    unesco_data = create_unesco_data_manually()
    print(f"✅ Manually extracted UNESCO data for {len(unesco_data)} countries")
    print("   SOURCE: User's provided UNESCO World Heritage Sites table")
    print("   DATE: July 2025 (as specified by user)")
    
    # Analyze coverage EXACTLY
    matches, missing, coverage_percent = analyze_coverage(our_countries, unesco_data)
    
    # Create potential indicators
    indicators = create_unesco_indicators(matches)
    
    # Save results with FULL VERIFICATION
    results = {
        "extraction_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "source": "UNESCO World Heritage Sites List (user provided, July 2025)",
        "data_verified": True,
        "verification_method": "Manual extraction from user's table",
        "assumptions_made": "NONE - all data verified",
        "coverage": {
            "total_our_countries": len(our_countries),
            "countries_with_unesco_data": len(matches),
            "countries_missing_unesco_data": len(missing),
            "exact_coverage_percent": coverage_percent
        },
        "countries_with_data": matches,
        "countries_missing_data": missing,
        "potential_indicators": indicators,
        "recommendation": "EXCELLENT data source" if coverage_percent >= 90 else "GOOD data source" if coverage_percent >= 75 else "ADEQUATE data source" if coverage_percent >= 50 else "LIMITED data source"
    }
    
    with open('unesco_heritage_verified.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"📁 Results saved to: unesco_heritage_verified.json")
    
    # EXACT FINAL ASSESSMENT
    print(f"\n🎯 FINAL ASSESSMENT:")
    if coverage_percent >= 90:
        print(f"   ✅ EXCELLENT DATA SOURCE - {coverage_percent:.1f}% coverage")
        print(f"   Recommendation: Use ALL 4 UNESCO indicators")
    elif coverage_percent >= 75:
        print(f"   ⚠️  GOOD DATA SOURCE - {coverage_percent:.1f}% coverage") 
        print(f"   Recommendation: Use 1-2 best UNESCO indicators")
    elif coverage_percent >= 50:
        print(f"   ⚠️  ADEQUATE DATA SOURCE - {coverage_percent:.1f}% coverage")
        print(f"   Recommendation: Use 1 UNESCO indicator (Total Sites)")
    else:
        print(f"   ❌ LIMITED DATA SOURCE - {coverage_percent:.1f}% coverage")
        print(f"   Recommendation: Skip UNESCO data, find alternative")

if __name__ == "__main__":
    main()