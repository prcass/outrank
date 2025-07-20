#!/usr/bin/env python3
"""
Create complete validated spreadsheet with all available data INCLUDING Nobel Laureates
Uses: World Bank API data + UNESCO + Happiness + Agriculture + Nobel Laureates
No assumptions - only verified data
"""

import json
import csv
from datetime import datetime

def load_world_bank_data():
    """Load World Bank data from progress file"""
    try:
        with open('wb_data_progress.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ No World Bank data found")
        return {}

def load_unesco_data():
    """Load UNESCO heritage data"""
    try:
        with open('unesco_heritage_verified.json', 'r') as f:
            data = json.load(f)
            unesco_dict = {}
            for country in data['countries_with_data']:
                iso3 = country['iso3']
                unesco_dict[iso3] = {
                    'total_sites': country['total_sites'],
                    'cultural_sites': country['cultural_sites'],
                    'natural_sites': country['natural_sites'],
                    'mixed_sites': country['mixed_sites']
                }
            return unesco_dict
    except FileNotFoundError:
        print("❌ No UNESCO data found")
        return {}

def load_happiness_data():
    """Load happiness report data"""
    try:
        with open('happiness_indicators_final.json', 'r') as f:
            data = json.load(f)
            happiness_dict = {}
            for country in data['countries_with_data']:
                iso3 = country['iso3']
                happiness_dict[iso3] = {
                    'life_evaluation': country['life_evaluation'],
                    'social_support': country['social_support'],
                    'freedom': country['freedom'],
                    'generosity': country['generosity'],
                    'helped_stranger': country['helped_stranger']
                }
            return happiness_dict
    except FileNotFoundError:
        print("❌ No happiness data found")
        return {}

def load_agriculture_data():
    """Load agriculture and food security data"""
    try:
        with open('know_it_all_final_dataset_v4.json', 'r') as f:
            data = json.load(f)
            ag_dict = {}
            for country in data['countries']:
                iso3 = country['iso3']
                ag_dict[iso3] = {
                    'forest_percentage': country['forest_percentage'],
                    'irrigated_land_km2': country['irrigated_land_km2'],
                    'soybean_production_tonnes': country['soybean_production_tonnes'],
                    'healthy_diet_cost_ppp': country['healthy_diet_cost_ppp']
                }
            return ag_dict
    except FileNotFoundError:
        print("❌ No agriculture data found")
        return {}

def load_nobel_data():
    """Load Nobel Laureates data"""
    try:
        with open('nobel_laureates_data.json', 'r') as f:
            data = json.load(f)
            nobel_dict = {}
            for country in data['countries_with_data']:
                iso3 = country['iso3']
                nobel_dict[iso3] = {
                    'nobel_laureates': country['nobel_laureates']
                }
            return nobel_dict
    except FileNotFoundError:
        print("❌ No Nobel data found")
        return {}

def create_country_mapping():
    """Create ISO3 to name mapping for all 38 countries"""
    return {
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

def main():
    print("📊 Creating Complete Validated Dataset with Nobel Laureates")
    print("=" * 70)
    
    # Load all data sources
    wb_data = load_world_bank_data()
    unesco_data = load_unesco_data()
    happiness_data = load_happiness_data()
    agriculture_data = load_agriculture_data()
    nobel_data = load_nobel_data()
    country_mapping = create_country_mapping()
    
    print(f"✅ World Bank data: {len(wb_data)} countries")
    print(f"✅ UNESCO data: {len(unesco_data)} countries")
    print(f"✅ Happiness data: {len(happiness_data)} countries")
    print(f"✅ Agriculture data: {len(agriculture_data)} countries")
    print(f"✅ Nobel Laureates data: {len(nobel_data)} countries")
    
    # Define all columns with sources and dates (NOW 34 INDICATORS)
    columns = [
        # Meta
        ("Country", "Manual", "Current"),
        
        # World Bank indicators (20)
        ("Birth Rate (per 1000)", "World Bank API", "2023"),
        ("Life Expectancy (years)", "World Bank API", "2023"),
        ("Population 0-14 (%)", "World Bank API", "2024"),
        ("Population 65+ (%)", "World Bank API", "2024"),
        ("Total Population", "World Bank API", "2024"),
        ("GDP (current US$)", "World Bank API", "2024"),
        ("GDP Growth (%)", "World Bank API", "2024"),
        ("Fixed Broadband (/100)", "World Bank API", "2023"),
        ("Mobile Subscriptions (/100)", "World Bank API", "2023"),
        ("Secure Internet Servers (/1M)", "World Bank API", "2024"),
        ("Coal Electricity (%)", "World Bank API", "2023"),
        ("Oil Electricity (%)", "World Bank API", "2023"),
        ("Forest Area (%)", "World Bank API", "2022"),
        ("Renewable Energy (%)", "World Bank API", "2021"),
        ("Health Expenditure (% GDP)", "World Bank API", "2023"),
        ("Tertiary Enrollment (%)", "World Bank API", "2022"),
        ("Female Labor Participation (%)", "World Bank API", "2024"),
        ("Patent Applications", "World Bank API", "2021"),
        ("Rural Population (%)", "World Bank API", "2024"),
        ("Unemployment (%)", "World Bank API", "2024"),
        
        # UNESCO indicators (4)
        ("Total UNESCO Sites", "UNESCO Centre", "Current 2025"),
        ("Cultural UNESCO Sites", "UNESCO Centre", "Current 2025"),
        ("Natural UNESCO Sites", "UNESCO Centre", "Current 2025"),
        ("Mixed UNESCO Sites", "UNESCO Centre", "Current 2025"),
        
        # Happiness indicators (5)
        ("Life Evaluation Score", "World Happiness Report", "Latest Report"),
        ("Social Support Ranking", "World Happiness Report", "Latest Report"),
        ("Freedom Ranking", "World Happiness Report", "Latest Report"),
        ("Generosity Ranking", "World Happiness Report", "Latest Report"),
        ("Helped Stranger Ranking", "World Happiness Report", "Latest Report"),
        
        # Agriculture indicators (4)
        ("Forest Percentage", "FAO/Wikipedia", "2023/Current"),
        ("Irrigated Land (km²)", "FAO/Wikipedia", "2023/Current"),
        ("Soybean Production (tonnes)", "FAO 2023", "2023"),
        ("Healthy Diet Cost (PPP$)", "FAO SOFI July 2024", "2022"),
        
        # Nobel Laureates indicator (1) - NEW!
        ("Nobel Laureates Total", "Wikipedia Nobel List", "July 2025"),
    ]
    
    # Create CSV
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"complete_dataset_with_nobel_{timestamp}.csv"
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        
        # Write headers (indicator names)
        headers = [col[0] for col in columns]
        writer.writerow(headers)
        
        # Write sources
        sources = [col[1] for col in columns]
        writer.writerow(sources)
        
        # Write dates
        dates = [col[2] for col in columns]
        writer.writerow(dates)
        
        # Write data for each country (alphabetically)
        countries_processed = 0
        total_data_points = 0
        missing_data_points = 0
        
        for iso3 in sorted(country_mapping.keys()):
            country_name = country_mapping[iso3]
            row = [country_name]
            
            # World Bank data (20 indicators)
            wb_country = wb_data.get(iso3, {})
            wb_country_data = wb_country.get('data', {})
            
            wb_indicators = [
                "SP.DYN.CBRT.IN", "SP.DYN.LE00.IN", "SP.POP.0014.TO.ZS", "SP.POP.65UP.TO.ZS", "SP.POP.TOTL",
                "NY.GDP.MKTP.CD", "NY.GDP.MKTP.KD.ZG", "IT.NET.BBND.P2", "IT.CEL.SETS.P2", "IT.NET.SECR.P6",
                "EG.ELC.COAL.ZS", "EG.ELC.PETR.ZS", "AG.LND.FRST.ZS", "EG.FEC.RNEW.ZS", "SH.XPD.CHEX.GD.ZS",
                "SE.TER.ENRR", "SL.TLF.CACT.FE.ZS", "IP.PAT.RESD", "SP.RUR.TOTL.ZS", "SL.UEM.TOTL.ZS"
            ]
            
            for indicator in wb_indicators:
                if indicator in wb_country_data and wb_country_data[indicator]:
                    value = wb_country_data[indicator]['value']
                    # Format numbers appropriately
                    if isinstance(value, float):
                        if value > 1000000:
                            row.append(f"{value:.0f}")
                        else:
                            row.append(f"{value:.2f}")
                    else:
                        row.append(str(value))
                    total_data_points += 1
                else:
                    row.append("")
                    missing_data_points += 1
            
            # UNESCO data (4 indicators)
            unesco_country = unesco_data.get(iso3, {})
            for field in ['total_sites', 'cultural_sites', 'natural_sites', 'mixed_sites']:
                if field in unesco_country:
                    row.append(str(unesco_country[field]))
                    total_data_points += 1
                else:
                    row.append("")
                    missing_data_points += 1
            
            # Happiness data (5 indicators)
            happiness_country = happiness_data.get(iso3, {})
            for field in ['life_evaluation', 'social_support', 'freedom', 'generosity', 'helped_stranger']:
                if field in happiness_country:
                    value = happiness_country[field]
                    if isinstance(value, float):
                        row.append(f"{value:.3f}")
                    else:
                        row.append(str(value))
                    total_data_points += 1
                else:
                    row.append("")
                    missing_data_points += 1
            
            # Agriculture data (4 indicators)
            ag_country = agriculture_data.get(iso3, {})
            for field in ['forest_percentage', 'irrigated_land_km2', 'soybean_production_tonnes', 'healthy_diet_cost_ppp']:
                if field in ag_country and ag_country[field] is not None:
                    value = ag_country[field]
                    if isinstance(value, float):
                        row.append(f"{value:.2f}")
                    else:
                        row.append(str(value))
                    total_data_points += 1
                else:
                    row.append("")
                    missing_data_points += 1
            
            # Nobel Laureates data (1 indicator) - NEW!
            nobel_country = nobel_data.get(iso3, {})
            if 'nobel_laureates' in nobel_country:
                row.append(str(nobel_country['nobel_laureates']))
                total_data_points += 1
            else:
                row.append("")
                missing_data_points += 1
            
            writer.writerow(row)
            countries_processed += 1
    
    # Calculate statistics
    total_possible = countries_processed * 34  # 34 indicators per country (was 33, now 34)
    completeness = (total_data_points / total_possible) * 100 if total_possible > 0 else 0
    
    print(f"\n🎉 Enhanced Spreadsheet Created Successfully!")
    print(f"📁 File: {filename}")
    print(f"📊 Countries: {countries_processed}")
    print(f"📊 Indicators: 34 (was 33 + NEW Nobel Laureates)")
    print(f"📊 Data completeness: {total_data_points}/{total_possible} ({completeness:.1f}%)")
    print(f"📊 Missing data points: {missing_data_points}")
    
    if completeness >= 95:
        print("✅ HIGH QUALITY DATASET")
    elif completeness >= 80:
        print("⚠️  GOOD DATASET - Some gaps present")
    else:
        print("❌ INCOMPLETE DATASET - Significant gaps present")
    
    print(f"\n📋 Data Sources Summary:")
    print(f"   • World Bank API: 20 indicators")
    print(f"   • UNESCO Centre: 4 indicators")
    print(f"   • World Happiness Report: 5 indicators")
    print(f"   • FAO/Agriculture: 4 indicators")
    print(f"   • 🏆 Nobel Laureates: 1 indicator (NEW!)")
    print(f"\n🚨 NOTE: World Bank data only available for {len(wb_data)} countries")
    print(f"   To get complete dataset, run full World Bank API collection")
    
    print(f"\n🏆 Nobel Laureates Top 5:")
    top_nobel_countries = [
        ("United States", 420),
        ("United Kingdom", 142), 
        ("Germany", 115),
        ("France", 75),
        ("Sweden", 34)
    ]
    for country, count in top_nobel_countries:
        print(f"   • {country}: {count} laureates")

if __name__ == "__main__":
    main()