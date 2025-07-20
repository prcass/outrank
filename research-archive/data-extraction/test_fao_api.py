#!/usr/bin/env python3
"""
Test FAO (Food and Agriculture Organization) API for agriculture data
Automated extraction with proper sourcing - NO ASSUMPTIONS
"""

import urllib.request
import json
import time
import csv
from io import StringIO

def test_fao_api():
    """Test FAO API endpoints for agriculture data"""
    print("🌾 TESTING FAO (FOOD AND AGRICULTURE ORGANIZATION) API")
    print("=" * 60)
    print("Automated extraction from official UN FAO sources")
    print()
    
    # FAO API endpoints
    test_endpoints = [
        {
            "name": "FAO Data Lab API",
            "url": "https://www.fao.org/faostat/en/data",
            "type": "main_portal"
        },
        {
            "name": "FAOSTAT Bulk Downloads",
            "url": "https://www.fao.org/faostat/en/bulk-downloads",
            "type": "bulk_data"
        },
        {
            "name": "FAO Data API - Production",
            "url": "https://www.fao.org/faostat/api/v1/en/data/QCL",
            "type": "api_endpoint"
        }
    ]
    
    working_endpoints = []
    
    for endpoint in test_endpoints:
        print(f"\nTesting: {endpoint['name']}")
        print(f"URL: {endpoint['url']}")
        
        try:
            request = urllib.request.Request(endpoint['url'])
            request.add_header('User-Agent', 'Mozilla/5.0 (Research Project)')
            
            with urllib.request.urlopen(request, timeout=15) as response:
                if response.status == 200:
                    print(f"✅ SUCCESS - Endpoint accessible")
                    working_endpoints.append(endpoint)
                else:
                    print(f"❌ HTTP {response.status}")
        except Exception as e:
            print(f"❌ ERROR: {e}")
        
        time.sleep(1)
    
    return working_endpoints

def test_world_bank_agriculture():
    """Test World Bank API for agriculture indicators"""
    print(f"\n🏦 TESTING WORLD BANK AGRICULTURE INDICATORS")
    print("-" * 45)
    
    # World Bank agriculture indicators
    agriculture_indicators = [
        {"code": "AG.PRD.CROP.XD", "name": "Crop production index"},
        {"code": "AG.PRD.FOOD.XD", "name": "Food production index"},
        {"code": "AG.PRD.LVSK.XD", "name": "Livestock production index"},
        {"code": "AG.LND.AGRI.K2", "name": "Agricultural land (sq. km)"},
        {"code": "AG.LND.ARBL.ZS", "name": "Arable land (% of land area)"},
        {"code": "AG.LND.FRST.K2", "name": "Forest area (sq. km)"},
        {"code": "AG.LND.FRST.ZS", "name": "Forest area (% of land area)"},
        {"code": "SL.AGR.EMPL.ZS", "name": "Employment in agriculture (% of total employment)"}
    ]
    
    # Test one indicator to check API access
    test_indicator = agriculture_indicators[0]
    test_url = f"https://api.worldbank.org/v2/country/all/indicator/{test_indicator['code']}?format=json&date=2020:2024&per_page=300"
    
    try:
        with urllib.request.urlopen(test_url, timeout=15) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                print(f"✅ World Bank Agriculture API accessible")
                print(f"   Sample indicator: {test_indicator['name']}")
                if len(data) > 1 and data[1]:
                    print(f"   Countries with data: {len(data[1])}")
                    
                return True, agriculture_indicators
            else:
                print(f"❌ World Bank API returned status {response.status}")
                return False, []
    except Exception as e:
        print(f"❌ World Bank API error: {e}")
        return False, []

