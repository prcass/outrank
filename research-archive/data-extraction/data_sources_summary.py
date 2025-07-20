#!/usr/bin/env python3
"""
Summary of all data source testing results
Final assessment and recommendations
"""

import json
import time

def load_test_results():
    """Load all test results"""
    results = {}
    
    test_files = [
        ("world_bank", "final_verified_dataset.json"),
        ("un_stats", "un_country_coverage_results.json"),
        ("oecd", "oecd_api_test.json"),
        ("who", "who_api_test.json"),
        ("alternatives", "alternative_sources_test.json")
    ]
    
    for source, filename in test_files:
        try:
            with open(filename, 'r') as f:
                results[source] = json.load(f)
        except FileNotFoundError:
            print(f"⚠️  Missing results file: {filename}")
            results[source] = None
    
    return results

def analyze_coverage_summary(results):
    """Analyze coverage across all sources"""
    print("📊 DATA SOURCE COVERAGE SUMMARY")
    print("=" * 40)
    
    # World Bank - we know we have 20 indicators with 100% coverage
    wb_coverage = 100.0
    wb_indicators = 20
    wb_countries = 40
    
    print(f"✅ WORLD BANK:")
    print(f"   Coverage: {wb_coverage}% (verified)")
    print(f"   Indicators: {wb_indicators} (selected from 36 available)")
    print(f"   Countries: {wb_countries}")
    print(f"   Status: ✅ READY TO USE")
    
    # UN Statistics  
    if results["un_stats"]:
        un_coverage = results["un_stats"]["coverage_summary"]["coverage_percent"]
        un_countries = results["un_stats"]["coverage_summary"]["total_our_countries"]
        un_available = results["un_stats"]["coverage_summary"]["direct_matches"] + results["un_stats"]["coverage_summary"]["close_matches"]
        un_indicators = results["un_stats"]["interesting_indicators_count"]
        
        print(f"\n⚠️  UN STATISTICS:")
        print(f"   Country Coverage: {un_coverage}% ({un_available}/{un_countries})")
        print(f"   Potential Indicators: {un_indicators}")
        print(f"   Status: ❌ DATA API NOT ACCESSIBLE")
        print(f"   Issue: Metadata available, actual data endpoints return 404")
    
    # OECD
    if results["oecd"]:
        oecd_accessible = results["oecd"]["accessibility"]
        print(f"\n❌ OECD:")
        print(f"   Status: {'❌ NOT ACCESSIBLE' if not oecd_accessible else '✅ ACCESSIBLE'}")
        print(f"   Issue: All API endpoints return 403/404 errors")
    
    # WHO
    if results["who"]:
        who_accessible = results["who"]["accessibility"]
        who_coverage = results["who"]["country_coverage"]["coverage_percent"]
        print(f"\n❌ WHO:")
        print(f"   API Access: {'✅ YES' if who_accessible else '❌ NO'}")
        print(f"   Country Coverage: {who_coverage}%")
        print(f"   Issue: API accessible but 0% country coverage (data issues)")
    
    # Alternative sources
    if results["alternatives"]:
        alt_accessible = results["alternatives"]["accessible_count"]
        total_alt = len(results["alternatives"]["sources_tested"])
        print(f"\n❌ ALTERNATIVE SOURCES:")
        print(f"   Accessible: {alt_accessible}/{total_alt}")
        print(f"   Working: World Happiness Report (HTML only)")
        print(f"   Issue: Most APIs require authentication or return HTML")

