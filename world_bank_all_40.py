#!/usr/bin/env python3
"""
Download World Bank data for ALL 40 countries in the Outrank game
"""

import urllib.request
import json
import time
from datetime import datetime

# Get all 40 countries from the game
def get_all_game_countries():
    """Extract all 40 countries from game data"""
    with open('data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Execute the JS to get the data
    import re
    
    # Find all country items
    countries_section = re.search(r'"countries":[^}]*"items":\s*{([^}]+}[^}]*)}', content, re.DOTALL)
    if not countries_section:
        print("❌ Could not find countries section")
        return {}
    
    countries = {}
    
    # Find all country entries
    country_pattern = r'"(\d{3})":\s*{[^}]*"name":\s*"([^"]+)"[^}]*}'
    matches = re.findall(country_pattern, content)
    
    for code, name in matches:
        # Map to ISO3 codes for World Bank API
        iso3_mapping = {
            "United States": "USA", "China": "CHN", "Japan": "JPN", "Germany": "DEU",
            "United Kingdom": "GBR", "France": "FRA", "India": "IND", "Italy": "ITA", 
            "Brazil": "BRA", "Canada": "CAN", "Russia": "RUS", "South Korea": "KOR",
            "Spain": "ESP", "Australia": "AUS", "Mexico": "MEX", "Indonesia": "IDN",
            "Netherlands": "NLD", "Saudi Arabia": "SAU", "Turkey": "TUR", "Taiwan": "TWN",
            "Belgium": "BEL", "Argentina": "ARG", "Thailand": "THA", "Ireland": "IRL",
            "Austria": "AUT", "Nigeria": "NGA", "Israel": "ISR", "Norway": "NOR",
            "United Arab Emirates": "ARE", "Egypt": "EGY", "South Africa": "ZAF",
            "Philippines": "PHL", "Bangladesh": "BGD", "Vietnam": "VNM", "Chile": "CHL",
            "Finland": "FIN", "Denmark": "DNK", "Singapore": "SGP", "New Zealand": "NZL",
            "Switzerland": "CHE", "Malaysia": "MYS", "Kenya": "KEN", "Portugal": "PRT",
            "Greece": "GRC"
        }
        
        iso3 = iso3_mapping.get(name)
        if iso3:
            countries[code] = {"name": name, "iso3": iso3}
        else:
            print(f"⚠️  No ISO3 mapping for: {name}")
            
    return countries

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
    print("🌍 World Bank Data for ALL 40 Countries")
    print("=" * 60)
    
    # Get all countries
    countries = get_all_game_countries()
    print(f"📊 Found {len(countries)} countries in game data")
    
    # Indicators we want
    indicators = {
        "SP.DYN.LE00.IN": "life_expectancy",
        "IT.NET.USER.ZS": "internet_penetration"
    }
    
    results = {}
    
    for code, country_info in countries.items():
        name = country_info["name"]
        iso3 = country_info["iso3"]
        
        print(f"\n🌍 Processing {name} ({code} → {iso3})...")
        
        country_data = {}
        
        for wb_code, game_prop in indicators.items():
            value = fetch_world_bank_data(iso3, wb_code)
            if value is not None:
                country_data[game_prop] = round(float(value), 1)
                print(f"    ✓ {game_prop}: {value}")
            else:
                print(f"    ❌ {game_prop}: No data")
            
            time.sleep(0.3)  # Rate limiting
        
        if country_data:
            results[code] = country_data
    
    # Save results
    with open('world_bank_all_40_countries.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Data saved to: world_bank_all_40_countries.json")
    print(f"📊 Countries with data: {len(results)}")
    
    # Show summary
    print(f"\n📋 Summary:")
    for code, data in results.items():
        country_name = countries[code]["name"]
        life_exp = data.get("life_expectancy", "N/A")
        internet = data.get("internet_penetration", "N/A")
        print(f"  {code} {country_name:20} | Life: {life_exp:>5} | Internet: {internet:>5}%")

if __name__ == "__main__":
    main()