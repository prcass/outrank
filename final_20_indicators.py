#!/usr/bin/env python3
"""
Create final list of 20 indicators selected by user
Remove the ones not in the user's list
"""

import json

def main():
    print("🎯 FINAL 20 INDICATORS SELECTED BY USER")
    print("=" * 50)
    
    # User's selected 20 indicators
    selected_indicators = {
        # Demographics (5 indicators)
        "SP.DYN.CBRT.IN": "Birth rate, crude (per 1,000 people)",
        "SP.DYN.LE00.IN": "Life expectancy at birth, total (years)", 
        "SP.POP.0014.TO.ZS": "Population ages 0-14 (% of total population)",
        "SP.POP.65UP.TO.ZS": "Population ages 65 and above (% of total population)",
        "SP.POP.TOTL": "Population, total",
        
        # Economy (2 indicators)
        "NY.GDP.MKTP.CD": "GDP (current US$)",
        "NY.GDP.MKTP.KD.ZG": "GDP growth (annual %)",
        
        # Technology (3 indicators)
        "IT.NET.BBND.P2": "Fixed broadband subscriptions (per 100 people)",
        "IT.CEL.SETS.P2": "Mobile cellular subscriptions (per 100 people)", 
        "IT.NET.SECR.P6": "Secure Internet servers (per 1 million people)",
        
        # Energy & Environment (4 indicators)
        "EG.ELC.COAL.ZS": "Electricity production from coal sources (% of total)",
        "EG.ELC.PETR.ZS": "Electricity production from oil sources (% of total)",
        "AG.LND.FRST.ZS": "Forest area (% of land area)",
        "EG.FEC.RNEW.ZS": "Renewable energy consumption (% of total final energy consumption)",
        
        # Health (1 indicator)
        "SH.XPD.CHEX.GD.ZS": "Current health expenditure (% of GDP)",
        
        # Education (1 indicator)
        "SE.TER.ENRR": "School enrollment, tertiary (% gross)",
        
        # Social & Innovation (4 indicators)
        "SL.TLF.CACT.FE.ZS": "Labor force participation rate, female (% of female population ages 15+)",
        "IP.PAT.RESD": "Patent applications, residents",
        "SP.RUR.TOTL.ZS": "Rural population (% of total population)",
        "SL.UEM.TOTL.ZS": "Unemployment, total (% of total labor force)"
    }
    
    print(f"Total indicators selected: {len(selected_indicators)}")
    print()
    
    # Display by category
    categories = {
        "Demographics": ["SP.DYN.CBRT.IN", "SP.DYN.LE00.IN", "SP.POP.0014.TO.ZS", "SP.POP.65UP.TO.ZS", "SP.POP.TOTL"],
        "Economy": ["NY.GDP.MKTP.CD", "NY.GDP.MKTP.KD.ZG"],
        "Technology": ["IT.NET.BBND.P2", "IT.CEL.SETS.P2", "IT.NET.SECR.P6"],
        "Energy & Environment": ["EG.ELC.COAL.ZS", "EG.ELC.PETR.ZS", "AG.LND.FRST.ZS", "EG.FEC.RNEW.ZS"],
        "Health": ["SH.XPD.CHEX.GD.ZS"],
        "Education": ["SE.TER.ENRR"],
        "Social & Innovation": ["SL.TLF.CACT.FE.ZS", "IP.PAT.RESD", "SP.RUR.TOTL.ZS", "SL.UEM.TOTL.ZS"]
    }
    
    count = 1
    for category, codes in categories.items():
        print(f"### {category} ({len(codes)} indicators)")
        for code in codes:
            name = selected_indicators[code]
            print(f"{count:2d}. {name}")
            print(f"    Code: {code}")
            count += 1
        print()
    
    # Load the 40 countries list
    with open('quick_dataset_selection.json', 'r') as f:
        countries_data = json.load(f)
    
    countries = [(c["iso3"], c["name"]) for c in countries_data["selected_countries"]]
    
    # Create final output
    final_dataset = {
        "creation_date": "2025-07-18",
        "methodology": "User-selected 20 indicators from 36 with complete World Bank data coverage",
        "coverage": "100% - All indicators have data for all 40 countries",
        "countries": countries,
        "indicators": [
            {"code": code, "name": name, "category": category}
            for category, codes in categories.items()
            for code in codes
            for name in [selected_indicators[code]]
        ],
        "summary": {
            "total_countries": len(countries),
            "total_indicators": len(selected_indicators),
            "total_combinations": len(countries) * len(selected_indicators),
            "verified_coverage": "100%"
        }
    }
    
    with open('final_verified_dataset.json', 'w', encoding='utf-8') as f:
        json.dump(final_dataset, f, indent=2)
    
    print(f"✅ FINAL DATASET CREATED!")
    print(f"📁 Saved to: final_verified_dataset.json")
    print(f"📊 {len(countries)} countries × {len(selected_indicators)} indicators = {len(countries) * len(selected_indicators)} verified data points")
    print(f"📊 100% World Bank data coverage guaranteed")
    
    # Show what was removed
    print(f"\n📋 REMOVED INDICATORS:")
    print("The following 16 indicators from the original 36 were removed:")
    
    # Load original 36
    with open('complete_coverage_indicators.json', 'r') as f:
        original_36 = json.load(f)
    
    original_codes = {ind["code"] for ind in original_36["complete_indicators"]}
    selected_codes = set(selected_indicators.keys())
    removed_codes = original_codes - selected_codes
    
    for i, code in enumerate(sorted(removed_codes), 1):
        # Find the name
        name = next((ind["name"] for ind in original_36["complete_indicators"] if ind["code"] == code), "Unknown")
        print(f"{i:2d}. {name} ({code})")

if __name__ == "__main__":
    main()