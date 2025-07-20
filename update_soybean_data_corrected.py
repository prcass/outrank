#!/usr/bin/env python3
"""
Update soybean data with corrections:
- UK and Belgium are MISSING (not 0)
- Actual coverage is 84.2% (32/38 countries)
"""

import json
from datetime import datetime

def main():
    print("🔧 CORRECTING SOYBEAN DATA IN DATASET")
    print("=" * 60)
    
    # Load current dataset
    with open('know_it_all_final_dataset_v3.json', 'r') as f:
        dataset = json.load(f)
    
    # Corrections needed
    corrections = {
        "United Kingdom": {"from": 0, "to": None, "reason": "Not in FAO data"},
        "Belgium": {"from": 50, "to": None, "reason": "Not in FAO data (50 was Luxembourg)"}
    }
    
    print("📝 APPLYING CORRECTIONS:")
    
    # Apply corrections
    for country in dataset['countries']:
        if country['name'] in corrections:
            corr = corrections[country['name']]
            old_val = country.get('soybean_production_tonnes', 'not set')
            country['soybean_production_tonnes'] = corr['to']
            country['soybean_yield_kg_per_ha'] = None
            print(f"  {country['name']}: {old_val} → {corr['to']} ({corr['reason']})")
    
    # Update statistics in indicator
    for indicator in dataset['indicators']['agriculture_indicators']:
        if indicator['name'] == 'Soybean Production':
            indicator['statistics']['countries_with_data'] = 32
            indicator['statistics']['coverage_percent'] = 84.2
            indicator['statistics']['countries_with_production'] = 24
            indicator['statistics']['countries_with_zero'] = 8
            indicator['statistics']['missing_countries'] = 6
            indicator['statistics']['note'] = "Coverage still exceeds 75% threshold"
            print("\n✅ Updated statistics:")
            print(f"  Coverage: 32/38 countries (84.2%)")
            print(f"  Still suitable for dataset (>75%)")
    
    # Update metadata
    dataset['dataset_info']['last_updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    dataset['dataset_info']['update_notes'] = "Corrected soybean data: UK and Belgium marked as missing"
    
    # Save corrected dataset
    with open('know_it_all_final_dataset_v3_corrected.json', 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print("\n📊 CORRECTED SUMMARY:")
    print("Countries with data: 32/38 (84.2%)")
    print("- With production: 24")
    print("- With 0 production: 8") 
    print("- Missing: 6 (UK, Belgium, Singapore, New Zealand, Chile, Malaysia)")
    
    print("\n✅ Dataset remains suitable (>75% coverage)")
    print("\n📁 Saved to: know_it_all_final_dataset_v3_corrected.json")
    
    # Create correction summary
    summary = {
        "correction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "corrections_made": [
            {"country": "United Kingdom", "changed_from": "0", "changed_to": "missing", "reason": "Not in FAO data"},
            {"country": "Belgium", "changed_from": "50", "changed_to": "missing", "reason": "Not in FAO data"}
        ],
        "updated_statistics": {
            "countries_with_data": 32,
            "coverage_percent": 84.2,
            "countries_with_production": 24,
            "countries_with_zero": 8,
            "missing": ["United Kingdom", "Belgium", "Singapore", "New Zealand", "Chile", "Malaysia"]
        },
        "countries_with_zero_production": [
            "Denmark", "Finland", "Ireland", "Netherlands", 
            "Sweden", "Norway", "Iceland", "Israel"
        ],
        "status": "Still suitable for dataset (84.2% > 75% threshold)"
    }
    
    with open('soybean_corrections.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\n📄 Correction summary saved to: soybean_corrections.json")

if __name__ == "__main__":
    main()