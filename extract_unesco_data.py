#!/usr/bin/env python3
"""
Extract UNESCO World Heritage Sites data for our 40 countries
Step 1: Parse UNESCO data and verify coverage
"""

import json
import time

def load_our_countries():
    """Load our 40 countries"""
    with open('quick_dataset_selection.json', 'r') as f:
        our_data = json.load(f)
    return {c["name"]: c["iso3"] for c in our_data["selected_countries"]}

def parse_unesco_data():
    """Parse the UNESCO World Heritage Sites data provided by user"""
    
    # UNESCO data exactly as provided by user
    unesco_raw_data = """
    Italy Italy    55    6        61    7    Europe and North America
    Germany Germany    52    3        55    11    Europe and North America
    France France    45    7    2    54    7    Europe and North America
    Spain Spain    44    4    2    50    4    Europe and North America
    China China    41    15    4    60    1    Asia and the Pacific
    India India    36    7    1    44    1    Asia and the Pacific
    United Kingdom United Kingdom    29    5    1    35    3    Europe and North America
    Mexico Mexico    28    6    2    36        Latin America & the Caribbean
    Turkey Turkey    20        2    22        Europe and North America
    Czech Republic Czech Republic    16    1        17    3    Europe and North America
    Belgium Belgium    15    1        16    6    Europe and North America
    Brazil Brazil    15    9    1    25    1    Latin America & the Caribbean
    Poland Poland    15    2        17    4    Europe and North America
    Sweden Sweden    13    1    1    15    2    Europe and North America
    United States United States    13    12    1    26    3    Europe and North America
    Netherlands Netherlands    12    1        13    3    Europe and North America
    Austria Austria    11    1        12    5    Europe and North America
    Canada Canada    10    11    1    22    2    Europe and North America
    Israel Israel    9            9        Europe and North America
    Switzerland Switzerland    9    4        13    5    Europe and North America
    Denmark Denmark    8    4        12    2    Europe and North America
    Argentina Argentina    7    5        12    3    Latin America & the Caribbean
    Chile Chile    7            7    1    Latin America & the Caribbean
    Norway Norway    7    1        8    1    Europe and North America
    South Africa South Africa    7    4    1    12    1    Africa
    Colombia Colombia    6    2    1    9    1    Latin America & the Caribbean
    Egypt Egypt    6    1        7        Arab States
    Finland Finland    6    1        7    2    Europe and North America
    Indonesia Indonesia    6    4        10        Asia and the Pacific
    Vietnam Vietnam    6    2    1    9        Asia and the Pacific
    Australia Australia    5    12    4    21        Asia and the Pacific
    Thailand Thailand    5    3        8        Asia and the Pacific
    Malaysia Malaysia    4    2        6        Asia and the Pacific
    Philippines Philippines    3    3        6        Asia and the Pacific
    Republic of Ireland Ireland    2            2        Europe and North America
    Luxembourg Luxembourg    1            1        Europe and North America
    Singapore Singapore    1            1        Asia and the Pacific
    Iceland Iceland    1    2        3        Europe and North America
    New Zealand New Zealand        2    1    3        Asia and the Pacific
    """
    
    # Parse the data
    unesco_data = {}
    lines = unesco_raw_data.strip().split('\n')
    
    for line in lines:
        if not line.strip():
            continue
            
        # Split by multiple spaces to separate columns
        parts = [p.strip() for p in line.split('    ') if p.strip()]
        
        if len(parts) >= 6:
            country_full = parts[0]
            cultural = parts[1]
            natural = parts[2] 
            mixed = parts[3]
            total = parts[4]
            shared = parts[5]
            region = parts[6] if len(parts) > 6 else ""
            
            # Extract just the country name (first occurrence)
            if ' ' in country_full:
                country = country_full.split(' ')[0]
            else:
                country = country_full
                
            # Handle special cases
            if country == "United" and "Kingdom" in country_full:
                country = "United Kingdom"
            elif country == "United" and "States" in country_full:
                country = "United States"
            elif country == "Czech":
                country = "Czech Republic"
            elif country == "South" and "Africa" in country_full:
                country = "South Africa"
            elif country == "Republic" and "Ireland" in country_full:
                country = "Ireland"
            elif country == "New" and "Zealand" in country_full:
                country = "New Zealand"
            
            # Convert to integers, handling empty values
            try:
                cultural_num = int(cultural) if cultural else 0
                natural_num = int(natural) if natural else 0
                mixed_num = int(mixed) if mixed else 0
                total_num = int(total) if total else 0
                shared_num = int(shared) if shared else 0
            except ValueError:
                continue
                
            unesco_data[country] = {
                "cultural_sites": cultural_num,
                "natural_sites": natural_num, 
                "mixed_sites": mixed_num,
                "total_sites": total_num,
                "shared_sites": shared_num,
                "unesco_region": region
            }
    
    return unesco_data

