#!/usr/bin/env python3
"""
Explore UN Series URIs to understand correct data endpoint format
Step 5c: Analyze Series List to find data endpoint patterns
"""

import urllib.request
import json
import time

def analyze_series_uris():
    """Analyze URI patterns from UN Series List"""
    print("🔍 ANALYZING UN SERIES URI PATTERNS")
    print("=" * 40)
    
    # Get series list
    try:
        with urllib.request.urlopen("https://unstats.un.org/SDGAPI/v1/sdg/Series/List", timeout=15) as response:
            series_data = json.loads(response.read().decode())
        
        print(f"✅ Retrieved {len(series_data)} series")
        
        # Analyze URI patterns
        uri_patterns = {}
        
        for series in series_data[:20]:  # Look at first 20
            uri = series.get('uri', '')
            code = series.get('code', '')
            description = series.get('description', '')[:50]
            
            print(f"\nSeries: {code}")
            print(f"  URI: {uri}")
            print(f"  Desc: {description}...")
            
            # Track patterns
            if uri:
                pattern = uri.split('/')[-1]  # Get the last part
                if pattern not in uri_patterns:
                    uri_patterns[pattern] = []
                uri_patterns[pattern].append(code)
        
        print(f"\n📊 URI PATTERNS FOUND:")
        for pattern, codes in uri_patterns.items():
            print(f"  Pattern: {pattern}")
            print(f"  Used by: {codes[:3]}..." if len(codes) > 3 else f"  Used by: {codes}")
        
        return series_data
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return []

def test_data_endpoints_from_uris(series_data):
    """Test data endpoints using URI patterns"""
    print(f"\n🔍 TESTING DATA ENDPOINTS FROM URI PATTERNS")
    print("-" * 45)
    
    # Test different data endpoint formats based on URIs
    test_series = series_data[:5]  # Test first 5 series
    test_country = "276"  # Germany
    
    endpoint_formats = [
        "https://unstats.un.org{uri}/Data?geoAreaCode={country}",
        "https://unstats.un.org/SDGAPI{uri}/Data?geoAreaCode={country}", 
        "https://unstats.un.org/SDGAPI/v1/sdg/data/{code}?geoAreaCode={country}",
        "https://unstats.un.org/SDGAPI/v1/sdg/Data?seriesCode={code}&geoAreaCode={country}",
        "https://unstats.un.org/SDGAPI/v1/sdg/{code}/Data?geoAreaCode={country}"
    ]
    
    working_endpoints = []
    
    for series in test_series:
        code = series.get('code', '')
        uri = series.get('uri', '')
        description = series.get('description', '')[:40]
        
        print(f"\n{'='*50}")
        print(f"Testing series: {code}")
        print(f"Description: {description}...")
        print(f"Original URI: {uri}")
        
        for i, format_template in enumerate(endpoint_formats, 1):
            endpoint = format_template.format(uri=uri, code=code, country=test_country)
            print(f"\n  Format {i}: {endpoint}")
            
            try:
                with urllib.request.urlopen(endpoint, timeout=10) as response:
                    if response.status == 200:
                        content = response.read().decode()
                        print(f"    ✅ SUCCESS - Response length: {len(content)} chars")
                        
                        try:
                            data = json.loads(content)
                            if isinstance(data, dict):
                                print(f"    📊 JSON object with keys: {list(data.keys())}")
                                if 'data' in data:
                                    print(f"        Data records: {len(data['data'])}")
                            elif isinstance(data, list):
                                print(f"    📊 JSON array with {len(data)} items")
                            
                            working_endpoints.append({
                                "series_code": code,
                                "endpoint": endpoint, 
                                "format": format_template,
                                "response_length": len(content)
                            })
                            
                        except json.JSONDecodeError:
                            print("    📊 Not JSON format")
                            
                    else:
                        print(f"    ❌ HTTP {response.status}")
                        
            except Exception as e:
                print(f"    ❌ ERROR: {e}")
            
            time.sleep(0.5)
    
    return working_endpoints

def test_alternative_approaches():
    """Test alternative approaches for UN data"""
    print(f"\n🔍 TESTING ALTERNATIVE UN DATA APPROACHES")
    print("-" * 45)
    
    alternative_endpoints = [
        "https://unstats.un.org/SDGAPI/v1/sdg/Goal/List",
        "https://unstats.un.org/SDGAPI/v1/sdg/Target/List",
        "https://unstats.un.org/SDGAPI/v1/sdg/DataAvailability/CountriesBySeries/EG_EGY_CLEAN",
        "https://unstats.un.org/SDGAPI/v1/sdg/Series/EG_EGY_CLEAN",
        "https://unstats.un.org/SDGAPI/v1/sdg/Series/EG_EGY_CLEAN/DataAvailability"
    ]
    
    working_alternatives = []
    
    for endpoint in alternative_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            with urllib.request.urlopen(endpoint, timeout=10) as response:
                if response.status == 200:
                    content = response.read().decode()
                    print(f"✅ SUCCESS - Response length: {len(content)} chars")
                    
                    try:
                        data = json.loads(content)
                        if isinstance(data, dict):
                            print(f"📊 JSON object with keys: {list(data.keys())}")
                        elif isinstance(data, list):
                            print(f"📊 JSON array with {len(data)} items")
                        
                        working_alternatives.append(endpoint)
                        
                    except json.JSONDecodeError:
                        print("📊 Not JSON format")
                        
                else:
                    print(f"❌ HTTP {response.status}")
                    
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)
    
    return working_alternatives

def main():
    print("🚀 EXPLORING UN SERIES URIS AND DATA ENDPOINTS")
    print("Analyzing Series List to find correct data endpoint format")
    print()
    
    # Analyze series URIs
    series_data = analyze_series_uris()
    
    if not series_data:
        print("❌ Cannot proceed without series data")
        return
    
    # Test data endpoints based on URI patterns
    working_endpoints = test_data_endpoints_from_uris(series_data)
    
    # Test alternative approaches
    working_alternatives = test_alternative_approaches()
    
    # Summary
    print(f"\n📊 UN DATA ENDPOINT EXPLORATION SUMMARY:")
    print("=" * 50)
    
    if working_endpoints:
        print(f"✅ Found {len(working_endpoints)} working data endpoints:")
        for endpoint_info in working_endpoints:
            print(f"   • Series: {endpoint_info['series_code']}")
            print(f"     Format: {endpoint_info['format']}")
            print(f"     Response: {endpoint_info['response_length']} chars")
    else:
        print("❌ No working data endpoints found")
    
    if working_alternatives:
        print(f"\n✅ Found {len(working_alternatives)} working alternative endpoints:")
        for alt in working_alternatives:
            print(f"   • {alt}")
    
    # Recommendation
    if working_endpoints:
        print(f"\n🎯 RECOMMENDATION: Use working data endpoints to test country coverage")
    elif working_alternatives:
        print(f"\n🎯 RECOMMENDATION: Explore alternative endpoints for data access")
    else:
        print(f"\n⚠️  RECOMMENDATION: UN API may require authentication or different approach")
        print("    Consider static data downloads or web scraping")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "series_analyzed": len(series_data),
        "working_data_endpoints": working_endpoints,
        "working_alternatives": working_alternatives,
        "status": "endpoints_found" if working_endpoints else "no_data_access_found",
        "next_steps": "Test country coverage" if working_endpoints else "Research alternative approaches"
    }
    
    with open('un_series_exploration.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: un_series_exploration.json")

if __name__ == "__main__":
    main()