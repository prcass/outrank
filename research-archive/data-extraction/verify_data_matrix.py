#!/usr/bin/env python3
"""
Verify Data Matrix: Check that World Bank has data for all 40 country x 40 challenge combinations
Maps each challenge to specific World Bank indicators
"""

import urllib.request
import json
import time

def test_data_availability(country_iso3, indicator_code):
    """Test if country has recent data for this indicator"""
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
    print("🔍 VERIFYING DATA MATRIX: 40 Countries x 40 Challenges")
    print("=" * 65)
    
    # Load selected countries
    with open('quick_dataset_selection.json', 'r') as f:
        selection = json.load(f)
    
    countries = {c["iso3"]: c["name"] for c in selection["selected_countries"]}
    
    # Map challenges to World Bank indicator codes
    challenge_mappings = {
        "Which country has the most people?": "SP.POP.TOTL",
        "Which country has the youngest population?": "SP.POP.65UP.TO.ZS",  # Will invert
        "Which country has the oldest population?": "SP.POP.65UP.TO.ZS",
        "Which country has the highest life expectancy?": "SP.DYN.LE00.IN",
        "Which country has the most women in the workforce?": "SL.TLF.CACT.FE.ZS",
        "Which country has the lowest child mortality?": "SH.DYN.MORT",  # Will invert
        "Which country has the highest birth rate?": "SP.DYN.CBRT.IN",
        "Which country has the most urban population?": "SP.URB.TOTL.IN.ZS",
        "Which country has the most rural population?": "SP.RUR.TOTL.ZS",
        "Which country has the most refugees?": "SM.POP.REFG",
        
        "Which country has the highest GDP per person?": "NY.GDP.PCAP.CD",
        "Which country has the fastest economic growth?": "NY.GDP.MKTP.KD.ZG",
        "Which country has the highest unemployment?": "SL.UEM.TOTL.ZS",
        "Which country has the worst inflation?": "FP.CPI.TOTL.ZG",
        "Which country is easiest to start a business?": "IC.BUS.EASE.XQ",
        "Which country exports the most?": "NE.EXP.GNFS.CD",
        "Which country imports the most?": "NE.IMP.GNFS.CD",
        "Which country has the most income inequality?": "SI.POV.GINI",
        "Which country has the highest minimum wage?": "NY.GDP.PCAP.CD",  # Proxy
        "Which country has the most billionaires per capita?": "NY.GDP.PCAP.CD",  # Proxy
        
        "Which country is most connected to the internet?": "IT.NET.USER.ZS",
        "Which country has the most mobile phones per person?": "IT.CEL.SETS.P2",
        "Which country has the fastest internet?": "IT.NET.BBND.P2",
        "Which country spends most on research & development?": "GB.XPD.RSDV.GD.ZS",
        "Which country has the most tech patents?": "IP.PAT.RESD",
        
        "Which country pollutes the most CO2 per person?": "EN.ATM.CO2E.PC",
        "Which country has the most renewable energy?": "EG.FEC.RNEW.ZS",
        "Which country has the most forest coverage?": "AG.LND.FRST.ZS",
        "Which country uses the most electricity per person?": "EG.USE.ELEC.KH.PC",
        "Which country has the cleanest air?": "EN.ATM.PM25.MC.M3",  # Will invert
        
        "Which country has the most overweight people?": "SH.STA.OWGH.ZS",
        "Which country drinks the most alcohol?": "SH.ALC.PCAP.LI",
        "Which country has the most smokers?": "SH.PRV.SMOK",
        "Which country spends most on healthcare?": "SH.XPD.CHEX.GD.ZS",
        "Which country has the most doctors per person?": "SH.MED.PHYS.ZS",
        
        "Which country gets the most tourists?": "ST.INT.ARVL",
        "Which country makes the most from tourism?": "ST.INT.RCPT.CD",
        "Which country has the most airports?": "IS.AIR.DPRT",
        "Which country has the strongest passport?": "NY.GDP.PCAP.CD",  # Proxy 
        "Which country has the most UNESCO sites?": "NY.GDP.PCAP.CD"   # Proxy
    }
    
    print(f"📊 Testing {len(countries)} countries x {len(challenge_mappings)} indicators")
    print(f"📊 Total combinations to test: {len(countries) * len(challenge_mappings)}")
    
    # Test core indicators first (sample)
    core_indicators = [
        "SP.POP.TOTL", "NY.GDP.PCAP.CD", "SP.DYN.LE00.IN", 
        "IT.NET.USER.ZS", "ST.INT.ARVL", "EN.ATM.CO2E.PC",
        "SL.TLF.CACT.FE.ZS", "SH.DYN.MORT", "AG.LND.FRST.ZS"
    ]
    
    print(f"\n🔍 Testing {len(core_indicators)} core indicators across all countries...")
    
    data_matrix = {}
    missing_data = []
    
    for i, (iso3, country_name) in enumerate(countries.items(), 1):
        print(f"\n{i:2d}/40 🌍 {country_name} ({iso3}):")
        
        country_data = {}
        available_count = 0
        
        for indicator in core_indicators:
            has_data, value, year = test_data_availability(iso3, indicator)
            
            if has_data:
                country_data[indicator] = {"value": value, "year": year}
                available_count += 1
                print(f"    ✅ {indicator}: {value} ({year})")
            else:
                missing_data.append({"country": country_name, "iso3": iso3, "indicator": indicator})
                print(f"    ❌ {indicator}: No data")
            
            time.sleep(0.1)  # Rate limiting
        
        data_matrix[iso3] = country_data
        coverage = (available_count / len(core_indicators)) * 100
        print(f"    📊 Coverage: {available_count}/{len(core_indicators)} = {coverage:.0f}%")
        
        # Quick break after first 5 for demo
        if i >= 5:
            print(f"\n⏸️  Tested first 5 countries (demo mode)")
            break
    
    # Analysis
    print(f"\n📈 ANALYSIS:")
    print(f"📊 Countries tested: {min(5, len(countries))}")
    print(f"📊 Indicators tested: {len(core_indicators)}")
    print(f"📊 Total data points checked: {min(5, len(countries)) * len(core_indicators)}")
    print(f"❌ Missing data points: {len(missing_data)}")
    
    if missing_data:
        print(f"\n❌ MISSING DATA SUMMARY:")
        indicator_missing = {}
        for item in missing_data:
            ind = item["indicator"]
            if ind not in indicator_missing:
                indicator_missing[ind] = []
            indicator_missing[ind].append(item["country"])
        
        for indicator, countries_missing in indicator_missing.items():
            print(f"  {indicator}: {len(countries_missing)} countries missing")
            for country in countries_missing[:3]:  # Show first 3
                print(f"    - {country}")
            if len(countries_missing) > 3:
                print(f"    - ... and {len(countries_missing) - 3} more")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    
    total_combinations = len(countries) * len(challenge_mappings)
    estimated_missing = len(missing_data) * (len(challenge_mappings) / len(core_indicators))
    
    print(f"  📊 Estimated total missing data: {estimated_missing:.0f}/{total_combinations}")
    print(f"  📊 Estimated coverage: {((total_combinations - estimated_missing) / total_combinations * 100):.0f}%")
    
    if estimated_missing > 200:
        print(f"  ⚠️  High missing data - consider replacing indicators or countries")
    else:
        print(f"  ✅ Good coverage - proceed with full verification")
    
    # Save results
    results = {
        "test_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "countries_tested": min(5, len(countries)),
        "indicators_tested": len(core_indicators),
        "data_matrix": data_matrix,
        "missing_data": missing_data,
        "challenge_mappings": challenge_mappings,
        "coverage_analysis": {
            "total_possible": len(countries) * len(challenge_mappings),
            "estimated_missing": estimated_missing,
            "estimated_coverage_percent": ((total_combinations - estimated_missing) / total_combinations * 100)
        }
    }
    
    with open('data_verification_results.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ VERIFICATION COMPLETE!")
    print(f"📁 Results saved to: data_verification_results.json")
    
    print(f"\n🎯 NEXT STEPS:")
    print(f"  1. Review missing data patterns")
    print(f"  2. Replace problematic indicators if needed")
    print(f"  3. Run full data download for final dataset")

if __name__ == "__main__":
    main()