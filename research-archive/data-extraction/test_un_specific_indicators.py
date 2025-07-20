#!/usr/bin/env python3
"""
Test specific UN Statistics indicators for our 40 countries
Step 5: Test actual data availability for UN indicators
"""

import urllib.request
import json
import time

def load_our_countries():
    """Load our 40 countries and UN mappings"""
    with open('quick_dataset_selection.json', 'r') as f:
        our_data = json.load(f)
    our_countries = {c["name"]: c["iso3"] for c in our_data["selected_countries"]}
    
    # Load UN country mappings from previous test
    with open('un_country_coverage_results.json', 'r') as f:
        un_results = json.load(f)
    
    # Create mapping from our country names to UN codes
    un_mapping = {}
    
    # Direct matches
    for match in un_results["matches"]:
        our_name, our_iso3, un_code = match
        un_mapping[our_name] = un_code
    
    # Close matches
    for close_match in un_results["close_matches"]:
        our_name, our_iso3, un_name, un_code = close_match
        un_mapping[our_name] = un_code
    
    return our_countries, un_mapping

def test_un_indicator_data(indicator_code, countries_mapping, max_countries=5):
    """Test actual data availability for a specific UN indicator"""
    print(f"\n🔍 Testing indicator: {indicator_code}")
    
    available_countries = []
    missing_countries = []
    
    # Test subset of countries to avoid long delays
    test_countries = list(countries_mapping.items())[:max_countries]
    
    for our_name, un_code in test_countries:
        try:
            # UN Statistics API endpoint for specific data
            url = f"https://unstats.un.org/SDGAPI/v1/sdg/Series/{indicator_code}/Data"
            params = f"?geoAreaCode={un_code}&timePeriod=2020,2021,2022,2023,2024"
            
            full_url = url + params
            
            with urllib.request.urlopen(full_url, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    
                    # Check if we have actual data values
                    if 'data' in data and len(data['data']) > 0:
                        has_value = False
                        for record in data['data']:
                            if 'value' in record and record['value'] is not None:
                                has_value = True
                                break
                        
                        if has_value:
                            available_countries.append((our_name, un_code))
                            print(f"  ✅ {our_name}")
                        else:
                            missing_countries.append((our_name, un_code, "no_values"))
                            print(f"  ⚠️  {our_name} (structure but no values)")
                    else:
                        missing_countries.append((our_name, un_code, "no_data"))
                        print(f"  ❌ {our_name} (no data)")
                else:
                    missing_countries.append((our_name, un_code, f"http_{response.status}"))
                    print(f"  ❌ {our_name} (HTTP {response.status})")
                    
        except Exception as e:
            missing_countries.append((our_name, un_code, str(e)))
            print(f"  ❌ {our_name} (ERROR: {e})")
        
        time.sleep(0.5)  # Rate limiting
    
    coverage = len(available_countries) / len(test_countries) * 100
    print(f"  📊 Coverage: {len(available_countries)}/{len(test_countries)} ({coverage:.0f}%)")
    
    return available_countries, missing_countries, coverage

def main():
    print("🚀 TESTING UN STATISTICS SPECIFIC INDICATORS")
    print("Testing actual data availability for our 40 countries")
    print()
    
    # Load country mappings
    our_countries, un_mapping = load_our_countries()
    print(f"✅ Loaded {len(our_countries)} countries with {len(un_mapping)} UN mappings")
    
    # Load interesting indicators from previous test
    with open('un_country_coverage_results.json', 'r') as f:
        un_results = json.load(f)
    
    interesting_indicators = un_results["top_10_interesting"]
    print(f"✅ Testing {len(interesting_indicators)} interesting indicators")
    
    # Test each indicator
    results = {}
    
    for i, indicator_info in enumerate(interesting_indicators, 1):
        indicator_code = indicator_info["code"]
        description = indicator_info["description"]
        
        print(f"\n{'='*60}")
        print(f"INDICATOR {i}: {indicator_code}")
        print(f"Description: {description[:80]}...")
        
        available, missing, coverage = test_un_indicator_data(
            indicator_code, 
            un_mapping,
            max_countries=10  # Test first 10 countries for speed
        )
        
        results[indicator_code] = {
            "description": description,
            "available_countries": available,
            "missing_countries": missing,
            "coverage_percent": coverage,
            "tested_countries": len(available) + len(missing)
        }
        
        # Quick assessment
        if coverage >= 80:
            print(f"  🎯 HIGH COVERAGE - Good for ranking games")
        elif coverage >= 60:
            print(f"  ⚠️  MEDIUM COVERAGE - Usable but limited")
        else:
            print(f"  ❌ LOW COVERAGE - Not suitable")
    
    # Summary
    print(f"\n📊 UN STATISTICS INDICATOR TEST SUMMARY:")
    print("=" * 55)
    
    high_coverage = [code for code, data in results.items() if data["coverage_percent"] >= 80]
    medium_coverage = [code for code, data in results.items() if 60 <= data["coverage_percent"] < 80]
    low_coverage = [code for code, data in results.items() if data["coverage_percent"] < 60]
    
    print(f"High coverage (≥80%): {len(high_coverage)} indicators")
    print(f"Medium coverage (60-79%): {len(medium_coverage)} indicators")
    print(f"Low coverage (<60%): {len(low_coverage)} indicators")
    
    if high_coverage:
        print(f"\n✅ BEST UN INDICATORS FOR RANKING GAMES:")
        for code in high_coverage:
            desc = results[code]["description"][:60]
            coverage = results[code]["coverage_percent"]
            print(f"   • {code}: {desc}... ({coverage:.0f}%)")
    
    # Save results
    final_results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "source": "UN Statistics Division - Specific Indicator Testing",
        "countries_tested": len(un_mapping),
        "indicators_tested": len(interesting_indicators),
        "results": results,
        "summary": {
            "high_coverage": high_coverage,
            "medium_coverage": medium_coverage, 
            "low_coverage": low_coverage
        },
        "recommendation": "Focus on high coverage indicators" if high_coverage else "Need broader testing"
    }
    
    with open('un_specific_indicators_test.json', 'w') as f:
        json.dump(final_results, f, indent=2)
    
    print(f"\n📁 Results saved to: un_specific_indicators_test.json")

if __name__ == "__main__":
    main()