#!/usr/bin/env python3
"""
Complete World Bank Data Fetcher
Fetches all 20 validated indicators for 38 countries
No assumptions - only verified data
"""

import urllib.request
import json
import time
from datetime import datetime

# 38 countries (excluding Luxembourg and Egypt per v4 dataset)
COUNTRIES = {
    "DEU": "Germany", "DNK": "Denmark", "AUT": "Austria", "TUR": "Turkey",
    "USA": "United States", "CHN": "China", "JPN": "Japan", "GBR": "United Kingdom",
    "FRA": "France", "ITA": "Italy", "CAN": "Canada", "AUS": "Australia",
    "ESP": "Spain", "NLD": "Netherlands", "SWE": "Sweden", "NOR": "Norway",
    "FIN": "Finland", "ISL": "Iceland", "CHE": "Switzerland", "BEL": "Belgium",
    "NZL": "New Zealand", "SGP": "Singapore", "ISR": "Israel", "IRL": "Ireland",
    "BRA": "Brazil", "MEX": "Mexico", "ARG": "Argentina", "CHL": "Chile",
    "COL": "Colombia", "POL": "Poland", "CZE": "Czech Republic", "THA": "Thailand",
    "MYS": "Malaysia", "PHL": "Philippines", "IDN": "Indonesia", "VNM": "Vietnam",
    "IND": "India", "ZAF": "South Africa"
}

# 20 World Bank indicators from final_verified_dataset.json
INDICATORS = {
    "SP.DYN.CBRT.IN": "Birth rate, crude (per 1,000 people)",
    "SP.DYN.LE00.IN": "Life expectancy at birth, total (years)",
    "SP.POP.0014.TO.ZS": "Population ages 0-14 (% of total population)",
    "SP.POP.65UP.TO.ZS": "Population ages 65 and above (% of total population)",
    "SP.POP.TOTL": "Population, total",
    "NY.GDP.MKTP.CD": "GDP (current US$)",
    "NY.GDP.MKTP.KD.ZG": "GDP growth (annual %)",
    "IT.NET.BBND.P2": "Fixed broadband subscriptions (per 100 people)",
    "IT.CEL.SETS.P2": "Mobile cellular subscriptions (per 100 people)",
    "IT.NET.SECR.P6": "Secure Internet servers (per 1 million people)",
    "EG.ELC.COAL.ZS": "Electricity production from coal sources (% of total)",
    "EG.ELC.PETR.ZS": "Electricity production from oil sources (% of total)",
    "AG.LND.FRST.ZS": "Forest area (% of land area)",
    "EG.FEC.RNEW.ZS": "Renewable energy consumption (% of total final energy consumption)",
    "SH.XPD.CHEX.GD.ZS": "Current health expenditure (% of GDP)",
    "SE.TER.ENRR": "School enrollment, tertiary (% gross)",
    "SL.TLF.CACT.FE.ZS": "Labor force participation rate, female (% of female population ages 15+)",
    "IP.PAT.RESD": "Patent applications, residents",
    "SP.RUR.TOTL.ZS": "Rural population (% of total population)",
    "SL.UEM.TOTL.ZS": "Unemployment, total (% of total labor force)"
}

def fetch_world_bank_data(country_code, indicator_code):
    """Fetch data from World Bank API - only most recent non-null value"""
    url = f"https://api.worldbank.org/v2/country/{country_code}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2024&per_page=10"
    
    try:
        print(f"    {indicator_code}...", end=" ")
        
        with urllib.request.urlopen(url + params, timeout=15) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            # Find most recent non-null value
            for entry in data[1]:
                if entry["value"] is not None:
                    value = entry["value"]
                    year = entry["date"]
                    print(f"✓ {value} ({year})")
                    return {"value": value, "year": year}
        
        print("✗ No data")
        return None
        
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

def main():
    print("🌍 Complete World Bank Data Fetcher")
    print("=" * 60)
    print(f"📊 Fetching {len(INDICATORS)} indicators for {len(COUNTRIES)} countries")
    print(f"⏱️  Estimated time: ~15 minutes\n")
    
    results = {}
    start_time = datetime.now()
    total_requests = len(COUNTRIES) * len(INDICATORS)
    completed_requests = 0
    
    for country_code, country_name in COUNTRIES.items():
        print(f"\n🌍 Processing {country_name} ({country_code})...")
        
        country_data = {
            "country_name": country_name,
            "country_code": country_code,
            "data": {}
        }
        
        for indicator_code, indicator_name in INDICATORS.items():
            result = fetch_world_bank_data(country_code, indicator_code)
            
            if result:
                country_data["data"][indicator_code] = {
                    "value": result["value"],
                    "year": result["year"],
                    "name": indicator_name
                }
            else:
                country_data["data"][indicator_code] = None
            
            completed_requests += 1
            progress = (completed_requests / total_requests) * 100
            print(f"    Progress: {progress:.1f}%")
            
            # Rate limiting - be respectful to World Bank API
            time.sleep(0.5)
        
        results[country_code] = country_data
        
        # Save progress every 5 countries
        if len(results) % 5 == 0:
            with open("wb_data_progress.json", "w") as f:
                json.dump(results, f, indent=2)
            print(f"✅ Progress saved: {len(results)}/{len(COUNTRIES)} countries")
    
    # Save final results
    output_file = f"world_bank_complete_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, "w") as f:
        json.dump({
            "fetch_date": datetime.now().isoformat(),
            "total_countries": len(COUNTRIES),
            "total_indicators": len(INDICATORS),
            "data_source": "World Bank Open Data API",
            "methodology": "Most recent non-null value 2020-2024",
            "countries": results
        }, f, indent=2)
    
    # Calculate completeness
    total_possible = len(COUNTRIES) * len(INDICATORS)
    total_found = 0
    
    for country_data in results.values():
        for indicator_data in country_data["data"].values():
            if indicator_data is not None:
                total_found += 1
    
    completeness = (total_found / total_possible) * 100
    
    # Show summary
    end_time = datetime.now()
    duration = end_time - start_time
    
    print(f"\n🎉 Data Collection Complete!")
    print(f"⏱️  Duration: {duration}")
    print(f"📊 Countries: {len(COUNTRIES)}")
    print(f"📊 Indicators: {len(INDICATORS)}")
    print(f"📊 Total data points: {total_found}/{total_possible} ({completeness:.1f}%)")
    print(f"📁 Data saved to: {output_file}")
    
    if completeness >= 95:
        print("✅ HIGH QUALITY DATASET - Ready for spreadsheet generation")
    elif completeness >= 90:
        print("⚠️  GOOD DATASET - Minor gaps present")
    else:
        print("❌ INCOMPLETE DATASET - Significant gaps present")

if __name__ == "__main__":
    main()