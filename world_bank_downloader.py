#!/usr/bin/env python3
"""
World Bank Data Downloader for Outrank Game
Downloads indicators for all countries used in the game

Features:
- Downloads data for 40 countries in the game
- Fetches multiple indicators per category
- Saves progress incrementally
- Handles API errors gracefully
- Creates CSV files ready for game data updates
"""

import requests
import pandas as pd
import time
import json
import os
from datetime import datetime

# Countries from the Outrank game (using ISO3 codes)
GAME_COUNTRIES = {
    "001": {"name": "United States", "iso3": "USA"},
    "002": {"name": "China", "iso3": "CHN"},
    "003": {"name": "Japan", "iso3": "JPN"},
    "004": {"name": "Germany", "iso3": "DEU"},
    "005": {"name": "United Kingdom", "iso3": "GBR"},
    "006": {"name": "France", "iso3": "FRA"},
    "007": {"name": "India", "iso3": "IND"},
    "008": {"name": "Italy", "iso3": "ITA"},
    "009": {"name": "Brazil", "iso3": "BRA"},
    "010": {"name": "Canada", "iso3": "CAN"},
    "011": {"name": "Russia", "iso3": "RUS"},
    "012": {"name": "South Korea", "iso3": "KOR"},
    "013": {"name": "Spain", "iso3": "ESP"},
    "014": {"name": "Australia", "iso3": "AUS"},
    "015": {"name": "Mexico", "iso3": "MEX"},
    "016": {"name": "Indonesia", "iso3": "IDN"},
    "017": {"name": "Netherlands", "iso3": "NLD"},
    "018": {"name": "Saudi Arabia", "iso3": "SAU"},
    "019": {"name": "Turkey", "iso3": "TUR"},
    "020": {"name": "Taiwan", "iso3": "TWN"},  # Note: May need special handling
    "021": {"name": "Belgium", "iso3": "BEL"},
    "022": {"name": "Argentina", "iso3": "ARG"},
    "023": {"name": "Thailand", "iso3": "THA"},
    "024": {"name": "Ireland", "iso3": "IRL"},
    "025": {"name": "Austria", "iso3": "AUT"},
    "026": {"name": "Nigeria", "iso3": "NGA"},
    "027": {"name": "Israel", "iso3": "ISR"},
    "028": {"name": "Norway", "iso3": "NOR"},
    "029": {"name": "United Arab Emirates", "iso3": "ARE"},
    "030": {"name": "Egypt", "iso3": "EGY"},
    "031": {"name": "South Africa", "iso3": "ZAF"},
    "032": {"name": "Philippines", "iso3": "PHL"},
    "033": {"name": "Bangladesh", "iso3": "BGD"},
    "034": {"name": "Vietnam", "iso3": "VNM"},
    "035": {"name": "Chile", "iso3": "CHL"},
    "036": {"name": "Finland", "iso3": "FIN"},
    "037": {"name": "Denmark", "iso3": "DNK"},
    "038": {"name": "Singapore", "iso3": "SGP"},
    "039": {"name": "New Zealand", "iso3": "NZL"},
    "040": {"name": "Switzerland", "iso3": "CHE"}
}

