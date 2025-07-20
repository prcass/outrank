#!/usr/bin/env python3
"""
Test different UN Statistics API endpoint formats
Step 5b: Find the correct UN API endpoint structure
"""

import urllib.request
import json
import time

def test_un_endpoint_formats():
    """Test various UN API endpoint formats"""
    print("🔍 TESTING UN STATISTICS API ENDPOINT FORMATS")
    print("=" * 50)
    
    # Try different base URLs and parameter formats
    test_configs = [
        {
            "name": "Original format",
            "base": "https://unstats.un.org/SDGAPI/v1/sdg/Series",
            "format": "{base}/{indicator}/Data?geoAreaCode={country}&timePeriod=2020,2021,2022,2023"
        },
        {
            "name": "Alternative format 1", 
            "base": "https://unstats.un.org/sdgapi/v1/sdg/Series",
            "format": "{base}/{indicator}/Data?geoAreaCode={country}&timePeriod=2020,2021,2022,2023"
        },
        {
            "name": "Alternative format 2",
            "base": "https://unstats.un.org/SDGAPI/v1/sdg/data",
            "format": "{base}?seriesCode={indicator}&geoAreaCode={country}&timePeriod=2020,2021,2022,2023"
        },
        {
            "name": "Alternative format 3",
            "base": "https://unstats.un.org/sdgapi/v1/sdg/data", 
            "format": "{base}?seriesCode={indicator}&areaCode={country}&year=2020,2021,2022,2023"
        },
        {
            "name": "Alternative format 4",
            "base": "https://unstats.un.org/SDGAPI/v1/sdg/GeoArea",
            "format": "{base}?includechildren=false&geoAreaCode={country}"
        }
    ]
    
    # Test with one indicator and one country
    test_indicator = "EG_EGY_CLEAN"
    test_country = "276"  # Germany
    
    working_endpoints = []
    
    for config in test_configs:
        endpoint_name = config["name"] 
        endpoint_url = config["format"].format(
            base=config["base"],
            indicator=test_indicator,
            country=test_country
        )
        
        print(f"\n{endpoint_name}:")
        print(f"  URL: {endpoint_url}")
        
        try:
            with urllib.request.urlopen(endpoint_url, timeout=10) as response:
                if response.status == 200:
                    content = response.read().decode()
                    print(f"  ✅ SUCCESS - Response length: {len(content)} chars")
                    
                    try:
                        data = json.loads(content)
                        if isinstance(data, dict):
                            print(f"  📊 JSON object with keys: {list(data.keys())}")
                            if 'data' in data:
                                print(f"      Data records: {len(data['data'])}")
                        elif isinstance(data, list):
                            print(f"  📊 JSON array with {len(data)} items")
                        
                        working_endpoints.append((endpoint_name, endpoint_url, config))
                        
                    except json.JSONDecodeError:
                        print("  📊 Not JSON format")
                        
                else:
                    print(f"  ❌ HTTP {response.status}")
                    
        except Exception as e:
            print(f"  ❌ ERROR: {e}")
        
        time.sleep(1)
    
    return working_endpoints

def test_un_base_endpoints():
    """Test UN base endpoints to understand API structure"""
    print(f"\n🔍 TESTING UN BASE ENDPOINTS")
    print("-" * 35)
    
    base_endpoints = [
        "https://unstats.un.org/SDGAPI/v1/sdg/",
        "https://unstats.un.org/sdgapi/v1/sdg/",
        "https://unstats.un.org/SDGAPI/v1/",
        "https://unstats.un.org/sdgapi/v1/",
        "https://unstats.un.org/SDGAPI/swagger/",
        "https://unstats.un.org/sdgapi/swagger/"
    ]
    
    working_bases = []
    
    for endpoint in base_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                if response.status == 200:
                    content = response.read().decode()
                    print(f"✅ SUCCESS - Response length: {len(content)} chars")
                    
                    # Check if it's JSON or contains useful info
                    if content.strip().startswith('{'):
                        try:
                            data = json.loads(content)
                            print(f"📊 JSON response with keys: {list(data.keys())}")
                        except:
                            print("📊 JSON parsing failed")
                    elif 'swagger' in content.lower() or 'api' in content.lower():
                        print("📊 API documentation found")
                    elif 'series' in content.lower() or 'data' in content.lower():
                        print("📊 Data-related content found")
                    
                    working_bases.append(endpoint)
                    
                else:
                    print(f"❌ HTTP {response.status}")
                    
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)
    
    return working_bases

def test_known_working_endpoints():
    """Test the endpoints that worked in our previous tests"""
    print(f"\n🔍 TESTING KNOWN WORKING ENDPOINTS")
    print("-" * 40)
    
    known_endpoints = [
        "https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/List",
        "https://unstats.un.org/SDGAPI/v1/sdg/Indicator/List", 
        "https://unstats.un.org/SDGAPI/v1/sdg/Series/List"
    ]
    
    for endpoint in known_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                if response.status == 200:
                    content = response.read().decode()
                    data = json.loads(content)
                    
                    print(f"✅ SUCCESS - {len(data)} items returned")
                    
                    if len(data) > 0:
                        sample = data[0]
                        if isinstance(sample, dict):
                            print(f"    Sample keys: {list(sample.keys())}")
                            
                            # Look for data structure clues
                            if 'code' in sample:
                                print(f"    Sample code: {sample['code']}")
                            if 'uri' in sample:
                                print(f"    Sample URI: {sample['uri']}")
                                
                else:
                    print(f"❌ HTTP {response.status}")
                    
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)

def main():
    print("🚀 TESTING UN STATISTICS API ENDPOINT DISCOVERY")
    print("Finding the correct endpoint format - no assumptions")
    print()
    
    # Test different endpoint formats
    working_endpoints = test_un_endpoint_formats()
    
    # Test base endpoints
    working_bases = test_un_base_endpoints()
    
    # Test known working endpoints
    test_known_working_endpoints()
    
    # Summary
    print(f"\n📊 UN API ENDPOINT DISCOVERY SUMMARY:")
    print("=" * 45)
    
    if working_endpoints:
        print(f"✅ Found {len(working_endpoints)} working data endpoints:")
        for name, url, config in working_endpoints:
            print(f"   • {name}")
            print(f"     Format: {config['format']}")
    else:
        print("❌ No working data endpoints found")
        print("ℹ️  UN API may require different authentication or endpoint structure")
    
    if working_bases:
        print(f"\n✅ Found {len(working_bases)} working base endpoints:")
        for base in working_bases:
            print(f"   • {base}")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "working_data_endpoints": [{"name": name, "url": url, "config": config} for name, url, config in working_endpoints],
        "working_base_endpoints": working_bases,
        "status": "working_endpoints_found" if working_endpoints else "no_data_endpoints_found",
        "next_steps": "Use working endpoints to test data" if working_endpoints else "Research UN API documentation"
    }
    
    with open('un_endpoint_discovery.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: un_endpoint_discovery.json")

if __name__ == "__main__":
    main()