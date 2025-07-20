#!/usr/bin/env python3
"""
World Bank Simple Downloader - No external dependencies
Uses only built-in Python libraries
"""

import urllib.request
import json
import csv
import time
from datetime import datetime

# Simplified country list
COUNTRIES = {
    "United States": "USA",
    "China": "CHN", 
    "Japan": "JPN",
    "Germany": "DEU",
    "United Kingdom": "GBR",
    "France": "FRA",
    "India": "IND",
    "Brazil": "BRA",
    "Canada": "CAN",
    "Italy": "ITA"
}

# Key indicators for the game
INDICATORS = {
    "NY.GDP.PCAP.CD": "GDP per capita (current US$)",
    "SP.POP.TOTL": "Population, total", 
    "SP.DYN.LE00.IN": "Life expectancy at birth (years)",
    "IT.NET.USER.ZS": "Individuals using the Internet (% of population)",
    "FP.CPI.TOTL.ZG": "Inflation, consumer prices (annual %)",
    "SL.UEM.TOTL.ZS": "Unemployment, total (% of total labor force)"
}

def fetch_world_bank_data(country_code, indicator_code):
    """Fetch data from World Bank API using built-in urllib"""
    url = f"https://api.worldbank.org/v2/country/{country_code}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2023&per_page=10"
    
    try:
        print(f"    Fetching {indicator_code}...", end=" ")
        
        with urllib.request.urlopen(url + params, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            # Find most recent non-null value
            for entry in data[1]:
                if entry["value"] is not None:
                    print(f"✓ {entry['value']} ({entry['date']})")
                    return entry["value"]
        
        print("✗ No data")
        return None
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def main():
    print("🌍 World Bank Simple Downloader")
    print("=" * 50)
    print(f"📊 Downloading {len(INDICATORS)} indicators for {len(COUNTRIES)} countries")
    print(f"⏱️  Estimated time: ~2 minutes\n")
    
    results = []
    start_time = datetime.now()
    
    for country_name, country_code in COUNTRIES.items():
        print(f"\n🌍 Processing {country_name} ({country_code})...")
        
        country_data = {
            "country": country_name,
            "country_code": country_code
        }
        
        for indicator_code, indicator_name in INDICATORS.items():
            value = fetch_world_bank_data(country_code, indicator_code)
            country_data[indicator_code] = value
            country_data[f"{indicator_code}_name"] = indicator_name
            
            # Rate limiting
            time.sleep(0.5)
        
        results.append(country_data)
    
    # Save to CSV
    if results:
        print(f"\n📄 Saving results to CSV...")
        
        # Create CSV with all data
        with open("world_bank_data.csv", "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = ["country", "country_code"]
            
            # Add indicator columns
            for indicator_code in INDICATORS.keys():
                fieldnames.extend([indicator_code, f"{indicator_code}_name"])
            
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        
        print("✅ Data saved to: world_bank_data.csv")
        
        # Create game update JSON
        print("🎮 Creating game update file...")
        
        game_updates = []
        for row in results:
            # Map World Bank indicators to game properties
            updates = {}
            
            if row.get("NY.GDP.PCAP.CD"):
                updates["gdp_per_capita"] = round(float(row["NY.GDP.PCAP.CD"]), 2)
            
            if row.get("SP.POP.TOTL"):
                updates["population"] = round(float(row["SP.POP.TOTL"]))
                
            if row.get("SP.DYN.LE00.IN"):
                updates["life_expectancy"] = round(float(row["SP.DYN.LE00.IN"]), 1)
                
            if row.get("IT.NET.USER.ZS"):
                updates["internet_penetration"] = round(float(row["IT.NET.USER.ZS"]), 1)
                
            if row.get("FP.CPI.TOTL.ZG"):
                updates["inflation_rate"] = round(float(row["FP.CPI.TOTL.ZG"]), 2)
                
            if row.get("SL.UEM.TOTL.ZS"):
                updates["unemployment_rate"] = round(float(row["SL.UEM.TOTL.ZS"]), 1)
            
            if updates:  # Only add if we have data
                game_updates.append({
                    "name": row["country"],
                    "updates": updates
                })
        
        # Save JSON for game updates
        with open("world_bank_game_updates.json", "w", encoding="utf-8") as jsonfile:
            json.dump(game_updates, jsonfile, indent=2)
        
        print("✅ Game updates saved to: world_bank_game_updates.json")
        
        # Show summary
        end_time = datetime.now()
        duration = end_time - start_time
        
        print(f"\n🎉 Download Complete!")
        print(f"⏱️  Duration: {duration}")
        print(f"📊 Countries processed: {len(results)}")
        print(f"📁 Files created:")
        print(f"   • world_bank_data.csv (raw data)")
        print(f"   • world_bank_game_updates.json (ready for game)")
        
        print(f"\n🎮 To update your game data:")
        print(f"   node precision_update.js world_bank_game_updates.json")
        
        # Show sample data
        print(f"\n📋 Sample Data Preview:")
        print("-" * 60)
        for i, result in enumerate(results[:3]):  # Show first 3 countries
            print(f"{result['country']:15} | GDP: ${result.get('NY.GDP.PCAP.CD', 'N/A')}")
            if i == 2 and len(results) > 3:
                print(f"... and {len(results) - 3} more countries")
                break
    
    else:
        print("❌ No data retrieved")

if __name__ == "__main__":
    main()