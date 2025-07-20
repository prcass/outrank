#!/usr/bin/env python3
"""
Get the LATEST available World Bank data for each indicator
Tracks which year the data is from
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
        print(f"    ❌ Error: {e}")
        return None, None

def main():
    print("🌍 Getting LATEST World Bank Data for ALL Countries")
    print("=" * 60)
    print(f"Current date: {datetime.now().strftime('%Y-%m-%d')}")
    print("Will fetch the most recent available data for each indicator")
    print()
    
    # Load country mapping
    with open('all_40_countries_mapping.json', 'r') as f:
        countries = json.load(f)
    
    # All indicators we want
    indicators = {
        "SP.DYN.LE00.IN": "life_expectancy",
        "IT.NET.USER.ZS": "internet_penetration",
        "NY.GDP.PCAP.CD": "gdp_per_capita",
        "SP.POP.TOTL": "population",
        "FP.CPI.TOTL.ZG": "inflation_rate",
        "SL.UEM.TOTL.ZS": "unemployment_rate"
    }
    
    results = {}
    data_years = {}  # Track which year each data point is from
    
    for code, country_info in countries.items():
        name = country_info["name"]
        iso3 = country_info["iso3"]
        
        print(f"\n🌍 {code}: {name} ({iso3})")
        
        if iso3 is None:
            print("    ⚠️  No ISO3 code - skipping")
            continue
            
        country_data = {}
        country_years = {}
        
        for wb_code, game_prop in indicators.items():
            print(f"    Fetching {game_prop}...", end=" ")
            value, year = fetch_latest_data(iso3, wb_code)
            
            if value is not None:
                # Round appropriately based on indicator type
                if game_prop == "population":
                    country_data[game_prop] = int(value)
                elif game_prop in ["gdp_per_capita"]:
                    country_data[game_prop] = round(float(value), 2)
                else:
                    country_data[game_prop] = round(float(value), 1)
                
                country_years[game_prop] = year
                print(f"✓ {value} ({year})")
            else:
                print("❌ No data")
            
            time.sleep(0.3)  # Rate limiting
        
        if country_data:
            results[code] = country_data
            data_years[code] = country_years
    
    # Save results with year tracking
    output = {
        "data": results,
        "data_years": data_years,
        "generated": datetime.now().isoformat(),
        "indicators": list(indicators.values())
    }
    
    with open('world_bank_latest_with_years.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ Download complete!")
    print(f"📁 Data saved to: world_bank_latest_with_years.json")
    print(f"📊 Countries with data: {len(results)}/40")
    
    # Show year summary
    print(f"\n📅 Data Year Summary:")
    year_counts = {}
    for country_years in data_years.values():
        for indicator, year in country_years.items():
            if indicator not in year_counts:
                year_counts[indicator] = {}
            if year not in year_counts[indicator]:
                year_counts[indicator][year] = 0
            year_counts[indicator][year] += 1
    
    for indicator, years in year_counts.items():
        print(f"\n  {indicator}:")
        for year, count in sorted(years.items(), reverse=True):
            print(f"    {year}: {count} countries")

if __name__ == "__main__":
    main()