#!/usr/bin/env python3
"""
Analyze Cost of a Healthy Diet data from FAO for our 38 countries
Data from July 2024 SOFI report
"""

import json

# Cost of a Healthy Diet data (PPP dollar per person per day, 2022)
healthy_diet_data = {
    "Germany": 3.56,
    "Denmark": 2.73,
    "Austria": 2.76,
    "Turkey": 4.5,  # Listed as Türkiye
    "United States": 2.63,
    "China": 3.35,  # China, mainland
    "Japan": 6.54,
    "United Kingdom": 2.12,  # Listed as "United Kingdom of Great Britain and Northern Ireland"
    "France": 3.42,
    "Italy": 3.61,
    "Canada": 3.89,
    "Australia": 2.9,
    "Spain": 3.35,
    "Netherlands": 2.9,  # Listed as "Netherlands (Kingdom of the)"
    "Sweden": 3.56,
    "Norway": 4.01,
    "Finland": 3.29,
    "Iceland": 3.02,
    "Switzerland": 2.85,
    "Belgium": 2.56,
    "New Zealand": 3.21,
    "Singapore": 3.48,
    "Israel": 3.02,
    "Ireland": 2.48,
    "Brazil": 4.25,
    "Mexico": 3.89,
    "Argentina": None,  # Listed as "Q - Missing value; suppressed"
    "Chile": 4.54,
    "Colombia": 4.13,
    "Poland": 3.91,
    "Czech Republic": 3.63,  # Listed as "Czechia"
    "Thailand": 4.93,
    "Malaysia": 3.77,
    "Philippines": 4.1,
    "Indonesia": 4.64,
    "Vietnam": 3.96,  # Listed as "Viet Nam"
    "India": 3.36,
    "South Africa": 3.74
}

def analyze_coverage():
    """Analyze coverage for our 38 countries"""
    
    # Load our countries
    with open('countries_38_final.json', 'r') as f:
        data = json.load(f)
    
    our_countries = [c["name"] for c in data["selected_countries"]]
    
    found_with_data = []
    missing = []
    
    for country in our_countries:
        if country in healthy_diet_data and healthy_diet_data[country] is not None:
            found_with_data.append({
                "country": country,
                "cost": healthy_diet_data[country]
            })
        else:
            missing.append(country)
    
    # Sort by cost (lowest to highest)
    found_with_data.sort(key=lambda x: x["cost"])
    
    coverage_percent = (len(found_with_data) / len(our_countries)) * 100
    
    print("💰 COST OF A HEALTHY DIET - COVERAGE ANALYSIS")
    print("=" * 60)
    print(f"Data source: FAO/SOFI Report July 2024")
    print(f"Year: 2022")
    print(f"Unit: PPP dollar per person per day")
    print(f"Our countries: {len(our_countries)}")
    print(f"Countries with data: {len(found_with_data)}")
    print(f"Coverage: {coverage_percent:.1f}%")
    print()
    
    print("🍎 TOP 10 LOWEST COST (Most Affordable):")
    for i, item in enumerate(found_with_data[:10], 1):
        print(f"{i:2d}. {item['country']}: ${item['cost']:.2f} per day")
    
    print("\n💸 TOP 10 HIGHEST COST (Least Affordable):")
    for i, item in enumerate(found_with_data[-10:], 1):
        print(f"{i:2d}. {item['country']}: ${item['cost']:.2f} per day")
    
    if missing:
        print(f"\n❌ Missing countries: {len(missing)}")
        print(f"   {', '.join(missing)}")
    
    # Calculate statistics
    costs = [item['cost'] for item in found_with_data]
    avg_cost = sum(costs) / len(costs)
    min_cost = min(costs)
    max_cost = max(costs)
    
    print(f"\n📊 STATISTICS:")
    print(f"Average cost: ${avg_cost:.2f}")
    print(f"Minimum: ${min_cost:.2f} ({[c['country'] for c in found_with_data if c['cost'] == min_cost][0]})")
    print(f"Maximum: ${max_cost:.2f} ({[c['country'] for c in found_with_data if c['cost'] == max_cost][0]})")
    print(f"Range: ${max_cost - min_cost:.2f}")
    
    return {
        "coverage_percent": coverage_percent,
        "countries_with_data": len(found_with_data),
        "missing": len(missing),
        "data": found_with_data,
        "statistics": {
            "average": avg_cost,
            "min": min_cost,
            "max": max_cost,
            "range": max_cost - min_cost
        }
    }

def main():
    result = analyze_coverage()
    
    print("\n📊 RECOMMENDATION:")
    if result["coverage_percent"] >= 75:
        print("✅ SUITABLE for dataset (≥75% coverage)")
        print("Add as: 'Cost of a Healthy Diet (PPP $ per person per day)'")
    else:
        print("❌ NOT suitable for dataset (<75% coverage)")
    
    # Save analysis
    output = {
        "indicator": "Cost of a Healthy Diet",
        "source": "FAO - State of Food Security and Nutrition in the World (SOFI) Report",
        "release": "July 2024",
        "year": 2022,
        "unit": "PPP dollar per person per day",
        "coverage_analysis": result,
        "missing_countries": ["Argentina"],
        "notes": "Argentina listed as 'Q - Missing value; suppressed'"
    }
    
    with open('healthy_diet_cost_analysis.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n📁 Analysis saved to: healthy_diet_cost_analysis.json")

if __name__ == "__main__":
    main()