# Key indicators matching Outrank game prompts
INDICATORS = {
    "economy": {
        "NY.GDP.PCAP.CD": "GDP per capita (current US$)",
        "NY.GDP.MKTP.CD": "GDP (current US$)",
        "FP.CPI.TOTL.ZG": "Inflation, consumer prices (annual %)",
        "SL.UEM.TOTL.ZS": "Unemployment, total (% of total labor force)",
        "IC.BUS.EASE.XQ": "Ease of doing business score",
        "GC.DOD.TOTL.GD.ZS": "Central government debt, total (% of GDP)"
    },
    "demographics": {
        "SP.POP.TOTL": "Population, total",
        "SP.POP.GROW": "Population growth (annual %)",
        "SP.DYN.LE00.IN": "Life expectancy at birth, total (years)",
        "SP.DYN.TFRT.IN": "Fertility rate, total (births per woman)",
        "SP.URB.TOTL.IN.ZS": "Urban population (% of total population)",
        "SP.POP.DPND": "Age dependency ratio (% of working-age population)"
    },
    "health": {
        "SH.XPD.CHEX.PC.CD": "Current health expenditure per capita (current US$)",
        "SH.MED.BEDS.ZS": "Hospital beds (per 1,000 people)",
        "SH.MED.PHYS.ZS": "Physicians (per 1,000 people)",
        "SH.DYN.MORT": "Mortality rate, under-5 (per 1,000 live births)",
        "SH.PRV.SMOK": "Smoking prevalence, total (ages 15+)",
        "SH.STA.OWGH.ZS": "Prevalence of overweight (% of adults)"
    },
    "education": {
        "SE.ADT.LITR.ZS": "Literacy rate, adult total (% of people ages 15 and above)",
        "SE.TER.ENRR": "School enrollment, tertiary (% gross)",
        "SE.XPD.TOTL.GD.ZS": "Government expenditure on education, total (% of GDP)",
        "SE.PRM.CMPT.ZS": "Primary completion rate, total (% of relevant age group)",
        "SE.SEC.CMPT.LO.ZS": "Lower secondary completion rate, total (% of relevant age group)"
    },
    "technology": {
        "IT.NET.USER.ZS": "Individuals using the Internet (% of population)",
        "IT.CEL.SETS.P2": "Mobile cellular subscriptions (per 100 people)",
        "IT.NET.BBND.P2": "Fixed broadband subscriptions (per 100 people)",
        "IT.NET.SECR.P6": "Secure Internet servers (per 1 million people)",
        "IP.PAT.RESD": "Patent applications, residents"
    },
    "environment": {
        "EN.ATM.CO2E.PC": "CO2 emissions (metric tons per capita)",
        "EG.USE.PCAP.KG.OE": "Energy use (kg of oil equivalent per capita)",
        "EG.FEC.RNEW.ZS": "Renewable energy consumption (% of total final energy consumption)",
        "AG.LND.FRST.ZS": "Forest area (% of land area)",
        "EN.ATM.PM25.MC.M3": "PM2.5 air pollution, mean annual exposure"
    },
    "social": {
        "SI.POV.GINI": "Gini index",
        "SG.GEN.PARL.ZS": "Proportion of seats held by women in national parliaments (%)",
        "VC.IHR.PSRC.P5": "Intentional homicides (per 100,000 people)",
        "SE.ADT.1524.LT.ZS": "Literacy rate, youth total (% of people ages 15-24)",
        "SL.TLF.CACT.FE.ZS": "Labor force participation rate, female (% of female population ages 15+)"
    }
}

