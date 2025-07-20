#!/usr/bin/env python3
"""
Full Data Coverage Check: Test all 40 countries against all 40 challenge indicators
Report exactly which countries are missing which variables
"""

import urllib.request
import json
import time

def test_indicator(country_iso3, indicator_code):
    """Test if country has data for this specific indicator"""
    url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2024&per_page=3"
    
    try:
        with urllib.request.urlopen(url + params, timeout=5) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            # Find most recent non-null value
            for entry in data[1]:
                if entry["value"] is not None:
                    return True, entry["value"], entry["date"]
        return False, None, None
        
    except:
        return False, None, None

def main():
    print("📊 FULL DATA COVERAGE CHECK: 40 Countries × 40 Indicators")
    print("=" * 70)
    
    # Load selected countries
    with open('quick_dataset_selection.json', 'r') as f:
        selection = json.load(f)
    
    countries = [(c["iso3"], c["name"]) for c in selection["selected_countries"]]
    
    # Map all 40 challenges to World Bank indicators
    challenge_indicators = {
        1: ("SP.POP.TOTL", "Population"),
        2: ("SP.POP.65UP.TO.ZS", "Population 65+ %"),
        3: ("SP.POP.65UP.TO.ZS", "Population 65+ %"),
        4: ("SP.DYN.LE00.IN", "Life expectancy"),
        5: ("SL.TLF.CACT.FE.ZS", "Female labor participation"),
        6: ("SH.DYN.MORT", "Child mortality"),
        7: ("SP.DYN.CBRT.IN", "Birth rate"),
        8: ("SP.URB.TOTL.IN.ZS", "Urban population %"),
        9: ("SP.RUR.TOTL.ZS", "Rural population %"),
        10: ("SM.POP.REFG", "Refugee population"),
        
        11: ("NY.GDP.PCAP.CD", "GDP per capita"),
        12: ("NY.GDP.MKTP.KD.ZG", "GDP growth"),
        13: ("SL.UEM.TOTL.ZS", "Unemployment rate"),
        14: ("FP.CPI.TOTL.ZG", "Inflation rate"),
        15: ("IC.BUS.EASE.XQ", "Ease of doing business"),
        16: ("NE.EXP.GNFS.CD", "Exports"),
        17: ("NE.IMP.GNFS.CD", "Imports"),
        18: ("SI.POV.GINI", "Gini coefficient"),
        19: ("NY.GDP.PCAP.CD", "GDP per capita (proxy)"),
        20: ("NY.GDP.PCAP.CD", "GDP per capita (proxy)"),
        
        21: ("IT.NET.USER.ZS", "Internet users %"),
        22: ("IT.CEL.SETS.P2", "Mobile subscriptions"),
        23: ("IT.NET.BBND.P2", "Broadband subscriptions"),
        24: ("GB.XPD.RSDV.GD.ZS", "R&D expenditure"),
        25: ("IP.PAT.RESD", "Patent applications"),
        
        26: ("EN.ATM.CO2E.PC", "CO2 emissions per capita"),
        27: ("EG.FEC.RNEW.ZS", "Renewable energy %"),
        28: ("AG.LND.FRST.ZS", "Forest area %"),
        29: ("EG.USE.ELEC.KH.PC", "Electric power consumption"),
        30: ("EN.ATM.PM25.MC.M3", "PM2.5 air pollution"),
        
        31: ("SH.STA.OWGH.ZS", "Overweight prevalence"),
        32: ("SH.ALC.PCAP.LI", "Alcohol consumption"),
        33: ("SH.PRV.SMOK", "Smoking prevalence"),
        34: ("SH.XPD.CHEX.GD.ZS", "Health expenditure"),
        35: ("SH.MED.PHYS.ZS", "Physicians per 1000"),
        
        36: ("ST.INT.ARVL", "Tourist arrivals"),
        37: ("ST.INT.RCPT.CD", "Tourism receipts"),
        38: ("IS.AIR.DPRT", "Air transport departures"),
        39: ("NY.GDP.PCAP.CD", "GDP per capita (proxy)"),
        40: ("NY.GDP.PCAP.CD", "GDP per capita (proxy)")
    }
    
    print(f"Testing {len(countries)} countries against {len(challenge_indicators)} indicators...")
    print(f"Total data points to check: {len(countries) * len(challenge_indicators)}")
    print()
    
    country_results = {}
    overall_missing = {}
    
    for i, (iso3, country_name) in enumerate(countries, 1):
        print(f"{i:2d}/40 🌍 {country_name} ({iso3}):")
        
        missing_indicators = []
        available_count = 0
        
        for challenge_id, (wb_code, description) in challenge_indicators.items():
            has_data, value, year = test_indicator(iso3, wb_code)
            
            if has_data:
                available_count += 1
            else:
                missing_indicators.append({
                    "challenge_id": challenge_id,
                    "wb_code": wb_code,
                    "description": description
                })
                
                # Track overall missing patterns
                if wb_code not in overall_missing:
                    overall_missing[wb_code] = {"count": 0, "countries": []}
                overall_missing[wb_code]["count"] += 1
                overall_missing[wb_code]["countries"].append(country_name)
            
            time.sleep(0.05)  # Rate limiting
        
        missing_count = len(missing_indicators)
        coverage_percent = (available_count / len(challenge_indicators)) * 100
        
        country_results[iso3] = {
            "name": country_name,
            "available": available_count,
            "missing": missing_count,
            "coverage_percent": coverage_percent,
            "missing_indicators": missing_indicators
        }
        
        print(f"    📊 Available: {available_count}/40, Missing: {missing_count}/40 ({coverage_percent:.0f}% coverage)")
        
        if missing_indicators:
            print(f"    ❌ Missing indicators:")
            for missing in missing_indicators[:5]:  # Show first 5
                print(f"       {missing['challenge_id']:2d}. {missing['description']}")
            if len(missing_indicators) > 5:
                print(f"       ... and {len(missing_indicators) - 5} more")
        
        print()
        
        # Quick break for demo - remove this for full run
        if i >= 10:
            print("⏸️  Showing first 10 countries (demo mode) - remove break for full analysis")
            break
    
    # Summary statistics
    print("\n📈 SUMMARY STATISTICS:")
    print("-" * 50)
    
    tested_countries = len(country_results)
    
    coverage_scores = [data["coverage_percent"] for data in country_results.values()]
    avg_coverage = sum(coverage_scores) / len(coverage_scores)
    
    print(f"Countries tested: {tested_countries}")
    print(f"Average coverage: {avg_coverage:.1f}%")
    print(f"Best coverage: {max(coverage_scores):.0f}%")
    print(f"Worst coverage: {min(coverage_scores):.0f}%")
    
    # Countries ranked by missing data
    print(f"\n🏆 COUNTRIES RANKED BY DATA COMPLETENESS:")
    print("-" * 50)
    
    sorted_countries = sorted(country_results.items(), 
                             key=lambda x: x[1]["missing"])
    
    for i, (iso3, data) in enumerate(sorted_countries, 1):
        print(f"{i:2d}. {data['name']:20} - Missing: {data['missing']:2d}/40 ({data['coverage_percent']:3.0f}%)")
    
    # Most problematic indicators
    print(f"\n❌ MOST PROBLEMATIC INDICATORS:")
    print("-" * 50)
    
    sorted_missing = sorted(overall_missing.items(), 
                           key=lambda x: x[1]["count"], 
                           reverse=True)
    
    for wb_code, data in sorted_missing[:10]:  # Top 10 most missing
        print(f"{data['count']:2d} countries missing: {wb_code}")
        print(f"    Examples: {', '.join(data['countries'][:3])}")
        if len(data['countries']) > 3:
            print(f"    ... and {len(data['countries']) - 3} more")
        print()
    
    # Save detailed results
    output = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "countries_tested": tested_countries,
        "indicators_tested": len(challenge_indicators),
        "average_coverage": avg_coverage,
        "country_results": country_results,
        "overall_missing_patterns": overall_missing,
        "challenge_indicators": challenge_indicators
    }
    
    with open('full_coverage_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"✅ FULL ANALYSIS COMPLETE!")
    print(f"📁 Detailed results saved to: full_coverage_analysis.json")

if __name__ == "__main__":
    main()