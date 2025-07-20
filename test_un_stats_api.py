#!/usr/bin/env python3
"""
Test UN Statistics Division API for available indicators
Step 1: Discover what data sources and indicators are actually available
NO ASSUMPTIONS - only test what exists
"""

import urllib.request
import json
import time

def test_un_stats_api():
    """Test if UN Statistics API is accessible and what it provides"""
    print("🔍 TESTING UN STATISTICS DIVISION API")
    print("=" * 50)
    
    # Try different UN Statistics endpoints
    test_endpoints = [
        "https://unstats.un.org/SDGAPI/v1/sdg/Goal/List",
        "https://unstats.un.org/SDGAPI/v1/sdg/Indicator/List", 
        "https://unstats.un.org/SDGAPI/v1/sdg/Target/List",
        "https://unstats.un.org/sdgapi/v1/sdg/GeoArea/List"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    print(f"✅ SUCCESS - Got {len(data)} items")
                    working_endpoints.append(endpoint)
                    
                    # Show sample of what we got
                    if data and len(data) > 0:
                        sample = data[0]
                        print(f"Sample item keys: {list(sample.keys())}")
                else:
                    print(f"❌ HTTP {response.status}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)  # Rate limiting
    
    return working_endpoints

def test_un_country_data():
    """Test if we can get actual country data from UN"""
    print(f"\n🌍 TESTING UN COUNTRY DATA ACCESS")
    print("-" * 40)
    
    # Test endpoints for country data
    country_endpoints = [
        "https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List",
        "https://unstats.un.org/SDGAPI/v1/sdg/Series/List"
    ]
    
    for endpoint in country_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                data = json.loads(response.read().decode())
                print(f"✅ Got {len(data)} items")
                
                # Look for our 40 countries in the data
                if data and len(data) > 0:
                    # Check if this looks like country data
                    sample = data[0]
                    if 'geoAreaName' in sample or 'country' in str(sample).lower():
                        print("🌍 This appears to contain country information")
                        
                        # Show a few country names if available
                        for item in data[:5]:
                            if 'geoAreaName' in item:
                                print(f"  - {item['geoAreaName']}")
                    
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)

def main():
    print("🚀 STARTING UN STATISTICS API TESTING")
    print("Testing actual API endpoints - no assumptions")
    print()
    
    # Test basic API access
    working_endpoints = test_un_stats_api()
    
    # Test country data access
    test_un_country_data()
    
    # Summary
    print(f"\n📊 SUMMARY:")
    print(f"Working endpoints found: {len(working_endpoints)}")
    
    if working_endpoints:
        print("✅ UN Statistics API is accessible")
        print("Next: Test specific indicator data for our 40 countries")
    else:
        print("❌ UN Statistics API not accessible or no working endpoints")
        print("Need to try different approach or different UN data sources")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "api_source": "UN Statistics Division",
        "working_endpoints": working_endpoints,
        "accessibility": len(working_endpoints) > 0,
        "next_steps": "Test specific indicators if accessible" if working_endpoints else "Try alternative UN data sources"
    }
    
    with open('un_stats_api_test.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: un_stats_api_test.json")

if __name__ == "__main__":
    main()