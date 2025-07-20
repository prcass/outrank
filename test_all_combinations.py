#!/usr/bin/env python3
"""
Test ALL combinations: 40 countries × 50 verified World Bank indicators
This will take time but give exact data availability for every combination
"""

import urllib.request
import json
import time
from datetime import datetime

def test_country_indicator(country_iso3, indicator_code):
    """Test if specific country has data for specific indicator"""
    url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator_code}"
    params = "?format=json&date=2020:2024&per_page=5"
    
    try:
        with urllib.request.urlopen(url + params, timeout=5) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1 and data[1]:
            # Find most recent non-null value
            for entry in data[1]:
                if entry["value"] is not None:
                    return True, entry["value"], entry["date"]
        return False, None, None
        
    except Exception as e:
        return False, None, None

def main():
    print("🔬 TESTING ALL COMBINATIONS: 40 Countries × 50 Indicators")
    print("=" * 65)
    print("⚠️  This will take 15-20 minutes and make 2,000 API calls")
    print("📊 Testing every single country/indicator combination")
    print()
    
    # Load 40 countries
    with open('quick_dataset_selection.json', 'r') as f:
        selection = json.load(f)
    countries = [(c["iso3"], c["name"]) for c in selection["selected_countries"]]
    
    # Load 50 verified indicators
    with open('best_50_wb_indicators.json', 'r') as f:
        indicators_data = json.load(f)
    indicators = [(ind["id"], ind["name"]) for ind in indicators_data["best_50_indicators"]]
    
    print(f"Testing {len(countries)} countries × {len(indicators)} indicators = {len(countries) * len(indicators)} combinations")
    print()
    
    # Initialize results tracking
    results_matrix = {}
    country_missing_counts = {}
    indicator_missing_counts = {}
    total_combinations = len(countries) * len(indicators)
    total_available = 0
    total_missing = 0
    
    start_time = time.time()
    
    # Test each country
    for country_idx, (country_iso3, country_name) in enumerate(countries, 1):
        print(f"\n🌍 {country_idx:2d}/40 {country_name} ({country_iso3})")
        
        country_results = {}
        country_missing = 0
        country_available = 0
        
        # Test each indicator for this country
        for indicator_idx, (indicator_code, indicator_name) in enumerate(indicators, 1):
            print(f"  {indicator_idx:2d}/50 {indicator_code}...", end=" ")
            
            has_data, value, year = test_country_indicator(country_iso3, indicator_code)
            
            if has_data:
                country_results[indicator_code] = {
                    "available": True,
                    "value": value,
                    "year": year
                }
                country_available += 1
                total_available += 1
                print(f"✓ {year}")
            else:
                country_results[indicator_code] = {
                    "available": False,
                    "value": None,
                    "year": None
                }
                country_missing += 1
                total_missing += 1
                
                # Track which indicators are missing
                if indicator_code not in indicator_missing_counts:
                    indicator_missing_counts[indicator_code] = []
                indicator_missing_counts[indicator_code].append(country_name)
                
                print("❌")
            
            time.sleep(0.1)  # Rate limiting
        
        # Store country results
        results_matrix[country_iso3] = {
            "name": country_name,
            "available": country_available,
            "missing": country_missing,
            "coverage_percent": (country_available / len(indicators)) * 100,
            "indicator_results": country_results
        }
        
        country_missing_counts[country_iso3] = {
            "name": country_name,
            "missing": country_missing,
            "available": country_available,
            "coverage_percent": (country_available / len(indicators)) * 100
        }
        
        elapsed = time.time() - start_time
        estimated_total = (elapsed / country_idx) * len(countries)
        remaining = estimated_total - elapsed
        
        print(f"    📊 {country_name}: {country_available}/50 available, {country_missing}/50 missing ({(country_available/50)*100:.0f}% coverage)")
        print(f"    ⏱️  Elapsed: {elapsed/60:.1f}min, Estimated remaining: {remaining/60:.1f}min")
    
    # Final analysis
    total_time = time.time() - start_time
    overall_coverage = (total_available / total_combinations) * 100
    
    print(f"\n" + "="*80)
    print(f"📊 FINAL RESULTS - COMPLETE DATA MATRIX ANALYSIS")
    print(f"="*80)
    print(f"⏱️  Total time: {total_time/60:.1f} minutes")
    print(f"📊 Total combinations tested: {total_combinations:,}")
    print(f"✅ Data available: {total_available:,} ({overall_coverage:.1f}%)")
    print(f"❌ Data missing: {total_missing:,} ({100-overall_coverage:.1f}%)")
    
    print(f"\n🏆 COUNTRIES RANKED BY DATA AVAILABILITY:")
    print("-" * 60)
    sorted_countries = sorted(country_missing_counts.items(), key=lambda x: x[1]["missing"])
    
    for i, (iso3, data) in enumerate(sorted_countries, 1):
        print(f"{i:2d}. {data['name']:25} - {data['missing']:2d}/50 missing ({data['coverage_percent']:3.0f}%)")
    
    print(f"\n❌ INDICATORS WITH MOST MISSING DATA:")
    print("-" * 60)
    sorted_indicators = sorted(indicator_missing_counts.items(), key=lambda x: len(x[1]), reverse=True)
    
    for indicator_code, missing_countries in sorted_indicators[:20]:  # Top 20 most problematic
        indicator_name = next((ind[1] for ind in indicators if ind[0] == indicator_code), "Unknown")
        print(f"{len(missing_countries):2d}/40 missing: {indicator_code}")
        print(f"    {indicator_name[:70]}...")
        if len(missing_countries) <= 5:
            print(f"    Missing from: {', '.join(missing_countries)}")
        else:
            print(f"    Missing from: {', '.join(missing_countries[:3])} and {len(missing_countries)-3} more")
        print()
    
    # Save complete results
    output = {
        "test_date": datetime.now().isoformat(),
        "methodology": "Complete testing of all 40 countries × 50 verified World Bank indicators",
        "summary": {
            "total_combinations": total_combinations,
            "total_available": total_available,
            "total_missing": total_missing,
            "overall_coverage_percent": overall_coverage,
            "test_duration_minutes": total_time / 60
        },
        "countries": dict(sorted_countries),
        "indicators_missing_count": {k: len(v) for k, v in sorted_indicators},
        "complete_matrix": results_matrix,
        "indicators_tested": indicators,
        "countries_tested": countries
    }
    
    with open('complete_data_matrix_results.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"✅ COMPLETE ANALYSIS SAVED!")
    print(f"📁 Full results: complete_data_matrix_results.json")
    print(f"📊 Every country/indicator combination tested and recorded")
    
    # Final recommendations
    print(f"\n💡 RECOMMENDATIONS:")
    if overall_coverage >= 90:
        print(f"✅ Excellent coverage ({overall_coverage:.0f}%) - ready for implementation")
    elif overall_coverage >= 80:
        print(f"⚠️  Good coverage ({overall_coverage:.0f}%) - consider replacing worst indicators")
    elif overall_coverage >= 70:
        print(f"⚠️  Moderate coverage ({overall_coverage:.0f}%) - need to replace several indicators")
    else:
        print(f"❌ Poor coverage ({overall_coverage:.0f}%) - major indicator replacement needed")
    
    worst_indicators = [code for code, countries in sorted_indicators[:10]]
    print(f"🔄 Consider replacing these indicators with most missing data:")
    for code in worst_indicators:
        print(f"   - {code}")

if __name__ == "__main__":
    main()