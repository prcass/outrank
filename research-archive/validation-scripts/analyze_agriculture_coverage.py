#!/usr/bin/env python3
"""
Analyze coverage of extracted agriculture rankings for our 38 countries
Calculate which rankings have highest coverage and are suitable for dataset
"""

import json
from datetime import datetime

def load_our_countries():
    """Load our 38 target countries"""
    with open('countries_38_final.json', 'r') as f:
        data = json.load(f)
    return {c["name"]: c["iso3"] for c in data["selected_countries"]}

def load_agriculture_rankings():
    """Load all extracted agriculture rankings"""
    
    # Load high priority rankings
    with open('high_priority_agriculture_complete.json', 'r') as f:
        high_priority = json.load(f)
    
    # Load medium priority rankings
    with open('medium_priority_agriculture_complete.json', 'r') as f:
        medium_priority = json.load(f)
    
    # Combine all rankings
    all_rankings = {}
    all_rankings.update(high_priority["rankings"])
    all_rankings.update(medium_priority["rankings"])
    
    return all_rankings

def normalize_country_name(name):
    """Normalize country names for matching"""
    name_mapping = {
        "United States": "United States",
        "USA": "United States",
        "US": "United States",
        "UK": "United Kingdom",
        "UAE": "United Arab Emirates",
        "Czech Republic": "Czech Republic",
        "Czechia": "Czech Republic",
        "South Korea": "Korea, South",
        "North Korea": "Korea, North"
    }
    
    return name_mapping.get(name, name)

def analyze_ranking_coverage(ranking_name, ranking_data, our_countries):
    """Analyze coverage of a single ranking for our countries"""
    
    found_countries = []
    missing_countries = []
    
    # Get the countries data from the ranking
    countries_data = ranking_data.get("countries_data", {})
    
    for our_country in our_countries:
        found = False
        
        # Check exact match first
        if our_country in countries_data:
            found_countries.append({
                "country": our_country,
                "rank": countries_data[our_country].get("rank", "Unknown"),
                "value": countries_data[our_country].get("production", 
                        countries_data[our_country].get("area", "Unknown"))
            })
            found = True
        else:
            # Check normalized names
            normalized_our = normalize_country_name(our_country)
            for ranking_country in countries_data:
                if normalize_country_name(ranking_country) == normalized_our:
                    found_countries.append({
                        "country": our_country,
                        "ranking_country": ranking_country,
                        "rank": countries_data[ranking_country].get("rank", "Unknown"),
                        "value": countries_data[ranking_country].get("production",
                                countries_data[ranking_country].get("area", "Unknown"))
                    })
                    found = True
                    break
        
        if not found:
            missing_countries.append(our_country)
    
    coverage_percent = (len(found_countries) / len(our_countries)) * 100
    
    return {
        "ranking_name": ranking_name,
        "source": ranking_data.get("source", "Unknown"),
        "year": ranking_data.get("year", "Unknown"),
        "total_countries_in_ranking": ranking_data.get("total_countries", 0),
        "our_countries_found": len(found_countries),
        "our_countries_missing": len(missing_countries),
        "coverage_percent": coverage_percent,
        "found_details": found_countries,
        "missing_countries": missing_countries,
        "suitable_for_dataset": coverage_percent >= 75.0
    }

def main():
    print("🌾 AGRICULTURE RANKINGS COVERAGE ANALYSIS")
    print("=" * 60)
    print("Analyzing coverage for our 38 countries")
    print()
    
    # Load data
    our_countries = load_our_countries()
    agriculture_rankings = load_agriculture_rankings()
    
    print(f"✅ Loaded {len(our_countries)} target countries")
    print(f"✅ Loaded {len(agriculture_rankings)} agriculture rankings")
    print()
    
    # Analyze each ranking
    coverage_results = []
    suitable_rankings = []
    
    for ranking_name, ranking_data in agriculture_rankings.items():
        print(f"📊 Analyzing: {ranking_data.get('ranking_name', ranking_name)}")
        
        coverage = analyze_ranking_coverage(ranking_name, ranking_data, our_countries)
        coverage_results.append(coverage)
        
        print(f"   Coverage: {coverage['our_countries_found']}/38 ({coverage['coverage_percent']:.1f}%)")
        
        if coverage["suitable_for_dataset"]:
            print(f"   ✅ SUITABLE for dataset (≥75% coverage)")
            suitable_rankings.append(coverage)
        else:
            print(f"   ❌ Not suitable ({coverage['coverage_percent']:.1f}% < 75%)")
            
        print()
    
    # Sort by coverage percentage
    coverage_results.sort(key=lambda x: x["coverage_percent"], reverse=True)
    
    print("🏆 RANKINGS BY COVERAGE:")
    print("-" * 40)
    for i, result in enumerate(coverage_results, 1):
        status = "✅" if result["suitable_for_dataset"] else "❌"
        print(f"{i:2d}. {result['ranking_name']}: {result['coverage_percent']:.1f}% {status}")
    
    print(f"\n🎯 SUMMARY:")
    print(f"Total rankings analyzed: {len(coverage_results)}")
    print(f"Suitable for dataset (≥75%): {len(suitable_rankings)}")
    print(f"Not suitable (<75%): {len(coverage_results) - len(suitable_rankings)}")
    
    if suitable_rankings:
        print(f"\n✅ RECOMMENDED FOR DATASET:")
        for ranking in suitable_rankings:
            print(f"• {ranking['ranking_name']} ({ranking['coverage_percent']:.1f}%)")
    
    # Save detailed results
    results = {
        "analysis_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "our_countries_count": len(our_countries),
        "rankings_analyzed": len(coverage_results),
        "suitable_rankings_count": len(suitable_rankings),
        "coverage_threshold": 75.0,
        "detailed_coverage": coverage_results,
        "recommended_for_dataset": suitable_rankings,
        "our_countries_list": list(our_countries.keys())
    }
    
    with open('agriculture_coverage_analysis.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📁 Detailed analysis saved to: agriculture_coverage_analysis.json")

if __name__ == "__main__":
    main()