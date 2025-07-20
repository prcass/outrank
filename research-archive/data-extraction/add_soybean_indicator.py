#!/usr/bin/env python3
"""
Add Soybean Production indicator to the final dataset
89.5% coverage (34/38 countries) from FAO 2023
"""

import json
from datetime import datetime

def load_soybean_data():
    """Soybean production data for all 38 countries from FAO 2023"""
    return {
        "Germany": {"production": 129000, "yield": 2879.5},
        "Denmark": {"production": 0, "yield": 0},
        "Austria": {"production": 274960, "yield": 3108.6},
        "Turkey": {"production": 137500, "yield": 4207},
        "United States": {"production": 113343420, "yield": 3398.7},
        "China": {"production": 19496297, "yield": 1952.6},
        "Japan": {"production": 260800, "yield": 1685.8},
        "United Kingdom": {"production": 0, "yield": 0},
        "France": {"production": 387820, "yield": 2458.4},
        "Italy": {"production": 1095940, "yield": 3527.1},
        "Canada": {"production": 6980525, "yield": 3087.1},
        "Australia": {"production": 52000, "yield": 2512.1},
        "Spain": {"production": 7670, "yield": 3143.4},
        "Netherlands": {"production": 0, "yield": 0},
        "Sweden": {"production": 0, "yield": 0},
        "Norway": {"production": 0, "yield": 0},
        "Finland": {"production": 0, "yield": 0},
        "Iceland": {"production": 0, "yield": 0},
        "Switzerland": {"production": 6949, "yield": 2257.1},
        "Belgium": {"production": 50, "yield": 1666.7},
        "New Zealand": {"production": None, "yield": None},  # No data
        "Singapore": {"production": None, "yield": None},  # No data
        "Israel": {"production": 0, "yield": 0},
        "Ireland": {"production": 0, "yield": 0},
        "Brazil": {"production": 152144238, "yield": 3423},
        "Mexico": {"production": 199163, "yield": 2185.8},
        "Argentina": {"production": 25044978, "yield": 1744.5},
        "Chile": {"production": None, "yield": None},  # No data
        "Colombia": {"production": 196414, "yield": 2296.2},
        "Poland": {"production": 47030, "yield": 2609.9},
        "Czech Republic": {"production": 63390, "yield": 2391.2},
        "Thailand": {"production": 20016, "yield": 1666.6},
        "Malaysia": {"production": None, "yield": None},  # No data
        "Philippines": {"production": 616, "yield": 1814.9},
        "Indonesia": {"production": 326493, "yield": 1489.5},
        "Vietnam": {"production": 48103, "yield": 1606.3},
        "India": {"production": 14984927, "yield": 1145.3},
        "South Africa": {"production": 2770000, "yield": 2412.3}
    }

def main():
    print("🌱 ADDING SOYBEAN PRODUCTION TO FINAL DATASET")
    print("=" * 60)
    
    # Load existing dataset (v2 with forest and irrigated land)
    with open('know_it_all_final_dataset_v2.json', 'r') as f:
        dataset = json.load(f)
    
    print(f"✅ Loaded dataset with {dataset['dataset_info']['indicator_count']} indicators")
    
    # Load soybean data
    soybean_data = load_soybean_data()
    
    # Update agriculture source info
    dataset['data_sources']['agriculture']['indicators'] = 3  # Was 2, now 3
    dataset['data_sources']['agriculture']['sources']['soybean_production'] = "FAO 2023 via FAOSTAT"
    dataset['data_sources']['agriculture']['indicators_list'].append("Soybean Production (tonnes)")
    
    # Add soybean indicator
    soybean_indicator = {
        "name": "Soybean Production",
        "description": "Which country produces the most soybeans?",
        "data_field": "soybean_production_tonnes",
        "type": "higher_better",
        "unit": "tonnes",
        "source": "FAO 2023",
        "statistics": {
            "countries_analyzed": 38,
            "countries_with_data": 34,
            "coverage_percent": 89.5,
            "range_min": 0,  # Multiple countries with 0
            "range_max": 152144238,  # Brazil
            "countries_with_production": 25,
            "countries_with_zero": 9,
            "missing_countries": 4
        }
    }
    
    dataset['indicators']['agriculture_indicators'].append(soybean_indicator)
    
    # Add data to countries
    for country in dataset['countries']:
        country_name = country['name']
        
        if country_name in soybean_data:
            data = soybean_data[country_name]
            if data['production'] is not None:
                country['soybean_production_tonnes'] = data['production']
                country['soybean_yield_kg_per_ha'] = data['yield']
            else:
                # Countries with no soybean data (Singapore, New Zealand, Chile, Malaysia)
                country['soybean_production_tonnes'] = None
                country['soybean_yield_kg_per_ha'] = None
    
    # Update indicator count
    dataset['dataset_info']['indicator_count'] = 32  # Was 31, now +1
    dataset['dataset_info']['last_updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    dataset['dataset_info']['update_notes'] = "Added soybean production indicator with 89.5% coverage"
    
    # Save updated dataset
    with open('know_it_all_final_dataset_v3.json', 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print("\n✅ SUCCESSFULLY ADDED SOYBEAN PRODUCTION:")
    print("Coverage: 34/38 countries (89.5%)")
    print("Countries with production: 25")
    print("Countries with 0 production: 9")
    print("Missing data: 4 (Singapore, New Zealand, Chile, Malaysia)")
    print(f"\n📊 Updated dataset now has {dataset['dataset_info']['indicator_count']} indicators")
    print("\n📁 Saved to: know_it_all_final_dataset_v3.json")
    
    # Create summary
    summary = {
        "update_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "indicator_added": "Soybean Production",
        "new_total_indicators": 32,
        "coverage": {
            "countries_with_data": 34,
            "coverage_percent": 89.5,
            "countries_with_production": 25,
            "countries_with_zero": 9,
            "missing": ["Singapore", "New Zealand", "Chile", "Malaysia"]
        },
        "top_producers": [
            {"country": "Brazil", "production": 152144238},
            {"country": "United States", "production": 113343420},
            {"country": "Argentina", "production": 25044978},
            {"country": "China", "production": 19496297},
            {"country": "India", "production": 14984927}
        ],
        "source": "FAO 2023 (FAOSTAT)",
        "unit": "tonnes"
    }
    
    with open('soybean_indicator_added.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\n📄 Summary saved to: soybean_indicator_added.json")

if __name__ == "__main__":
    main()