#!/usr/bin/env python3
"""
Test UN Statistics API for our specific 40 countries
Check which of our countries are available in UN data
"""

import urllib.request
import json
import time

def get_un_countries():
    """Get the actual list of countries from UN Statistics API"""
    print("📍 GETTING UN COUNTRY LIST")
    print("-" * 30)
    
    try:
        url = "https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List"
        with urllib.request.urlopen(url, timeout=15) as response:
            countries = json.loads(response.read().decode())
        
        print(f"✅ Retrieved {len(countries)} geographic areas from UN")
        return countries
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return []

def get_un_indicators():
    """Get available indicators from UN Statistics"""
    print("\n📊 GETTING UN INDICATORS LIST")
    print("-" * 30)
    
    try:
        url = "https://unstats.un.org/SDGAPI/v1/sdg/Series/List"
        with urllib.request.urlopen(url, timeout=15) as response:
            indicators = json.loads(response.read().decode())
        
        print(f"✅ Retrieved {len(indicators)} indicators from UN")
        return indicators
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return []

def check_our_countries_in_un(un_countries):
    """Check which of our 40 countries are available in UN data"""
    print("\n🔍 CHECKING OUR 40 COUNTRIES IN UN DATA")
    print("-" * 45)
    
    # Load our 40 countries
    with open('quick_dataset_selection.json', 'r') as f:
        our_data = json.load(f)
    
    our_countries = {c["name"]: c["iso3"] for c in our_data["selected_countries"]}
    
    # Create mapping of UN country names to codes
    un_country_map = {country["geoAreaName"]: country["geoAreaCode"] for country in un_countries}
    
    print(f"Our countries: {len(our_countries)}")
    print(f"UN countries: {len(un_country_map)}")
    print()
    
    # Check matches
    matches = []
    close_matches = []
    missing = []
    
    for our_name, our_iso3 in our_countries.items():
        if our_name in un_country_map:
            matches.append((our_name, our_iso3, un_country_map[our_name]))
            print(f"✅ {our_name} ({our_iso3}) -> UN:{un_country_map[our_name]}")
        else:
            # Look for close matches
            close_match = None
            for un_name in un_country_map.keys():
                if our_name.lower() in un_name.lower() or un_name.lower() in our_name.lower():
                    close_match = un_name
                    break
            
            if close_match:
                close_matches.append((our_name, our_iso3, close_match, un_country_map[close_match]))
                print(f"⚠️  {our_name} ({our_iso3}) -> Close match: {close_match} (UN:{un_country_map[close_match]})")
            else:
                missing.append((our_name, our_iso3))
                print(f"❌ {our_name} ({our_iso3}) -> Not found")
    
    return matches, close_matches, missing

def analyze_interesting_indicators(indicators):
    """Find interesting indicators for ranking games"""
    print(f"\n🎯 ANALYZING {len(indicators)} UN INDICATORS FOR GAME POTENTIAL")
    print("-" * 60)
    
    interesting_keywords = [
        'happiness', 'well-being', 'satisfaction', 'quality of life',
        'corruption', 'transparency', 'governance',
        'freedom', 'democracy', 'rights',
        'innovation', 'technology', 'research',
        'tourism', 'travel', 'cultural',
        'food', 'nutrition', 'hunger',
        'gender', 'equality', 'women',
        'environment', 'pollution', 'climate',
        'energy', 'renewable', 'electricity',
        'urban', 'cities', 'infrastructure'
    ]
    
    interesting_indicators = []
    
    for indicator in indicators:
        description = indicator.get('description', '').lower()
        title = indicator.get('title', '').lower()
        series = str(indicator).lower()
        
        for keyword in interesting_keywords:
            if keyword in description or keyword in title or keyword in series:
                interesting_indicators.append({
                    'indicator': indicator,
                    'keyword_match': keyword,
                    'description': indicator.get('description', ''),
                    'code': indicator.get('code', '')
                })
                break
    
    print(f"Found {len(interesting_indicators)} potentially interesting indicators")
    
    # Show top 10
    for i, item in enumerate(interesting_indicators[:10], 1):
        print(f"{i:2d}. {item['description'][:80]}...")
        print(f"    Match: {item['keyword_match']}")
        print(f"    Code: {item['code']}")
        print()
    
    return interesting_indicators

def main():
    print("🔍 TESTING UN STATISTICS COVERAGE FOR OUR 40 COUNTRIES")
    print("=" * 65)
    
    # Get UN countries list
    un_countries = get_un_countries()
    if not un_countries:
        print("❌ Cannot proceed - failed to get UN countries")
        return
    
    # Get UN indicators
    un_indicators = get_un_indicators()
    if not un_indicators:
        print("❌ Cannot proceed - failed to get UN indicators")
        return
    
    # Check our countries
    matches, close_matches, missing = check_our_countries_in_un(un_countries)
    
    # Analyze indicators
    interesting = analyze_interesting_indicators(un_indicators)
    
    # Summary
    print(f"\n📊 COVERAGE SUMMARY:")
    print(f"Direct matches: {len(matches)}/40 ({len(matches)/40*100:.0f}%)")
    print(f"Close matches: {len(close_matches)}/40 ({len(close_matches)/40*100:.0f}%)")
    print(f"Missing: {len(missing)}/40 ({len(missing)/40*100:.0f}%)")
    print(f"Total covered: {(len(matches) + len(close_matches))/40*100:.0f}%")
    print(f"Interesting indicators found: {len(interesting)}")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "source": "UN Statistics Division",
        "coverage_summary": {
            "total_our_countries": 40,
            "direct_matches": len(matches),
            "close_matches": len(close_matches), 
            "missing": len(missing),
            "coverage_percent": (len(matches) + len(close_matches))/40*100
        },
        "matches": matches,
        "close_matches": close_matches,
        "missing": missing,
        "interesting_indicators_count": len(interesting),
        "top_10_interesting": interesting[:10]
    }
    
    with open('un_country_coverage_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: un_country_coverage_results.json")
    
    if len(matches) + len(close_matches) >= 35:  # 87.5% coverage
        print(f"✅ Good UN coverage - proceed to test actual data availability")
    else:
        print(f"⚠️  Limited UN coverage - may need different source")

if __name__ == "__main__":
    main()