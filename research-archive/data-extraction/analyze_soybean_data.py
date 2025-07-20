#!/usr/bin/env python3
"""
Analyze soybean production data from FAO for our 38 countries
"""

import json

# Soybean production data from FAO 2023
soybean_data = {
    "Austria": {"production": 274960, "area": 88450, "yield": 3108.6},
    "Australia": {"production": 52000, "area": 20700, "yield": 2512.1},
    "Brazil": {"production": 152144238, "area": 44447552, "yield": 3423},
    "Canada": {"production": 6980525, "area": 2261200, "yield": 3087.1},
    "China": {"production": 19496297.07, "area": 9984614, "yield": 1952.6},
    "Germany": {"production": 129000, "area": 44800, "yield": 2879.5},
    "India": {"production": 14984927.37, "area": 13084089, "yield": 1145.3},
    "Indonesia": {"production": 326493, "area": 219193, "yield": 1489.5},
    "Italy": {"production": 1095940, "area": 310720, "yield": 3527.1},
    "Japan": {"production": 260800, "area": 154700, "yield": 1685.8},
    "Mexico": {"production": 199162.6, "area": 91116, "yield": 2185.8},
    "Philippines": {"production": 615.64, "area": 339, "yield": 1814.9},
    "Poland": {"production": 47030, "area": 18020, "yield": 2609.9},
    "South Africa": {"production": 2770000, "area": 1148300, "yield": 2412.3},
    "Spain": {"production": 7670, "area": 2440, "yield": 3143.4},
    "Switzerland": {"production": 6949, "area": 3079, "yield": 2257.1},
    "Thailand": {"production": 20016, "area": 12010, "yield": 1666.6},
    "Turkey": {"production": 137500, "area": 32684, "yield": 4207},  # Listed as "Türkiye"
    "United States": {"production": 113343420, "area": 33348650, "yield": 3398.7},
    "Vietnam": {"production": 48102.94, "area": 29946, "yield": 1606.3},
    # Countries with 0 production
    "Denmark": {"production": 0, "area": 0, "yield": 0},
    "Finland": {"production": 0, "area": 0, "yield": 0},
    "Ireland": {"production": 0, "area": 0, "yield": 0},
    # Countries not in data (no soybean production)
    "Chile": "Missing",
    "Malaysia": "Missing",
    "New Zealand": "Missing"
}

def analyze_coverage():
    """Check coverage for our 38 countries"""
    
    # Load our countries
    with open('countries_38_final.json', 'r') as f:
        data = json.load(f)
    
    our_countries = [c["name"] for c in data["selected_countries"]]
    
    found_with_production = []
    found_zero_production = []
    missing = []
    
    for country in our_countries:
        if country in soybean_data:
            if soybean_data[country] == "Missing":
                missing.append(country)
            elif soybean_data[country]["production"] == 0:
                found_zero_production.append(country)
            else:
                found_with_production.append({
                    "country": country,
                    "production": soybean_data[country]["production"],
                    "yield": soybean_data[country]["yield"]
                })
        else:
            # Countries not explicitly in the FAO data
            missing.append(country)
    
    # Sort by production
    found_with_production.sort(key=lambda x: x["production"], reverse=True)
    
    total_found = len(found_with_production) + len(found_zero_production)
    coverage_percent = (total_found / len(our_countries)) * 100
    
    print("🌱 SOYBEAN PRODUCTION COVERAGE ANALYSIS")
    print("=" * 50)
    print(f"Data source: FAO 2023")
    print(f"Our countries: {len(our_countries)}")
    print(f"Countries with data: {total_found}")
    print(f"Coverage: {coverage_percent:.1f}%")
    print()
    
    print("✅ Countries with production:")
    for i, item in enumerate(found_with_production[:10], 1):
        print(f"{i:2d}. {item['country']}: {item['production']:,} tonnes")
    
    if len(found_with_production) > 10:
        print(f"... and {len(found_with_production) - 10} more")
    
    print(f"\n⚪ Countries with 0 production: {len(found_zero_production)}")
    if found_zero_production:
        print(f"   {', '.join(found_zero_production)}")
    
    print(f"\n❌ Missing countries: {len(missing)}")
    if missing:
        print(f"   {', '.join(missing)}")
    
    return {
        "coverage_percent": coverage_percent,
        "total_found": total_found,
        "with_production": len(found_with_production),
        "zero_production": len(found_zero_production),
        "missing": len(missing),
        "production_data": found_with_production
    }

if __name__ == "__main__":
    result = analyze_coverage()
    
    print("\n📊 RECOMMENDATION:")
    if result["coverage_percent"] >= 75:
        print("✅ SUITABLE for dataset (≥75% coverage)")
    else:
        print("❌ NOT suitable for dataset (<75% coverage)")
    
    # Save analysis
    with open('soybean_coverage_analysis.json', 'w') as f:
        json.dump(result, f, indent=2)