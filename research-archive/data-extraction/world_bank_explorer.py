#!/usr/bin/env python3
"""
World Bank Data Explorer
Interactive tool to explore and download specific datasets
"""

import requests
import pandas as pd
import json
import os
from datetime import datetime

class WorldBankExplorer:
    def __init__(self):
        self.base_url = "https://api.worldbank.org/v2"
        self.cache_dir = "world_bank_cache"
        if not os.path.exists(self.cache_dir):
            os.makedirs(self.cache_dir)
            
    def search_indicators(self, keyword):
        """Search for indicators by keyword"""
        print(f"\n🔍 Searching indicators for: '{keyword}'")
        
        url = f"{self.base_url}/indicator"
        params = {
            "format": "json",
            "per_page": 50,
            "source": 2  # World Development Indicators
        }
        
        results = []
        
        try:
            response = requests.get(url, params=params, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if len(data) > 1:
                    for indicator in data[1]:
                        if keyword.lower() in indicator["name"].lower() or \
                           keyword.lower() in indicator.get("sourceNote", "").lower():
                            results.append({
                                "id": indicator["id"],
                                "name": indicator["name"],
                                "unit": indicator.get("unit", ""),
                                "source": indicator["source"]["value"]
                            })
                            
            print(f"\nFound {len(results)} indicators:")
            for i, ind in enumerate(results[:20], 1):  # Show first 20
                print(f"{i}. [{ind['id']}] {ind['name']}")
                if ind['unit']:
                    print(f"   Unit: {ind['unit']}")
                    
            if len(results) > 20:
                print(f"\n... and {len(results) - 20} more results")
                
        except Exception as e:
            print(f"Error searching indicators: {e}")
            
        return results
        
    def get_popular_indicators(self):
        """Get list of most commonly used indicators"""
        popular = {
            "Economy": [
                ("NY.GDP.PCAP.CD", "GDP per capita (current US$)"),
                ("NY.GDP.MKTP.CD", "GDP (current US$)"),
                ("FP.CPI.TOTL.ZG", "Inflation, consumer prices (annual %)"),
                ("SL.UEM.TOTL.ZS", "Unemployment, total (% of total labor force)"),
                ("BX.KLT.DINV.WD.GD.ZS", "Foreign direct investment, net inflows (% of GDP)")
            ],
            "Demographics": [
                ("SP.POP.TOTL", "Population, total"),
                ("SP.DYN.LE00.IN", "Life expectancy at birth, total (years)"),
                ("SP.URB.TOTL.IN.ZS", "Urban population (% of total population)"),
                ("SP.POP.GROW", "Population growth (annual %)"),
                ("SP.DYN.TFRT.IN", "Fertility rate, total (births per woman)")
            ],
            "Health": [
                ("SH.XPD.CHEX.PC.CD", "Current health expenditure per capita (current US$)"),
                ("SH.XPD.CHEX.GD.ZS", "Current health expenditure (% of GDP)"),
                ("SH.MED.BEDS.ZS", "Hospital beds (per 1,000 people)"),
                ("SH.MED.PHYS.ZS", "Physicians (per 1,000 people)"),
                ("SH.DYN.MORT", "Mortality rate, under-5 (per 1,000 live births)")
            ],
            "Education": [
                ("SE.ADT.LITR.ZS", "Literacy rate, adult total (% of people ages 15 and above)"),
                ("SE.XPD.TOTL.GD.ZS", "Government expenditure on education, total (% of GDP)"),
                ("SE.ENR.PRSC.FM.ZS", "School enrollment, primary (gross), gender parity index (GPI)"),
                ("SE.TER.ENRR", "School enrollment, tertiary (% gross)"),
                ("SE.PRM.NENR", "School enrollment, primary (% net)")
            ],
            "Technology": [
                ("IT.NET.USER.ZS", "Individuals using the Internet (% of population)"),
                ("IT.CEL.SETS.P2", "Mobile cellular subscriptions (per 100 people)"),
                ("IT.NET.BBND.P2", "Fixed broadband subscriptions (per 100 people)"),
                ("IT.NET.SECR.P6", "Secure Internet servers (per 1 million people)"),
                ("IP.PAT.RESD", "Patent applications, residents")
            ],
            "Environment": [
                ("EN.ATM.CO2E.PC", "CO2 emissions (metric tons per capita)"),
                ("EG.FEC.RNEW.ZS", "Renewable energy consumption (% of total final energy consumption)"),
                ("AG.LND.FRST.ZS", "Forest area (% of land area)"),
                ("EN.ATM.PM25.MC.M3", "PM2.5 air pollution, mean annual exposure"),
                ("ER.H2O.FWTL.ZS", "Water stress level: freshwater withdrawal as a proportion of available freshwater resources")
            ]
        }
        
        return popular
        
    def download_indicator_data(self, indicator_id, countries=None, start_year=2010, end_year=2024):
        """Download data for a specific indicator"""
        if countries is None:
            # Default to major economies
            countries = ["USA", "CHN", "JPN", "DEU", "IND", "GBR", "FRA", "BRA", "ITA", "CAN"]
            
        print(f"\n📊 Downloading {indicator_id} for {len(countries)} countries...")
        
        all_data = []
        
        for country in countries:
            url = f"{self.base_url}/country/{country}/indicator/{indicator_id}"
            params = {
                "format": "json",
                "date": f"{start_year}:{end_year}",
                "per_page": 100
            }
            
            try:
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if len(data) > 1:
                        for entry in data[1]:
                            if entry["value"] is not None:
                                all_data.append({
                                    "country": entry["country"]["value"],
                                    "country_code": country,
                                    "year": int(entry["date"]),
                                    "value": float(entry["value"]),
                                    "indicator": indicator_id
                                })
                                
            except Exception as e:
                print(f"  Error fetching {country}: {e}")
                
        if all_data:
            # Convert to DataFrame
            df = pd.DataFrame(all_data)
            
            # Pivot for easier viewing
            pivot_df = df.pivot(index='country', columns='year', values='value')
            
            # Save to CSV
            filename = f"{self.cache_dir}/{indicator_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            pivot_df.to_csv(filename)
            
            print(f"\n✅ Downloaded {len(all_data)} data points")
            print(f"📁 Saved to: {filename}")
            
            # Show preview
            print("\nPreview:")
            print(pivot_df.head(10))
            
            return df
        else:
            print("❌ No data found")
            return None
            
    def get_all_countries(self):
        """Get list of all countries with their codes"""
        cache_file = f"{self.cache_dir}/countries_list.json"
        
        # Check cache first
        if os.path.exists(cache_file):
            with open(cache_file, 'r') as f:
                return json.load(f)
                
        print("📍 Fetching country list...")
        
        url = f"{self.base_url}/country"
        params = {
            "format": "json",
            "per_page": 500
        }
        
        countries = {}
        
        try:
            response = requests.get(url, params=params, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if len(data) > 1:
                    for country in data[1]:
                        # Skip aggregates
                        if country["capitalCity"]:
                            countries[country["id"]] = {
                                "name": country["name"],
                                "region": country["region"]["value"],
                                "income": country["incomeLevel"]["value"]
                            }
                            
            # Save to cache
            with open(cache_file, 'w') as f:
                json.dump(countries, f, indent=2)
                
            print(f"✓ Found {len(countries)} countries")
            
        except Exception as e:
            print(f"Error fetching countries: {e}")
            
        return countries
        
    def download_topic_data(self, topic_name, num_countries=50):
        """Download all indicators for a topic for top countries"""
        print(f"\n📚 Downloading {topic_name} data for top {num_countries} countries...")
        
        # Get popular indicators for the topic
        popular = self.get_popular_indicators()
        
        if topic_name not in popular:
            print(f"❌ Unknown topic. Available: {list(popular.keys())}")
            return
            
        # Get countries by GDP to find "top" countries
        gdp_indicator = "NY.GDP.MKTP.CD"
        countries = self.get_top_countries_by_gdp(num_countries)
        
        if not countries:
            print("❌ Could not determine top countries")
            return
            
        # Download each indicator
        all_data = {}
        
        for ind_id, ind_name in popular[topic_name]:
            print(f"\n📊 Downloading: {ind_name}")
            df = self.download_indicator_data(ind_id, countries)
            if df is not None:
                all_data[ind_id] = df
                
        # Save combined data
        if all_data:
            filename = f"{self.cache_dir}/{topic_name.lower()}_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
            
            with pd.ExcelWriter(filename) as writer:
                for ind_id, df in all_data.items():
                    # Create pivot table for each indicator
                    pivot = df.pivot(index='country', columns='year', values='value')
                    pivot.to_excel(writer, sheet_name=ind_id[:31])  # Excel sheet name limit
                    
            print(f"\n✅ All {topic_name} data saved to: {filename}")
            
    def get_top_countries_by_gdp(self, num_countries):
        """Get top N countries by GDP"""
        print("  Finding top countries by GDP...")
        
        # Major economies (fallback if API fails)
        major_economies = [
            "USA", "CHN", "JPN", "DEU", "IND", "GBR", "FRA", "ITA", "BRA", "CAN",
            "KOR", "ESP", "AUS", "RUS", "MEX", "IDN", "NLD", "SAU", "TUR", "CHE",
            "POL", "BEL", "ARG", "SWE", "IRL", "AUT", "NGA", "ISR", "ARE", "NOR",
            "EGY", "DNK", "SGP", "MYS", "PHL", "ZAF", "COL", "BGD", "VNM", "CHL",
            "FIN", "ROM", "CZE", "PRT", "IRQ", "PER", "GRC", "NZL", "QAT", "DZA"
        ]
        
        return major_economies[:num_countries]

def main():
    """Interactive main menu"""
    explorer = WorldBankExplorer()
    
    while True:
        print("\n" + "="*50)
        print("🌍 World Bank Data Explorer")
        print("="*50)
        print("\n1. Search indicators by keyword")
        print("2. Download popular indicator")
        print("3. Download complete topic data")
        print("4. Download custom indicator")
        print("5. List all countries")
        print("6. Exit")
        
        choice = input("\nEnter choice (1-6): ")
        
        if choice == "1":
            keyword = input("\nEnter search keyword: ")
            explorer.search_indicators(keyword)
            
        elif choice == "2":
            popular = explorer.get_popular_indicators()
            
            print("\nPopular Indicators by Category:")
            all_indicators = []
            
            for category, indicators in popular.items():
                print(f"\n{category}:")
                for i, (ind_id, ind_name) in enumerate(indicators, 1):
                    idx = len(all_indicators) + 1
                    all_indicators.append((ind_id, ind_name))
                    print(f"  {idx}. [{ind_id}] {ind_name}")
                    
            selection = int(input("\nSelect indicator number: ")) - 1
            if 0 <= selection < len(all_indicators):
                ind_id, ind_name = all_indicators[selection]
                explorer.download_indicator_data(ind_id)
                
        elif choice == "3":
            topics = list(explorer.get_popular_indicators().keys())
            
            print("\nAvailable Topics:")
            for i, topic in enumerate(topics, 1):
                print(f"{i}. {topic}")
                
            topic_num = int(input("\nSelect topic number: ")) - 1
            if 0 <= topic_num < len(topics):
                num_countries = int(input("Number of countries (default 50): ") or "50")
                explorer.download_topic_data(topics[topic_num], num_countries)
                
        elif choice == "4":
            ind_id = input("\nEnter indicator ID (e.g., NY.GDP.PCAP.CD): ")
            countries_input = input("Enter country codes separated by comma (or press Enter for defaults): ")
            
            if countries_input:
                countries = [c.strip() for c in countries_input.split(",")]
            else:
                countries = None
                
            start_year = int(input("Start year (default 2010): ") or "2010")
            end_year = int(input("End year (default 2024): ") or "2024")
            
            explorer.download_indicator_data(ind_id, countries, start_year, end_year)
            
        elif choice == "5":
            countries = explorer.get_all_countries()
            
            # Group by region
            by_region = {}
            for code, info in countries.items():
                region = info["region"]
                if region not in by_region:
                    by_region[region] = []
                by_region[region].append(f"{code}: {info['name']}")
                
            for region, country_list in sorted(by_region.items()):
                print(f"\n{region} ({len(country_list)} countries):")
                for country in sorted(country_list)[:5]:  # Show first 5
                    print(f"  {country}")
                if len(country_list) > 5:
                    print(f"  ... and {len(country_list) - 5} more")
                    
        elif choice == "6":
            print("\nExiting...")
            break
            
        else:
            print("\nInvalid choice")
            
        input("\nPress Enter to continue...")

if __name__ == "__main__":
    main()