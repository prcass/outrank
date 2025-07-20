#!/usr/bin/env python3
"""
Pull World Bank data for all 20 indicators across 40 countries
Complete the dataset with actual values from World Bank API
"""

import requests
import json
import time
from datetime import datetime

# World Bank indicator codes we need
WORLD_BANK_INDICATORS = {
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

# Our 40 countries with ISO3 codes
COUNTRIES = {
    "DEU": "Germany",
    "DNK": "Denmark",
    "AUT": "Austria",
    "TUR": "Turkey",
    "USA": "United States",
    "CHN": "China",
    "JPN": "Japan",
    "GBR": "United Kingdom",
    "FRA": "France",
    "ITA": "Italy",
    "CAN": "Canada",
    "AUS": "Australia",
    "ESP": "Spain",
    "NLD": "Netherlands",
    "SWE": "Sweden",
    "NOR": "Norway",
    "FIN": "Finland",
    "ISL": "Iceland",
    "CHE": "Switzerland",
    "BEL": "Belgium",
    "NZL": "New Zealand",
    "SGP": "Singapore",
    "ISR": "Israel",
    "IRL": "Ireland",
    "BRA": "Brazil",
    "MEX": "Mexico",
    "ARG": "Argentina",
    "CHL": "Chile",
    "COL": "Colombia",
    "POL": "Poland",
    "CZE": "Czech Republic",
    "THA": "Thailand",
    "MYS": "Malaysia",
    "PHL": "Philippines",
    "IDN": "Indonesia",
    "VNM": "Vietnam",
    "IND": "India",
    "ZAF": "South Africa",
    "EGY": "Egypt",
    "PAK": "Pakistan"
}

def get_world_bank_data(indicator_code, countries, year_range="2020:2023"):
    """
    Fetch data from World Bank API for a specific indicator
    """
    base_url = "https://api.worldbank.org/v2/country"
    
    # Create country string (semicolon-separated ISO3 codes)
    country_string = ";".join(countries.keys())
    
    # Construct API URL
    url = f"{base_url}/{country_string}/indicator/{indicator_code}"
    
    params = {
        "format": "json",
        "date": year_range,
        "per_page": 500
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        # World Bank API returns metadata as first element
        if len(data) > 1 and data[1]:
            return data[1]
        else:
            return []
            
    except Exception as e:
        print(f"Error fetching {indicator_code}: {str(e)}")
        return []

def extract_latest_value(country_data, country_code):
    """
    Extract the most recent non-null value for a country
    """
    # Filter data for specific country
    country_entries = [d for d in country_data if d.get('countryiso3code') == country_code]
    
    # Sort by year (descending) and get first non-null value
    for entry in sorted(country_entries, key=lambda x: x.get('date', ''), reverse=True):
        if entry.get('value') is not None:
            return {
                'value': entry['value'],
                'year': entry.get('date', 'Unknown')
            }
    
    return None

def pull_all_world_bank_data():
    """
    Pull all World Bank data for our 40 countries and 20 indicators
    """
    print("🌍 Pulling World Bank Data for 40 Countries")
    print("=" * 60)
    
    # Initialize results structure
    world_bank_data = {
        "extraction_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "source": "World Bank Open Data API",
        "url": "https://api.worldbank.org/v2/",
        "countries": {},
        "indicators": {},
        "coverage_summary": {}
    }
    
    # Initialize country data structures
    for iso3, name in COUNTRIES.items():
        world_bank_data['countries'][iso3] = {
            "name": name,
            "indicators": {}
        }
    
    # Pull data for each indicator
    total_indicators = len(WORLD_BANK_INDICATORS)
    
    for idx, (indicator_code, indicator_name) in enumerate(WORLD_BANK_INDICATORS.items(), 1):
        print(f"\n📊 [{idx}/{total_indicators}] Fetching: {indicator_name}")
        print(f"   Code: {indicator_code}")
        
        # Fetch data from API
        data = get_world_bank_data(indicator_code, COUNTRIES)
        
        if not data:
            print(f"   ❌ No data returned")
            continue
        
        # Extract values for each country
        countries_with_data = 0
        
        for iso3 in COUNTRIES.keys():
            value_info = extract_latest_value(data, iso3)
            
            if value_info:
                world_bank_data['countries'][iso3]['indicators'][indicator_code] = {
                    'value': value_info['value'],
                    'year': value_info['year']
                }
                countries_with_data += 1
        
        # Store indicator metadata
        coverage_pct = (countries_with_data / len(COUNTRIES)) * 100
        world_bank_data['indicators'][indicator_code] = {
            'name': indicator_name,
            'coverage': f"{countries_with_data}/{len(COUNTRIES)}",
            'coverage_pct': coverage_pct
        }
        
        print(f"   ✅ Coverage: {countries_with_data}/{len(COUNTRIES)} countries ({coverage_pct:.1f}%)")
        
        # Rate limiting - be nice to the API
        time.sleep(1)
    
    # Calculate overall coverage
    total_data_points = 0
    available_data_points = 0
    
    for country_data in world_bank_data['countries'].values():
        for indicator_code in WORLD_BANK_INDICATORS.keys():
            total_data_points += 1
            if indicator_code in country_data['indicators']:
                available_data_points += 1
    
    overall_coverage = (available_data_points / total_data_points) * 100 if total_data_points > 0 else 0
    
    world_bank_data['coverage_summary'] = {
        'total_data_points': total_data_points,
        'available_data_points': available_data_points,
        'overall_coverage_pct': overall_coverage,
        'total_countries': len(COUNTRIES),
        'total_indicators': len(WORLD_BANK_INDICATORS)
    }
    
    # Save the raw data
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"world_bank_data_complete_{timestamp}.json"
    
    with open(filename, 'w') as f:
        json.dump(world_bank_data, f, indent=2)
    
    print(f"\n✅ World Bank Data Collection Complete!")
    print(f"📁 Saved to: {filename}")
    print(f"📊 Overall Coverage: {available_data_points}/{total_data_points} ({overall_coverage:.1f}%)")
    
    # Show coverage summary by indicator
    print(f"\n📈 Coverage Summary by Indicator:")
    for code, info in world_bank_data['indicators'].items():
        status = "✅" if info['coverage_pct'] == 100 else "⚠️"
        print(f"   {status} {info['name']}: {info['coverage']} ({info['coverage_pct']:.1f}%)")
    
    return filename

if __name__ == "__main__":
    pull_all_world_bank_data()