def extract_wb_agriculture_data(indicator, countries_iso3):
    """Extract specific agriculture indicator from World Bank"""
    
    print(f"\n📊 Extracting: {indicator['name']}")
    
    # Create country string for API
    country_string = ";".join(countries_iso3)
    url = f"https://api.worldbank.org/v2/country/{country_string}/indicator/{indicator['code']}?format=json&date=2020:2024&per_page=500"
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                
                if len(data) > 1 and data[1]:
                    # Process the data
                    country_data = {}
                    
                    for entry in data[1]:
                        if entry['value'] is not None:
                            country_name = entry['country']['value']
                            country_iso3 = entry['countryiso3code']
                            year = entry['date']
                            value = entry['value']
                            
                            if country_iso3 not in country_data:
                                country_data[country_iso3] = {
                                    'name': country_name,
                                    'latest_value': value,
                                    'year': year
                                }
                            else:
                                # Keep most recent year
                                if int(year) > int(country_data[country_iso3]['year']):
                                    country_data[country_iso3]['latest_value'] = value
                                    country_data[country_iso3]['year'] = year
                    
                    coverage = len(country_data)
                    print(f"   ✅ Data retrieved for {coverage} countries")
                    
                    return {
                        'indicator': indicator['name'],
                        'code': indicator['code'],
                        'source': 'World Bank Open Data',
                        'data': country_data,
                        'coverage': coverage
                    }
                    
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return None

def get_our_countries():
    """Get our 38 countries"""
    with open('countries_38_final.json', 'r') as f:
        data = json.load(f)
    
    countries = {}
    iso3_list = []
    for country in data["selected_countries"]:
        countries[country["iso3"]] = country["name"]
        iso3_list.append(country["iso3"])
    
    return countries, iso3_list

def main():
    print("🤖 AUTOMATED AGRICULTURE DATA EXTRACTION")
    print("=" * 50)
    print("NO manual steps, NO assumptions, ONLY verified data")
    print()
    
    # Get our countries
    our_countries, iso3_list = get_our_countries()
    print(f"✅ Loaded {len(our_countries)} target countries")
    
    # Test FAO API
    fao_endpoints = test_fao_api()
    
    # Test World Bank Agriculture API
    wb_accessible, wb_indicators = test_world_bank_agriculture()
    
    if wb_accessible:
        print(f"\n🌾 EXTRACTING WORLD BANK AGRICULTURE DATA")
        print("=" * 45)
        
        # Extract data for each indicator
        extracted_data = []
        
        for indicator in wb_indicators:
            result = extract_wb_agriculture_data(indicator, iso3_list)
            if result:
                # Check coverage for our countries
                our_coverage = sum(1 for iso3 in iso3_list if iso3 in result['data'])
                coverage_pct = (our_coverage / len(iso3_list)) * 100
                result['our_coverage'] = our_coverage
                result['our_coverage_pct'] = coverage_pct
                
                if coverage_pct == 100:
                    print(f"   🎯 100% coverage for our countries!")
                    extracted_data.append(result)
                else:
                    print(f"   ⚠️  {coverage_pct:.1f}% coverage for our countries")
            
            time.sleep(0.5)  # Rate limiting
        
        # Save results
        results = {
            "extraction_date": time.strftime("%Y-%m-%d %H:%M:%S"),
            "source": "World Bank Open Data API",
            "automated": True,
            "manual_steps": "NONE",
            "assumptions": "NONE - all data from official API",
            "agriculture_indicators": extracted_data,
            "indicators_with_100_coverage": sum(1 for d in extracted_data if d['our_coverage_pct'] == 100)
        }
        
        with open('agriculture_automated_extraction.json', 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📊 EXTRACTION COMPLETE:")
        print(f"Total indicators tested: {len(wb_indicators)}")
        print(f"Indicators with 100% coverage: {results['indicators_with_100_coverage']}")
        print(f"All data properly sourced from World Bank API")
        print(f"📁 Results saved to: agriculture_automated_extraction.json")
    
    else:
        print("\n❌ Unable to access agriculture data APIs")
        print("Alternative: Need to use static data files or web scraping")

if __name__ == "__main__":
    main()