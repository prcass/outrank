#!/usr/bin/env python3
"""
Test OECD Data API for country coverage and available indicators
Step 2: Test OECD API accessibility and data
"""

import urllib.request
import json
import time

def test_oecd_api_access():
    """Test basic OECD API accessibility"""
    print("🔍 TESTING OECD DATA API ACCESS")
    print("=" * 40)
    
    # Test OECD API endpoints
    test_endpoints = [
        "https://stats.oecd.org/SDMX-JSON/data/",
        "https://stats.oecd.org/restsdmx/sdmx.ashx/GetDataStructure/all",
        "https://sdmx.oecd.org/public/rest/data/",
        "https://stats.oecd.org/restsdmx/sdmx.ashx/GetKeyFamily/all"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                content = response.read().decode()
                print(f"✅ SUCCESS - Response length: {len(content)} chars")
                working_endpoints.append(endpoint)
                
                # Check if it's JSON or XML
                if content.strip().startswith('{'):
                    print("📊 Response format: JSON")
                elif content.strip().startswith('<'):
                    print("📊 Response format: XML")
                else:
                    print("📊 Response format: Other")
                    
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)
    
    return working_endpoints

def test_oecd_countries():
    """Test OECD country list and check our 40 countries"""
    print(f"\n🌍 TESTING OECD COUNTRY COVERAGE")
    print("-" * 35)
    
    # Try to get OECD country list
    country_endpoints = [
        "https://stats.oecd.org/SDMX-JSON/data/OECD.SDD.NAD,DSD_NAMAIN1@DF_TABLE1,1.0/",
        "https://sdmx.oecd.org/public/rest/codelist/OECD/CL_OECD_AREA"
    ]
    
    for endpoint in country_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=15) as response:
                content = response.read().decode()
                print(f"✅ SUCCESS - Got response")
                
                # Try to parse and find country information
                if content.strip().startswith('{'):
                    try:
                        data = json.loads(content)
                        print("📊 JSON response - checking for country data...")
                        
                        # Look for country-related keys
                        def find_countries_in_json(obj, path=""):
                            if isinstance(obj, dict):
                                for key, value in obj.items():
                                    if 'country' in key.lower() or 'area' in key.lower() or 'geo' in key.lower():
                                        print(f"  Found potential country data at: {path}.{key}")
                                    find_countries_in_json(value, f"{path}.{key}")
                            elif isinstance(obj, list) and len(obj) > 0:
                                find_countries_in_json(obj[0], f"{path}[0]")
                        
                        find_countries_in_json(data)
                        
                    except json.JSONDecodeError:
                        print("❌ Not valid JSON")
                
                elif content.strip().startswith('<'):
                    print("📊 XML response - checking structure...")
                    
                    # Look for country-related XML tags
                    country_indicators = ['country', 'area', 'geo', 'member']
                    for indicator in country_indicators:
                        if indicator.lower() in content.lower():
                            print(f"  Found '{indicator}' in XML content")
                
                break  # If we got a response, don't try other endpoints
                
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)

def check_oecd_indicators():
    """Try to find OECD indicators that might be interesting"""
    print(f"\n📊 CHECKING OECD INDICATORS")
    print("-" * 30)
    
    # OECD has specific well-known datasets we can test
    known_datasets = [
        ("Better Life Index", "BLI"),
        ("Economic Outlook", "EO"), 
        ("Education at a Glance", "EAG"),
        ("Health Statistics", "HEALTH"),
        ("Society at a Glance", "SOCX"),
        ("Government at a Glance", "GOV"),
        ("Entrepreneurship at a Glance", "ENTREPRENEUR")
    ]
    
    print("Testing known OECD datasets:")
    for name, code in known_datasets:
        print(f"  • {name} ({code})")
    
    print(f"\nTrying to access OECD Better Life Index (most relevant for rankings)...")
    
    # Try Better Life Index endpoint
    bli_endpoints = [
        "https://stats.oecd.org/SDMX-JSON/data/BLI",
        "https://stats.oecd.org/restsdmx/sdmx.ashx/GetData/BLI"
    ]
    
    for endpoint in bli_endpoints:
        print(f"\nTesting BLI: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=15) as response:
                content = response.read().decode()
                print(f"✅ Better Life Index accessible - {len(content)} chars")
                
                # This would contain happiness, life satisfaction, etc.
                if 'satisfaction' in content.lower() or 'happiness' in content.lower():
                    print("🎯 Contains happiness/satisfaction data!")
                
                break
                
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)

def main():
    print("🚀 TESTING OECD DATA API")
    print("Checking real OECD endpoints - no assumptions")
    print()
    
    # Test basic API access
    working_endpoints = test_oecd_api_access()
    
    # Test country coverage
    test_oecd_countries()
    
    # Check for interesting indicators
    check_oecd_indicators()
    
    # Summary
    print(f"\n📊 OECD API TEST SUMMARY:")
    print(f"Working endpoints: {len(working_endpoints)}")
    
    if working_endpoints:
        print("✅ OECD API is accessible")
        print("📋 Known valuable OECD datasets:")
        print("   • Better Life Index (happiness, life satisfaction)")
        print("   • Economic indicators")
        print("   • Education metrics") 
        print("   • Health statistics")
        print("   • Social indicators")
    else:
        print("❌ OECD API not accessible with tested endpoints")
        print("ℹ️  OECD may require specific query parameters or different approach")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "api_source": "OECD",
        "working_endpoints": working_endpoints,
        "accessibility": len(working_endpoints) > 0,
        "potential_datasets": [
            "Better Life Index (happiness, life satisfaction)",
            "Economic Outlook (growth, employment)",
            "Education at a Glance (education metrics)",
            "Health Statistics (health indicators)",
            "Society at a Glance (social metrics)"
        ],
        "next_steps": "Test specific datasets" if working_endpoints else "Try alternative OECD access methods"
    }
    
    with open('oecd_api_test.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: oecd_api_test.json")

if __name__ == "__main__":
    main()