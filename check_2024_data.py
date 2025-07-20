#!/usr/bin/env python3
"""
Check if 2024 data is available from World Bank
"""

import urllib.request
import json
from datetime import datetime

def check_latest_data(country_iso3, indicator_code):
    """Check what years have data available"""
    url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2024&per_page=10"
    
    try:
        with urllib.request.urlopen(url + params, timeout=10) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            available_years = []
            for entry in data[1]:
                if entry["value"] is not None:
                    available_years.append({
                        "year": entry["date"],
                        "value": entry["value"]
                    })
            return available_years
        return []
        
    except Exception as e:
        print(f"Error: {e}")
        return []

def main():
    print("🔍 Checking World Bank Data Availability for 2024")
    print("=" * 60)
    print(f"Current date: {datetime.now().strftime('%Y-%m-%d')}")
    print()
    
    # Test with a few major countries
    test_countries = {
        "United States": "USA",
        "China": "CHN",
        "Germany": "DEU",
        "Japan": "JPN",
        "India": "IND"
    }
    
    indicators = {
        "SP.DYN.LE00.IN": "Life Expectancy",
        "IT.NET.USER.ZS": "Internet Usage",
        "NY.GDP.PCAP.CD": "GDP per Capita",
        "FP.CPI.TOTL.ZG": "Inflation Rate"
    }
    
    for country_name, iso3 in test_countries.items():
        print(f"\n🌍 {country_name} ({iso3}):")
        print("-" * 40)
        
        for indicator_code, indicator_name in indicators.items():
            print(f"\n  📊 {indicator_name}:")
            years_data = check_latest_data(iso3, indicator_code)
            
            if years_data:
                # Show latest 3 years
                for data in years_data[:3]:
                    print(f"     {data['year']}: {data['value']}")
                    
                # Check if 2024 data exists
                has_2024 = any(d['year'] == '2024' for d in years_data)
                if has_2024:
                    print("     ✅ 2024 data available!")
                else:
                    latest_year = years_data[0]['year'] if years_data else "Unknown"
                    print(f"     ❌ No 2024 data (latest: {latest_year})")
            else:
                print("     ❌ No data available")
    
    print("\n" + "=" * 60)
    print("📝 Summary:")
    print("World Bank data is typically released with a 1-2 year delay.")
    print("Most indicators have 2023 as the latest available year.")
    print("2024 data will likely be available in 2025-2026.")

if __name__ == "__main__":
    main()