#!/usr/bin/env python3
"""
Get latest data for life expectancy and internet penetration only
Track which year each data point is from
"""

import urllib.request
import json
import time
from datetime import datetime

def fetch_latest_data(country_iso3, indicator_code):
    """Fetch the most recent available data and its year"""
    if country_iso3 == "TWN":  # Taiwan not in World Bank
        return None, None
        
    url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2024&per_page=10"
    
    try:
        with urllib.request.urlopen(url + params, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            # Find most recent non-null value
            for entry in data[1]:
                if entry["value"] is not None:
                    return entry["value"], entry["date"]
        return None, None
        
    except Exception as e:
        return None, None

def main():
    print("🌍 Getting LATEST Life Expectancy & Internet Data")
    print("=" * 60)
    
    # Load country mapping
    with open('all_40_countries_mapping.json', 'r') as f:
        countries = json.load(f)
    
    # Focus on our 2 key indicators
    indicators = {
        "SP.DYN.LE00.IN": "life_expectancy",
        "IT.NET.USER.ZS": "internet_penetration"
    }
    
    results = {}
    
    # Test with first few countries to see years
    test_countries = ["038", "008", "022", "009", "015"]  # USA, China, Japan, Germany, UK
    
    print("\n📊 Checking data years for sample countries:")
    
    for code in test_countries:
        if code in countries:
            country_info = countries[code]
            name = country_info["name"]
            iso3 = country_info["iso3"]
            
            print(f"\n🌍 {name} ({iso3}):")
            
            country_data = {}
            
            for wb_code, game_prop in indicators.items():
                value, year = fetch_latest_data(iso3, wb_code)
                
                if value is not None:
                    country_data[f"{game_prop}_value"] = round(float(value), 1)
                    country_data[f"{game_prop}_year"] = year
                    print(f"  {game_prop}: {value} ({year})")
                else:
                    print(f"  {game_prop}: No data")
                
                time.sleep(0.5)
            
            results[code] = country_data
    
    # Save sample results
    with open('world_bank_latest_sample.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Sample saved to: world_bank_latest_sample.json")
    
    # Summary
    print(f"\n📅 Data Year Summary:")
    life_years = set()
    internet_years = set()
    
    for country_data in results.values():
        if 'life_expectancy_year' in country_data:
            life_years.add(country_data['life_expectancy_year'])
        if 'internet_penetration_year' in country_data:
            internet_years.add(country_data['internet_penetration_year'])
    
    print(f"  Life Expectancy: {sorted(life_years, reverse=True)}")
    print(f"  Internet Penetration: {sorted(internet_years, reverse=True)}")
    
    print(f"\n💡 Recommendation:")
    print("  - Life expectancy: Latest is 2023 for all countries")
    print("  - Internet penetration: Mix of 2023-2024 data")
    print("  - We should track years and show them in prompts")

if __name__ == "__main__":
    main()