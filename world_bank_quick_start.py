#!/usr/bin/env python3
"""
World Bank Quick Start - Download key indicators only
A faster version that downloads just the indicators used in the game
"""

import requests
import pandas as pd
import time
import json
import os

# Simplified country list with ISO codes
COUNTRIES = {
    "United States": "USA",
    "China": "CHN",
    "Japan": "JPN",
    "Germany": "DEU",
    "United Kingdom": "GBR",
    "France": "FRA",
    "India": "IND",
    "Italy": "ITA",
    "Brazil": "BRA",
    "Canada": "CAN"
}

# Key indicators matching game prompts
KEY_INDICATORS = {
    "NY.GDP.PCAP.CD": "gdp_per_capita",
    "SP.POP.TOTL": "population",
    "SP.DYN.LE00.IN": "life_expectancy",
    "IT.NET.USER.ZS": "internet_penetration",
    "FP.CPI.TOTL.ZG": "inflation_rate",
    "SL.UEM.TOTL.ZS": "unemployment_rate"
}

def get_world_bank_data(country_code, indicator):
    """Fetch single indicator for a country"""
    url = f"https://api.worldbank.org/v2/country/{country_code}/indicator/{indicator}"
    params = {"format": "json", "date": "2020:2023", "per_page": 10}
    
    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if len(data) > 1:
                for entry in data[1]:
                    if entry["value"] is not None:
                        return entry["value"]
    except Exception as e:
        print(f"Error: {e}")
    
    return None

def main():
    print("🌍 World Bank Quick Download")
    print(f"📊 Downloading {len(KEY_INDICATORS)} indicators for {len(COUNTRIES)} countries\n")
    
    results = []
    
    for country_name, country_code in COUNTRIES.items():
        print(f"Processing {country_name}...")
        
        country_data = {"country": country_name}
        
        for indicator_code, indicator_name in KEY_INDICATORS.items():
            value = get_world_bank_data(country_code, indicator_code)
            country_data[indicator_name] = value
            
            if value:
                print(f"  ✓ {indicator_name}: {value:.2f}" if isinstance(value, float) else f"  ✓ {indicator_name}: {value}")
            else:
                print(f"  ✗ {indicator_name}: No data")
                
            time.sleep(0.5)  # Rate limiting
            
        results.append(country_data)
        print()
    
    # Save results
    df = pd.DataFrame(results)
    df.to_csv("world_bank_quick_data.csv", index=False)
    print("✅ Data saved to world_bank_quick_data.csv")
    
    # Create game update JSON
    updates = []
    for _, row in df.iterrows():
        update = {
            "name": row["country"],
            "updates": {k: v for k, v in row.items() if k != "country" and pd.notna(v)}
        }
        updates.append(update)
    
    with open("world_bank_updates.json", "w") as f:
        json.dump(updates, f, indent=2)
    
    print("✅ Game updates saved to world_bank_updates.json")
    print("\nUse with: node precision_update.js world_bank_updates.json")

if __name__ == "__main__":
    main()