#!/usr/bin/env python3
"""
Download World Bank data for ALL 40 countries
"""

import urllib.request
import json
import time

def fetch_world_bank_data(country_iso3, indicator_code):
    """Fetch data from World Bank API"""
    if country_iso3 == "TWN":  # Taiwan not in World Bank
        return None
        
    url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2023&per_page=10"
    
    try:
        with urllib.request.urlopen(url + params, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            # Find most recent non-null value
            for entry in data[1]:
                if entry["value"] is not None:
                    return entry["value"]
        return None
        
    except Exception as e:
        print(f"    ❌ Error: {e}")
        return None

def main():
    print("🌍 Downloading World Bank Data for ALL 40 Countries")
    print("=" * 60)
    
    # Load country mapping
    with open('all_40_countries_mapping.json', 'r') as f:
        countries = json.load(f)
    
    print(f"📊 Processing {len(countries)} countries...")
    
    # Indicators we want
    indicators = {
        "SP.DYN.LE00.IN": "life_expectancy",
        "IT.NET.USER.ZS": "internet_penetration"
    }
    
    results = {}
    
    for code, country_info in countries.items():
        name = country_info["name"]
        iso3 = country_info["iso3"]
        
        print(f"\n🌍 {code}: {name} ({iso3})")
        
        if iso3 is None:
            print("    ⚠️  No ISO3 code - skipping")
            continue
            
        country_data = {}
        
        for wb_code, game_prop in indicators.items():
            print(f"    Fetching {game_prop}...", end=" ")
            value = fetch_world_bank_data(iso3, wb_code)
            
            if value is not None:
                country_data[game_prop] = round(float(value), 1)
                print(f"✓ {value}")
            else:
                print("❌ No data")
            
            time.sleep(0.5)  # Rate limiting
        
        if country_data:
            results[code] = country_data
    
    # Save results
    with open('world_bank_all_40_data.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Download complete!")
    print(f"📁 Data saved to: world_bank_all_40_data.json")
    print(f"📊 Countries with data: {len(results)}/40")
    
    # Show summary stats
    life_exp_count = sum(1 for data in results.values() if 'life_expectancy' in data)
    internet_count = sum(1 for data in results.values() if 'internet_penetration' in data)
    
    print(f"\n📈 Data Coverage:")
    print(f"   Life Expectancy: {life_exp_count}/40 countries")
    print(f"   Internet Penetration: {internet_count}/40 countries")

if __name__ == "__main__":
    main()