#!/usr/bin/env python3
"""
Extract the exact list of 36 indicators that have data for all 40 countries
"""

import json

def main():
    # Load the complete test results
    with open('complete_data_matrix_results.json', 'r') as f:
        data = json.load(f)
    
    indicators_missing_count = data['indicators_missing_count']
    
    # Load the indicator names
    with open('best_50_wb_indicators.json', 'r') as f:
        indicators_data = json.load(f)
    
    # Create mapping of codes to names
    code_to_name = {ind['id']: ind['name'] for ind in indicators_data['best_50_indicators']}
    
    print("🎯 EXACT LIST: 36 INDICATORS WITH ALL 40 COUNTRIES")
    print("=" * 70)
    
    # Find indicators with 0 missing (all 50 indicators tested)
    all_50_codes = set(code_to_name.keys())
    indicators_with_missing = set(indicators_missing_count.keys())
    
    # Indicators with 0 missing = all indicators MINUS those with any missing
    complete_indicators = all_50_codes - indicators_with_missing
    
    print(f"Total indicators tested: {len(all_50_codes)}")
    print(f"Indicators with missing data: {len(indicators_with_missing)}")
    print(f"Indicators with ALL 40 countries: {len(complete_indicators)}")
    print()
    
    # Sort and display the complete indicators
    complete_list = []
    for code in complete_indicators:
        name = code_to_name.get(code, "Unknown")
        complete_list.append((code, name))
    
    complete_list.sort(key=lambda x: x[1])  # Sort by name
    
    for i, (code, name) in enumerate(complete_list, 1):
        print(f"{i:2d}. {name}")
        print(f"    Code: {code}")
        print()
    
    # Verify the count
    print(f"✅ VERIFIED: {len(complete_list)} indicators have data for all 40 countries")
    
    # Save the list
    output = {
        "complete_indicators": [
            {"code": code, "name": name} for code, name in complete_list
        ],
        "count": len(complete_list),
        "verification_date": "2025-07-18"
    }
    
    with open('complete_coverage_indicators.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"📁 Complete list saved to: complete_coverage_indicators.json")

if __name__ == "__main__":
    main()