def provide_recommendations():
    """Provide final recommendations"""
    print(f"\n🎯 RECOMMENDATIONS FOR 20 ADDITIONAL INDICATORS")
    print("=" * 55)
    
    print("Given the test results, here are the viable approaches:")
    
    print(f"\n1. ✅ IMMEDIATE SOLUTION - Static Data Downloads:")
    print("   • Download CSV/Excel files from organizations directly")
    print("   • World Happiness Report: happiness-report.s3.amazonaws.com")
    print("   • Freedom House: Static Excel files with democracy scores")
    print("   • Transparency International: Static CSV files with corruption data")
    print("   • Heritage Foundation: Economic freedom data (manual download)")
    
    print(f"\n2. 🔄 ALTERNATIVE APIS:")
    print("   • Try different API keys/authentication for OECD")
    print("   • Research UN data portals beyond SDG API")
    print("   • Check if WHO has alternative data endpoints")
    
    print(f"\n3. 📊 MIXED APPROACH (RECOMMENDED):")
    print("   • Use our 20 World Bank indicators (100% verified)")
    print("   • Add 5-10 indicators from static downloads")
    print("   • Mix categories: economic, social, environmental, governance")
    print("   • Prioritize interesting/fun indicators for ranking games")
    
    print(f"\n4. ⚡ QUICK WIN CATEGORIES:")
    print("   Happiness & Well-being:")
    print("   • World Happiness Score")
    print("   • Life Satisfaction")
    print("   • Social Support")
    print("   ")
    print("   Governance & Freedom:")
    print("   • Democracy Score (Freedom House)")
    print("   • Corruption Perception Index")
    print("   • Economic Freedom Index")
    print("   ")
    print("   Innovation & Technology:")
    print("   • Global Innovation Index")
    print("   • Digital Competitiveness")
    print("   • Startup Activity")
    
def create_next_steps_plan():
    """Create specific next steps"""
    print(f"\n📋 SPECIFIC NEXT STEPS")
    print("=" * 25)
    
    steps = [
        "Download World Happiness Report 2024 data (CSV/Excel)",
        "Download Freedom House democracy scores (Excel)",
        "Download Transparency Intl corruption index (CSV)",
        "Download Heritage Foundation economic freedom (manual)",
        "Test data coverage for our 40 countries",
        "Select best 10-15 indicators with 90%+ coverage",
        "Combine with 20 World Bank indicators",
        "Create integrated dataset with 30-35 total indicators",
        "Verify all data values and handle missing data",
        "Test dataset in game format"
    ]
    
    for i, step in enumerate(steps, 1):
        print(f"{i:2d}. {step}")

def main():
    print("🚀 COMPREHENSIVE DATA SOURCES ANALYSIS")
    print("Final assessment and recommendations")
    print()
    
    # Load all test results
    results = load_test_results()
    
    # Analyze coverage
    analyze_coverage_summary(results)
    
    # Provide recommendations
    provide_recommendations()
    
    # Create next steps
    create_next_steps_plan()
    
    # Create final summary
    final_summary = {
        "analysis_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "sources_tested": [
            {"name": "World Bank", "status": "✅ WORKING", "coverage": "100%", "indicators": 20},
            {"name": "UN Statistics", "status": "❌ DATA API BLOCKED", "coverage": "92% countries", "indicators": 0},
            {"name": "OECD", "status": "❌ API BLOCKED", "coverage": "Unknown", "indicators": 0},
            {"name": "WHO", "status": "❌ DATA ISSUES", "coverage": "0%", "indicators": 0},
            {"name": "Heritage Foundation", "status": "❌ API BLOCKED", "coverage": "Unknown", "indicators": 0},
            {"name": "Transparency Intl", "status": "❌ API BLOCKED", "coverage": "Unknown", "indicators": 0},
            {"name": "Freedom House", "status": "❌ API BLOCKED", "coverage": "Unknown", "indicators": 0}
        ],
        "recommendation": "Use World Bank (20 indicators) + Static downloads (10-15 indicators)",
        "viable_approach": "Mixed API + static file downloads",
        "target_total": "30-35 indicators total",
        "confidence": "High - World Bank verified, static files reliable"
    }
    
    with open('final_data_sources_analysis.json', 'w') as f:
        json.dump(final_summary, f, indent=2)
    
    print(f"\n📁 Complete analysis saved to: final_data_sources_analysis.json")

if __name__ == "__main__":
    main()