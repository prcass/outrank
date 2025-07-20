#!/usr/bin/env python3
"""
Test WHO Global Health Observatory API
Step 3: Test WHO API for health indicators and country coverage
"""

import urllib.request
import json
import time

def test_who_api_access():
    """Test WHO Global Health Observatory API endpoints"""
    print("🔍 TESTING WHO GLOBAL HEALTH OBSERVATORY API")
    print("=" * 50)
    
    # WHO GHO API endpoints to test
    test_endpoints = [
        "https://ghoapi.azureedge.net/api/",
        "https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY",
        "https://ghoapi.azureedge.net/api/DIMENSION/GHO", 
        "https://ghoapi.azureedge.net/api/Indicator"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                if response.status == 200:
                    content = response.read().decode()
                    print(f"✅ SUCCESS - Response length: {len(content)} chars")
                    working_endpoints.append(endpoint)
                    
                    # Try to parse JSON
                    try:
                        data = json.loads(content)
                        if isinstance(data, dict):
                            print(f"📊 JSON object with keys: {list(data.keys())}")
                        elif isinstance(data, list):
                            print(f"📊 JSON array with {len(data)} items")
                            if len(data) > 0:
                                sample = data[0]
                                if isinstance(sample, dict):
                                    print(f"    Sample keys: {list(sample.keys())}")
                    except json.JSONDecodeError:
                        print("📊 Not JSON format")
                        
                else:
                    print(f"❌ HTTP {response.status}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)
    
    return working_endpoints

def test_who_countries():
    """Test WHO country coverage for our 40 countries"""
    print(f"\n🌍 TESTING WHO COUNTRY COVERAGE")
    print("-" * 35)
    
    try:
        # Get WHO country list
        url = "https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY"
        with urllib.request.urlopen(url, timeout=15) as response:
            who_countries = json.loads(response.read().decode())
        
        print(f"✅ Retrieved {len(who_countries)} countries/regions from WHO")
        
        # Load our 40 countries
        with open('quick_dataset_selection.json', 'r') as f:
            our_data = json.load(f)
        our_countries = {c["name"]: c["iso3"] for c in our_data["selected_countries"]}
        
        # Check matches
        print(f"\nChecking our 40 countries against WHO data:")
        
        matches = []
        close_matches = []
        missing = []
        
        # Create WHO country mapping
        who_country_map = {}
        for country in who_countries:
            if isinstance(country, dict):
                # WHO countries have different possible key names
                title = country.get('Title', country.get('title', country.get('name', '')))
                code = country.get('Code', country.get('code', ''))
                who_country_map[title] = code
        
        print(f"WHO countries mapped: {len(who_country_map)}")
        
        for our_name, our_iso3 in our_countries.items():
            if our_name in who_country_map:
                matches.append((our_name, our_iso3, who_country_map[our_name]))
                print(f"✅ {our_name} ({our_iso3}) -> WHO:{who_country_map[our_name]}")
            else:
                # Look for close matches
                close_match = None
                for who_name in who_country_map.keys():
                    if our_name.lower() in who_name.lower() or who_name.lower() in our_name.lower():
                        close_match = who_name
                        break
                
                if close_match:
                    close_matches.append((our_name, our_iso3, close_match, who_country_map[close_match]))
                    print(f"⚠️  {our_name} ({our_iso3}) -> Close: {close_match} (WHO:{who_country_map[close_match]})")
                else:
                    missing.append((our_name, our_iso3))
                    print(f"❌ {our_name} ({our_iso3}) -> Not found")
        
        return matches, close_matches, missing, who_country_map
        
    except Exception as e:
        print(f"❌ ERROR getting WHO countries: {e}")
        return [], [], [], {}

def test_who_indicators():
    """Test WHO indicators for interesting health metrics"""
    print(f"\n📊 TESTING WHO HEALTH INDICATORS")
    print("-" * 35)
    
    try:
        # Get WHO indicators
        url = "https://ghoapi.azureedge.net/api/DIMENSION/GHO"
        with urllib.request.urlopen(url, timeout=15) as response:
            who_indicators = json.loads(response.read().decode())
        
        print(f"✅ Retrieved {len(who_indicators)} WHO indicators")
        
        # Find interesting health indicators for ranking
        interesting_keywords = [
            'life expectancy', 'mortality', 'death',
            'obesity', 'overweight', 'nutrition',
            'alcohol', 'tobacco', 'smoking',
            'mental health', 'depression', 'suicide',
            'vaccination', 'immunization',
            'doctors', 'physicians', 'nurses',
            'hospital', 'health expenditure',
            'malaria', 'tuberculosis', 'hiv',
            'maternal', 'infant', 'child'
        ]
        
        interesting_indicators = []
        
        for indicator in who_indicators:
            if isinstance(indicator, dict):
                title = indicator.get('Title', indicator.get('title', ''))
                code = indicator.get('Code', indicator.get('code', ''))
                
                for keyword in interesting_keywords:
                    if keyword.lower() in title.lower():
                        interesting_indicators.append({
                            'title': title,
                            'code': code,
                            'keyword_match': keyword
                        })
                        break
        
        print(f"Found {len(interesting_indicators)} potentially interesting health indicators")
        
        # Show top 10
        for i, indicator in enumerate(interesting_indicators[:10], 1):
            print(f"{i:2d}. {indicator['title'][:70]}...")
            print(f"    Code: {indicator['code']}")
            print(f"    Match: {indicator['keyword_match']}")
            print()
        
        return interesting_indicators
        
    except Exception as e:
        print(f"❌ ERROR getting WHO indicators: {e}")
        return []

def main():
    print("🚀 TESTING WHO GLOBAL HEALTH OBSERVATORY API")
    print("Testing real WHO endpoints - no assumptions")
    print()
    
    # Test basic API access
    working_endpoints = test_who_api_access()
    
    if not working_endpoints:
        print("❌ WHO API not accessible - cannot proceed")
        return
    
    # Test country coverage
    matches, close_matches, missing, who_countries = test_who_countries()
    
    # Test indicators
    interesting_indicators = test_who_indicators()
    
    # Summary
    print(f"\n📊 WHO API TEST SUMMARY:")
    print(f"Working endpoints: {len(working_endpoints)}")
    print(f"Country coverage: {len(matches) + len(close_matches)}/40 ({(len(matches) + len(close_matches))/40*100:.0f}%)")
    print(f"Direct matches: {len(matches)}")
    print(f"Close matches: {len(close_matches)}")
    print(f"Missing: {len(missing)}")
    print(f"Interesting indicators: {len(interesting_indicators)}")
    
    if len(matches) + len(close_matches) >= 35:  # 87.5% coverage
        print("✅ Good WHO coverage for health indicators")
    else:
        print("⚠️  Limited WHO coverage")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "api_source": "WHO Global Health Observatory",
        "working_endpoints": working_endpoints,
        "accessibility": len(working_endpoints) > 0,
        "country_coverage": {
            "total_our_countries": 40,
            "direct_matches": len(matches),
            "close_matches": len(close_matches),
            "missing": len(missing),
            "coverage_percent": (len(matches) + len(close_matches))/40*100
        },
        "matches": matches,
        "close_matches": close_matches,
        "missing": missing,
        "interesting_indicators_count": len(interesting_indicators),
        "top_10_indicators": interesting_indicators[:10] if interesting_indicators else []
    }
    
    with open('who_api_test.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: who_api_test.json")

if __name__ == "__main__":
    main()