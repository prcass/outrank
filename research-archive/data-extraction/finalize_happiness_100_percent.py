#!/usr/bin/env python3
"""
Finalize happiness indicators - keep only 100% complete categories
Remove Perceptions of Corruption due to missing Egypt data
"""

import json
import time

def finalize_happiness_indicators():
    """Keep only happiness indicators with 100% data completion"""
    
    # Load current dataset
    with open('happiness_report_complete.json', 'r') as f:
        current_data = json.load(f)
    
    print("🔍 FINALIZING HAPPINESS INDICATORS - 100% COMPLETION ONLY")
    print("=" * 60)
    print("REMOVING indicators with missing data - 100% completion required")
    print()
    
    # Check each indicator for 100% data completeness
    valid_indicators = []
    removed_indicators = []
    
    all_countries = current_data["countries_with_data"]
    
    for indicator in current_data["potential_indicators"]:
        field = indicator["data_field"]
        
        # Count countries with data (excluding None values)
        values = [country[field] for country in all_countries if country[field] is not None]
        countries_with_data = len(values)
        total_countries = len(all_countries)
        completeness = countries_with_data / total_countries * 100
        
        if completeness == 100.0:
            # Keep this indicator
            indicator_updated = indicator.copy()
            indicator_updated["final_statistics"] = {
                "total_countries": total_countries,
                "countries_with_data": countries_with_data,
                "data_completeness_percent": 100.0,
                "range_min": min(values),
                "range_max": max(values),
                "average": round(sum(values) / len(values), 2)
            }
            valid_indicators.append(indicator_updated)
            print(f"✅ KEPT: {indicator['name']} (100% complete)")
        else:
            # Remove this indicator
            removed_indicators.append({
                "name": indicator["name"],
                "completeness": completeness,
                "missing_countries": total_countries - countries_with_data
            })
            print(f"❌ REMOVED: {indicator['name']} ({completeness:.1f}% complete - {total_countries - countries_with_data} missing)")
    
    # Update dataset with only 100% complete indicators
    current_data["potential_indicators"] = valid_indicators
    current_data["removed_indicators"] = removed_indicators
    current_data["final_indicator_count"] = len(valid_indicators)
    current_data["completion_requirement"] = "100% data completeness required"
    current_data["extraction_date"] = time.strftime("%Y-%m-%d %H:%M:%S")
    
    # Save finalized dataset
    with open('happiness_indicators_final.json', 'w') as f:
        json.dump(current_data, f, indent=2)
    
    print(f"\n📊 FINALIZATION SUMMARY:")
    print(f"Kept indicators: {len(valid_indicators)}")
    print(f"Removed indicators: {len(removed_indicators)}")
    print(f"All kept indicators: 100% data completion (40/40 countries)")
    
    print(f"\n🎯 FINAL HAPPINESS INDICATORS (100% COMPLETE):")
    print("-" * 50)
    
    for indicator in valid_indicators:
        name = indicator["name"]
        stats = indicator["final_statistics"]
        print(f"{name}:")
        print(f"  Coverage: 100% (40/40 countries)")
        print(f"  Range: {stats['range_min']} - {stats['range_max']}")
        print(f"  Average: {stats['average']}")
        print(f"  ✅ READY for ranking games")
        print()
    
    print(f"📁 Final dataset saved to: happiness_indicators_final.json")
    
    return len(valid_indicators)

def main():
    print("🚀 FINALIZING HAPPINESS INDICATORS - 100% COMPLETION REQUIREMENT")
    print("Ensuring all indicators have complete data for all 40 countries")
    print()
    
    final_count = finalize_happiness_indicators()
    
    print(f"\n✅ HAPPINESS INDICATORS FINALIZED")
    print(f"Final count: {final_count} indicators with 100% completion")
    print(f"Ready for integration into final dataset")

if __name__ == "__main__":
    main()