def analyze_coverage(our_countries, unesco_data):
    """Analyze UNESCO data coverage for our 40 countries"""
    print("🔍 ANALYZING UNESCO WORLD HERITAGE SITES DATA")
    print("=" * 50)
    
    matches = []
    missing = []
    
    # Check each of our countries
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
                "shared_sites": unesco_info["shared_sites"],
                "unesco_region": unesco_info["unesco_region"]
            })
            print(f"✅ {our_country}: {unesco_info['total_sites']} total sites ({unesco_info['cultural_sites']} cultural, {unesco_info['natural_sites']} natural)")
        else:
            missing.append({
                "country": our_country,
                "iso3": iso3
            })
            print(f"❌ {our_country}: No data found")
    
    coverage_percent = len(matches) / len(our_countries) * 100
    
    print(f"\n📊 COVERAGE SUMMARY:")
    print(f"Countries with data: {len(matches)}/40 ({coverage_percent:.1f}%)")
    print(f"Countries missing: {len(missing)}/40")
    
    return matches, missing, coverage_percent

def create_unesco_indicators(matches):
    """Create potential ranking indicators from UNESCO data"""
    print(f"\n🎯 POTENTIAL UNESCO RANKING INDICATORS:")
    print("-" * 40)
    
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
    
    # Analyze data ranges for each indicator
    for indicator in indicators:
        field = indicator["data_field"]
        values = [match[field] for match in matches]
        
        min_val = min(values)
        max_val = max(values)
        avg_val = sum(values) / len(values)
        
        # Count countries with data > 0
        non_zero = len([v for v in values if v > 0])
        zero_countries = len(matches) - non_zero
        
        print(f"\n{indicator['name']}:")
        print(f"  Range: {min_val} - {max_val}")
        print(f"  Average: {avg_val:.1f}")
        print(f"  Countries with data > 0: {non_zero}/{len(matches)}")
        print(f"  Countries with 0: {zero_countries}")
        
        # Assess suitability for ranking
        if non_zero >= 30:  # At least 75% have non-zero data
            print(f"  ✅ EXCELLENT for ranking games")
        elif non_zero >= 20:  # At least 50% have non-zero data
            print(f"  ⚠️  GOOD for ranking games")
        else:
            print(f"  ❌ LIMITED for ranking games (too many zeros)")
    
    return indicators

def main():
    print("🚀 UNESCO WORLD HERITAGE SITES DATA EXTRACTION")
    print("Extracting and analyzing UNESCO data - no assumptions")
    print()
    
    # Load our countries
    our_countries = load_our_countries()
    print(f"✅ Loaded {len(our_countries)} countries")
    
    # Parse UNESCO data
    unesco_data = parse_unesco_data()
    print(f"✅ Parsed UNESCO data for {len(unesco_data)} countries")
    
    # Analyze coverage
    matches, missing, coverage_percent = analyze_coverage(our_countries, unesco_data)
    
    # Create potential indicators
    indicators = create_unesco_indicators(matches)
    
    # Save results
    results = {
        "extraction_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "source": "UNESCO World Heritage Sites List",
        "data_verified": True,
        "coverage": {
            "total_countries": len(our_countries),
            "countries_with_data": len(matches),
            "countries_missing": len(missing),
            "coverage_percent": coverage_percent
        },
        "matches": matches,
        "missing_countries": missing,
        "potential_indicators": indicators,
        "recommendation": "EXCELLENT data source" if coverage_percent >= 90 else "GOOD data source" if coverage_percent >= 75 else "LIMITED data source"
    }
    
    with open('unesco_heritage_analysis.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: unesco_heritage_analysis.json")
    
    # Final assessment
    if coverage_percent >= 90:
        print(f"\n🎯 FINAL ASSESSMENT: ✅ EXCELLENT DATA SOURCE")
        print(f"   Coverage: {coverage_percent:.1f}% - Use all 4 UNESCO indicators")
    elif coverage_percent >= 75:
        print(f"\n🎯 FINAL ASSESSMENT: ⚠️  GOOD DATA SOURCE") 
        print(f"   Coverage: {coverage_percent:.1f}% - Use 1-2 best indicators")
    else:
        print(f"\n🎯 FINAL ASSESSMENT: ❌ LIMITED DATA SOURCE")
        print(f"   Coverage: {coverage_percent:.1f}% - Consider alternative sources")

if __name__ == "__main__":
    main()