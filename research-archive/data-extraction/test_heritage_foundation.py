#!/usr/bin/env python3
"""
Test Heritage Foundation Economic Freedom data
Step 4: Test Heritage Foundation for economic freedom indicators
"""

import urllib.request
import json
import time

def test_heritage_foundation_access():
    """Test Heritage Foundation data accessibility"""
    print("🔍 TESTING HERITAGE FOUNDATION ECONOMIC FREEDOM DATA")
    print("=" * 55)
    
    # Heritage Foundation endpoints to test
    test_endpoints = [
        "https://www.heritage.org/index/api/explore/countries",
        "https://www.heritage.org/index/api/countries",
        "https://api.heritage.org/index/countries",
        "https://www.heritage.org/api/index/countries"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            request = urllib.request.Request(endpoint)
            request.add_header('User-Agent', 'Mozilla/5.0 (Research Project)')
            
            with urllib.request.urlopen(request, timeout=15) as response:
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
        
        time.sleep(2)
    
    return working_endpoints

def test_transparency_international():
    """Test Transparency International Corruption Perceptions Index"""
    print(f"\n🔍 TESTING TRANSPARENCY INTERNATIONAL CPI")
    print("-" * 45)
    
    # Transparency International endpoints
    test_endpoints = [
        "https://www.transparency.org/api/cpi/latest",
        "https://api.transparency.org/cpi/2023",
        "https://www.transparency.org/cpi/api/2023",
        "https://images.transparencycdn.org/images/CPI2023_GlobalResults.csv"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            request = urllib.request.Request(endpoint)
            request.add_header('User-Agent', 'Mozilla/5.0 (Research Project)')
            
            with urllib.request.urlopen(request, timeout=15) as response:
                if response.status == 200:
                    content = response.read().decode()
                    print(f"✅ SUCCESS - Response length: {len(content)} chars")
                    working_endpoints.append(endpoint)
                    
                    # Check content type
                    if content.strip().startswith('{'):
                        print("📊 Response format: JSON")
                    elif ',' in content and '\n' in content:
                        print("📊 Response format: CSV")
                        # Count rows
                        rows = content.strip().split('\n')
                        print(f"    CSV has {len(rows)} rows")
                    else:
                        print("📊 Response format: Other")
                        
                else:
                    print(f"❌ HTTP {response.status}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(2)
    
    return working_endpoints

def test_freedom_house():
    """Test Freedom House democracy scores"""
    print(f"\n🔍 TESTING FREEDOM HOUSE DEMOCRACY DATA")
    print("-" * 40)
    
    # Freedom House endpoints
    test_endpoints = [
        "https://freedomhouse.org/api/countries",
        "https://api.freedomhouse.org/report/freedom-world",
        "https://freedomhouse.org/sites/default/files/2024-02/FIW_All_Data_Countries_2013-2023.xlsx",
        "https://freedomhouse.org/report/countries-world-freedom-2024"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            request = urllib.request.Request(endpoint)
            request.add_header('User-Agent', 'Mozilla/5.0 (Research Project)')
            
            with urllib.request.urlopen(request, timeout=15) as response:
                if response.status == 200:
                    content_type = response.headers.get('Content-Type', '')
                    content_length = response.headers.get('Content-Length', 'unknown')
                    print(f"✅ SUCCESS - Content-Type: {content_type}, Length: {content_length}")
                    working_endpoints.append(endpoint)
                    
                    if 'json' in content_type.lower():
                        print("📊 JSON data available")
                    elif 'excel' in content_type.lower() or 'xlsx' in content_type.lower():
                        print("📊 Excel file available")
                    elif 'csv' in content_type.lower():
                        print("📊 CSV data available")
                    else:
                        print("📊 Other format")
                        
                else:
                    print(f"❌ HTTP {response.status}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(2)
    
    return working_endpoints

def test_world_happiness_report():
    """Test World Happiness Report data"""
    print(f"\n🔍 TESTING WORLD HAPPINESS REPORT DATA")
    print("-" * 40)
    
    # World Happiness Report endpoints
    test_endpoints = [
        "https://happiness-report.s3.amazonaws.com/2024/DataForFigure2.1WHR2024.xls",
        "https://worldhappiness.report/ed/2024/",
        "https://kaggle.com/datasets/unsdsn/world-happiness",
        "https://github.com/datasets/world-happiness/raw/master/data/2020.csv"
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint}")
        try:
            request = urllib.request.Request(endpoint)
            request.add_header('User-Agent', 'Mozilla/5.0 (Research Project)')
            
            with urllib.request.urlopen(request, timeout=15) as response:
                if response.status == 200:
                    content_type = response.headers.get('Content-Type', '')
                    content_length = response.headers.get('Content-Length', 'unknown')
                    print(f"✅ SUCCESS - Content-Type: {content_type}, Length: {content_length}")
                    working_endpoints.append(endpoint)
                    
                    if 'csv' in content_type.lower() or endpoint.endswith('.csv'):
                        print("📊 CSV data available")
                    elif 'excel' in content_type.lower() or endpoint.endswith('.xls'):
                        print("📊 Excel file available")
                    else:
                        print("📊 Other format")
                        
                else:
                    print(f"❌ HTTP {response.status}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(2)
    
    return working_endpoints

def main():
    print("🚀 TESTING ALTERNATIVE DATA SOURCES")
    print("Testing real APIs - no assumptions")
    print()
    
    all_results = {}
    
    # Test Heritage Foundation
    heritage_endpoints = test_heritage_foundation_access()
    all_results["heritage_foundation"] = {
        "working_endpoints": heritage_endpoints,
        "accessible": len(heritage_endpoints) > 0
    }
    
    # Test Transparency International
    transparency_endpoints = test_transparency_international()
    all_results["transparency_international"] = {
        "working_endpoints": transparency_endpoints,
        "accessible": len(transparency_endpoints) > 0
    }
    
    # Test Freedom House
    freedom_endpoints = test_freedom_house()
    all_results["freedom_house"] = {
        "working_endpoints": freedom_endpoints,
        "accessible": len(freedom_endpoints) > 0
    }
    
    # Test World Happiness Report
    happiness_endpoints = test_world_happiness_report()
    all_results["world_happiness"] = {
        "working_endpoints": happiness_endpoints,
        "accessible": len(happiness_endpoints) > 0
    }
    
    # Summary
    print(f"\n📊 ALTERNATIVE DATA SOURCES TEST SUMMARY:")
    print("=" * 50)
    
    accessible_sources = []
    for source, data in all_results.items():
        status = "✅ ACCESSIBLE" if data["accessible"] else "❌ NOT ACCESSIBLE"
        endpoint_count = len(data["working_endpoints"])
        print(f"{source.replace('_', ' ').title()}: {status} ({endpoint_count} working endpoints)")
        
        if data["accessible"]:
            accessible_sources.append(source)
    
    print(f"\nAccessible sources: {len(accessible_sources)}/4")
    
    if accessible_sources:
        print(f"\n✅ VIABLE ALTERNATIVE SOURCES:")
        for source in accessible_sources:
            print(f"   • {source.replace('_', ' ').title()}")
    else:
        print(f"\n❌ No alternative sources accessible via direct API")
        print("ℹ️  May need to download static files or use web scraping")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "sources_tested": list(all_results.keys()),
        "results": all_results,
        "accessible_count": len(accessible_sources),
        "accessible_sources": accessible_sources,
        "next_steps": "Test specific data from working sources" if accessible_sources else "Consider static file downloads"
    }
    
    with open('alternative_sources_test.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Results saved to: alternative_sources_test.json")

if __name__ == "__main__":
    main()