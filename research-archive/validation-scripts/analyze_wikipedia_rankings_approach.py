#!/usr/bin/env python3
"""
Analyze approach for extracting data from Wikipedia List of international rankings
Outline systematic methodology for adding new indicators
"""

import json
import time

def analyze_wikipedia_rankings_approach():
    """Outline approach for extracting Wikipedia rankings data"""
    
    print("🌐 WIKIPEDIA INTERNATIONAL RANKINGS - EXTRACTION APPROACH")
    print("=" * 60)
    print("Source: https://en.wikipedia.org/wiki/List_of_international_rankings")
    print()
    
    print("📋 AVAILABLE CATEGORIES ON WIKIPEDIA PAGE:")
    print("-" * 40)
    
    categories = [
        "Agriculture",
        "Civil liberties", 
        "Corruption",
        "Culture",
        "Democracy",
        "Economic",
        "Education",
        "Environment", 
        "Globalization",
        "Happiness",
        "Health",
        "Industry and innovation",
        "Infrastructure",
        "Labor",
        "Language",
        "Military",
        "Peace",
        "Politics",
        "Press",
        "Religion",
        "Sport",
        "Terrorism",
        "Tourism"
    ]
    
    for i, category in enumerate(categories, 1):
        print(f"{i:2d}. {category}")
    
    print(f"\nTotal categories: {len(categories)}")
    
    print("\n🎯 SYSTEMATIC EXTRACTION APPROACH:")
    print("-" * 40)
    print()
    
    steps = [
        {
            "step": 1,
            "title": "Category Prioritization",
            "tasks": [
                "Select categories most relevant for ranking games",
                "Avoid sensitive topics (terrorism, military)",
                "Focus on interesting comparative metrics",
                "Prioritize: Economic, Education, Health, Environment, Innovation"
            ]
        },
        {
            "step": 2, 
            "title": "Source Verification",
            "tasks": [
                "Each ranking links to its original source",
                "Verify source credibility (UN, World Bank, reputable NGOs)",
                "Check data recency (prefer 2020-2025 data)",
                "Confirm data covers our 38 countries"
            ]
        },
        {
            "step": 3,
            "title": "Coverage Analysis",
            "tasks": [
                "Visit each ranking's source page",
                "Check if our 38 countries are included",
                "Calculate exact coverage percentage",
                "Only accept if coverage is 100% (or 95%+ if exceptional)"
            ]
        },
        {
            "step": 4,
            "title": "Data Extraction Process",
            "tasks": [
                "Copy ranking tables from source websites",
                "Convert to structured format (JSON/CSV)",
                "Verify all 38 countries have data",
                "Note the exact source URL and date"
            ]
        },
        {
            "step": 5,
            "title": "Quality Control",
            "tasks": [
                "No assumptions - only verified data",
                "Double-check country names match ours",
                "Ensure no missing values",
                "Document source attribution clearly"
            ]
        }
    ]
    
    for step_info in steps:
        print(f"STEP {step_info['step']}: {step_info['title']}")
        for task in step_info['tasks']:
            print(f"  • {task}")
        print()
    
    print("📊 RECOMMENDED PRIORITY RANKINGS TO EXTRACT:")
    print("-" * 45)
    
    priority_rankings = [
        {
            "category": "Economic",
            "rankings": [
                "Global Competitiveness Index",
                "Ease of Doing Business Index",
                "Economic Freedom Index"
            ]
        },
        {
            "category": "Education",
            "rankings": [
                "PISA scores (reading, math, science)",
                "Education Index",
                "University rankings by country"
            ]
        },
        {
            "category": "Health",
            "rankings": [
                "Healthcare Quality Index",
                "Health system performance",
                "Obesity rates"
            ]
        },
        {
            "category": "Environment",
            "rankings": [
                "Environmental Performance Index",
                "Climate Change Performance Index",
                "Renewable energy usage"
            ]
        },
        {
            "category": "Innovation",
            "rankings": [
                "Global Innovation Index",
                "Digital Competitiveness",
                "Startup ecosystem rankings"
            ]
        },
        {
            "category": "Quality of Life",
            "rankings": [
                "Human Development Index",
                "Social Progress Index",
                "Quality of Life Index"
            ]
        }
    ]
    
    for category_info in priority_rankings:
        print(f"\n{category_info['category']}:")
        for ranking in category_info['rankings']:
            print(f"  • {ranking}")
    
    print("\n⚡ QUICK WIN APPROACH:")
    print("-" * 25)
    print("1. Start with well-known indices (HDI, Competitiveness, etc.)")
    print("2. Check Wikipedia page for direct data tables")
    print("3. Verify coverage for our 38 countries")
    print("4. Extract only 100% complete indicators")
    print("5. Add 10-20 high-quality indicators to reach 40-50 total")
    
    print("\n💡 EXAMPLE EXTRACTION WORKFLOW:")
    print("-" * 30)
    print("User provides ranking data → I verify coverage → ")
    print("Calculate completion % → Extract if 100% → ")
    print("Add to final dataset → Update total count")
    
    # Save approach document
    approach = {
        "source": "Wikipedia List of international rankings",
        "url": "https://en.wikipedia.org/wiki/List_of_international_rankings",
        "approach_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_categories": len(categories),
        "extraction_steps": steps,
        "priority_rankings": priority_rankings,
        "quality_requirements": {
            "coverage": "100% for all 38 countries",
            "verification": "All data must be verified from original sources",
            "recency": "Prefer data from 2020-2025",
            "credibility": "Only reputable sources (UN, World Bank, established NGOs)"
        },
        "current_status": {
            "existing_indicators": 29,
            "target_additional": "10-20",
            "final_target": "40-50 total indicators"
        }
    }
    
    with open('wikipedia_rankings_approach.json', 'w') as f:
        json.dump(approach, f, indent=2)
    
    print(f"\n📁 Approach saved to: wikipedia_rankings_approach.json")

def main():
    print("🚀 ANALYZING WIKIPEDIA INTERNATIONAL RANKINGS")
    print("Planning systematic approach to extract additional indicators")
    print()
    
    analyze_wikipedia_rankings_approach()
    
    print("\n✅ NEXT STEPS:")
    print("1. Select specific rankings from Wikipedia page")
    print("2. Provide the ranking data (tables/PDFs/links)")
    print("3. I'll verify coverage and extract if 100% complete")
    print("4. Add to our existing 29 indicators")
    print("5. Reach target of 40-50 total indicators")

if __name__ == "__main__":
    main()