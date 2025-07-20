#!/usr/bin/env python3
"""
Quick Missing Count: Simple count of missing indicators per country
Focus on speed rather than detailed analysis
"""

import urllib.request
import json
import time

def quick_test(country_iso3, indicator_code):
    """Quick test - just return True/False"""
    url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator_code}"
    params = "?format=json&date=2022:2024&per_page=1"
    
    try:
        with urllib.request.urlopen(url + params, timeout=3) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1] and data[1][0]["value"] is not None:
            return True
        return False
        
    except:
        return False

def main():
    print("⚡ QUICK MISSING COUNT: All 40 Countries")
    print("=" * 50)
    
    # Load countries
    with open('quick_dataset_selection.json', 'r') as f:
        selection = json.load(f)
    
    countries = [(c["iso3"], c["name"]) for c in selection["selected_countries"]]
    
    # Key indicators that are most likely to have data
    key_indicators = [
        "SP.POP.TOTL",       # Population
        "NY.GDP.PCAP.CD",    # GDP per capita
        "SP.DYN.LE00.IN",    # Life expectancy
        "IT.NET.USER.ZS",    # Internet users
        "SL.TLF.CACT.FE.ZS", # Female labor
        "SH.DYN.MORT",       # Child mortality
        "SP.URB.TOTL.IN.ZS", # Urban population
        "SL.UEM.TOTL.ZS",    # Unemployment
        "IT.CEL.SETS.P2",    # Mobile subscriptions
        "AG.LND.FRST.ZS",    # Forest area
        "SH.STA.OWGH.ZS",    # Overweight
        "EN.ATM.CO2E.PC",    # CO2 emissions
        "ST.INT.ARVL",       # Tourist arrivals
        "FP.CPI.TOTL.ZG",    # Inflation
        "SP.POP.65UP.TO.ZS"  # Elderly population
    ]
    
    print(f"Testing {len(countries)} countries with {len(key_indicators)} key indicators")
    print("(Sampling approach for speed)\n")
    
    results = []
    
    for i, (iso3, country_name) in enumerate(countries, 1):
        print(f"{i:2d}/40 {country_name:25} ({iso3})...", end=" ")
        
        available = 0
        for indicator in key_indicators:
            if quick_test(iso3, indicator):
                available += 1
            time.sleep(0.02)  # Minimal delay
        
        missing = len(key_indicators) - available
        coverage = (available / len(key_indicators)) * 100
        
        # Estimate missing out of 40 based on sample
        estimated_missing_40 = round((missing / len(key_indicators)) * 40)
        
        results.append({
            "rank": i,
            "iso3": iso3,
            "name": country_name,
            "sample_available": available,
            "sample_missing": missing,
            "sample_coverage": coverage,
            "estimated_missing_40": estimated_missing_40
        })
        
        print(f"{available:2d}/{len(key_indicators)} = {coverage:3.0f}% (Est. {estimated_missing_40}/40 missing)")
    
    print(f"\n📊 SUMMARY TABLE: Estimated Missing Variables per Country")
    print("=" * 65)
    print("Rank | Country                 | Code | Coverage | Est Missing/40")
    print("-" * 65)
    
    # Sort by estimated missing (ascending)
    results.sort(key=lambda x: x["estimated_missing_40"])
    
    for i, result in enumerate(results, 1):
        print(f"{i:2d}   | {result['name']:23} | {result['iso3']} | {result['sample_coverage']:6.0f}%  | {result['estimated_missing_40']:2d}/40")
    
    # Save simple summary
    with open('missing_count_summary.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Quick analysis complete!")
    print(f"📁 Results saved to: missing_count_summary.json")
    
    print(f"\n💡 Key Findings:")
    best_coverage = min([r["estimated_missing_40"] for r in results])
    worst_coverage = max([r["estimated_missing_40"] for r in results])
    avg_missing = sum([r["estimated_missing_40"] for r in results]) / len(results)
    
    print(f"  • Best country missing: ~{best_coverage}/40 indicators")
    print(f"  • Worst country missing: ~{worst_coverage}/40 indicators") 
    print(f"  • Average missing: ~{avg_missing:.0f}/40 indicators")
    print(f"  • Overall estimated coverage: {((40-avg_missing)/40*100):.0f}%")

if __name__ == "__main__":
    main()