class WorldBankDownloader:
    def __init__(self):
        self.base_url = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}"
        self.results_dir = "world_bank_data"
        self.progress_file = "download_progress.json"
        self.create_output_dir()
        self.load_progress()
        
    def create_output_dir(self):
        """Create output directory if it doesn't exist"""
        if not os.path.exists(self.results_dir):
            os.makedirs(self.results_dir)
            
    def load_progress(self):
        """Load download progress from file"""
        if os.path.exists(self.progress_file):
            with open(self.progress_file, 'r') as f:
                self.progress = json.load(f)
        else:
            self.progress = {"completed": [], "failed": []}
            
    def save_progress(self):
        """Save download progress to file"""
        with open(self.progress_file, 'w') as f:
            json.dump(self.progress, f, indent=2)
            
    def get_indicator_data(self, country_iso3, indicator, max_retries=3):
        """Fetch data for a specific indicator and country"""
        url = self.base_url.format(country=country_iso3, indicator=indicator)
        params = {
            "format": "json",
            "date": "2015:2024",  # Last 10 years
            "per_page": 100
        }
        
        for attempt in range(max_retries):
            try:
                response = requests.get(url, params=params, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if len(data) > 1:  # First element is metadata
                        return data[1]  # Return actual data
                elif response.status_code == 429:  # Rate limit
                    time.sleep(5 * (attempt + 1))  # Exponential backoff
                    continue
            except Exception as e:
                print(f"Error fetching {indicator} for {country_iso3}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2)
                    
        return None
        
    def process_category(self, category_name, indicators):
        """Download all indicators for a category"""
        print(f"\n📊 Processing category: {category_name}")
        print(f"   Indicators: {len(indicators)}")
        
        category_data = []
        
        for game_code, country_info in GAME_COUNTRIES.items():
            country_name = country_info["name"]
            country_iso3 = country_info["iso3"]
            
            # Skip Taiwan for World Bank API (no data available)
            if country_iso3 == "TWN":
                print(f"   ⚠️  Skipping {country_name} (no World Bank data)")
                continue
                
            print(f"\n   🌍 Processing {country_name} ({country_iso3})")
            
            country_row = {
                "game_code": game_code,
                "country_name": country_name,
                "iso3": country_iso3
            }
            
            for indicator_code, indicator_name in indicators.items():
                progress_key = f"{country_iso3}_{indicator_code}"
                
                # Skip if already completed
                if progress_key in self.progress["completed"]:
                    print(f"      ✓ {indicator_name} (cached)")
                    continue
                    
                # Fetch data
                data = self.get_indicator_data(country_iso3, indicator_code)
                
                if data:
                    # Get most recent non-null value
                    latest_value = None
                    latest_year = None
                    
                    for entry in data:
                        if entry["value"] is not None:
                            latest_value = entry["value"]
                            latest_year = entry["date"]
                            break
                            
                    country_row[indicator_code] = latest_value
                    country_row[f"{indicator_code}_year"] = latest_year
                    
                    self.progress["completed"].append(progress_key)
                    print(f"      ✓ {indicator_name}: {latest_value} ({latest_year})")
                else:
                    country_row[indicator_code] = None
                    country_row[f"{indicator_code}_year"] = None
                    self.progress["failed"].append(progress_key)
                    print(f"      ✗ {indicator_name}: No data")
                    
                # Save progress after each indicator
                self.save_progress()
                
                # Rate limiting
                time.sleep(0.5)
                
            category_data.append(country_row)
            
        # Save category data to CSV
        df = pd.DataFrame(category_data)
        filename = os.path.join(self.results_dir, f"{category_name}_data.csv")
        df.to_csv(filename, index=False)
        print(f"\n✅ Saved {category_name} data to {filename}")
        
        return df
        
    def download_all(self):
        """Download all indicators for all categories"""
        print("🌍 World Bank Data Downloader for Outrank Game")
        print(f"📊 Categories: {len(INDICATORS)}")
        print(f"🌎 Countries: {len(GAME_COUNTRIES)}")
        
        start_time = datetime.now()
        all_data = {}
        
        for category_name, indicators in INDICATORS.items():
            category_df = self.process_category(category_name, indicators)
            all_data[category_name] = category_df
            
        # Create master file with all data
        self.create_master_file(all_data)
        
        end_time = datetime.now()
        duration = end_time - start_time
        
        print(f"\n✅ Download complete!")
        print(f"⏱️  Duration: {duration}")
        print(f"📁 Results saved in: {self.results_dir}/")
        
    def create_master_file(self, all_data):
        """Create a master CSV with all data combined"""
        # Start with country info
        master_df = pd.DataFrame([
            {
                "game_code": code,
                "country_name": info["name"],
                "iso3": info["iso3"]
            }
            for code, info in GAME_COUNTRIES.items()
        ])
        
        # Merge all category data
        for category_name, category_df in all_data.items():
            if not category_df.empty:
                # Remove duplicate columns
                merge_cols = [col for col in category_df.columns 
                             if col not in ["game_code", "country_name", "iso3"]]
                
                if merge_cols:
                    merge_df = category_df[["game_code"] + merge_cols]
                    master_df = master_df.merge(merge_df, on="game_code", how="left")
                    
        # Save master file
        master_file = os.path.join(self.results_dir, "world_bank_master_data.csv")
        master_df.to_csv(master_file, index=False)
        print(f"\n📊 Created master data file: {master_file}")
        
        # Create game-ready JSON format
        self.create_game_updates(master_df)
        
    def create_game_updates(self, master_df):
        """Create JSON file ready for game data updates"""
        updates = []
        
        for _, row in master_df.iterrows():
            if pd.isna(row["iso3"]) or row["iso3"] == "TWN":
                continue
                
            country_update = {
                "name": row["country_name"],
                "updates": {}
            }
            
            # Map World Bank indicators to game properties
            mappings = {
                "NY.GDP.PCAP.CD": "gdp_per_capita",
                "FP.CPI.TOTL.ZG": "inflation_rate",
                "SL.UEM.TOTL.ZS": "unemployment_rate",
                "SP.POP.TOTL": "population",
                "SP.DYN.LE00.IN": "life_expectancy",
                "SE.ADT.LITR.ZS": "literacy_rate",
                "IT.NET.USER.ZS": "internet_penetration",
                "EN.ATM.CO2E.PC": "carbon_footprint",
                "EG.FEC.RNEW.ZS": "renewable_energy_percent"
            }
            
            for wb_code, game_prop in mappings.items():
                if wb_code in row and not pd.isna(row[wb_code]):
                    country_update["updates"][game_prop] = round(float(row[wb_code]), 2)
                    
            if country_update["updates"]:  # Only add if there are updates
                updates.append(country_update)
                
        # Save as JSON for easy game updates
        updates_file = os.path.join(self.results_dir, "game_data_updates.json")
        with open(updates_file, 'w') as f:
            json.dump(updates, f, indent=2)
            
        print(f"🎮 Created game update file: {updates_file}")
        print(f"   Ready to use with precision_update.js!")

if __name__ == "__main__":
    downloader = WorldBankDownloader()
    downloader.download_all()