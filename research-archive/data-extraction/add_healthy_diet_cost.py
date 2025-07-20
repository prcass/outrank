#!/usr/bin/env python3
"""
Add Cost of a Healthy Diet indicator to the final dataset
97.4% coverage (37/38 countries) from FAO SOFI Report July 2024
"""

import json
from datetime import datetime

def load_healthy_diet_data():
    """Cost of a Healthy Diet data for all 38 countries from FAO 2022"""
    return {
        "Germany": 3.56,
        "Denmark": 2.73,
        "Austria": 2.76,
        "Turkey": 4.5,
        "United States": 2.63,
        "China": 3.35,
        "Japan": 6.54,
        "United Kingdom": 2.12,
        "France": 3.42,
        "Italy": 3.61,
        "Canada": 3.89,
        "Australia": 2.9,
        "Spain": 3.35,
        "Netherlands": 2.9,
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
        "Argentina": None,  # Missing value; suppressed
        "Chile": 4.54,
        "Colombia": 4.13,
        "Poland": 3.91,
        "Czech Republic": 3.63,
        "Thailand": 4.93,
        "Malaysia": 3.77,
        "Philippines": 4.1,
        "Indonesia": 4.64,
        "Vietnam": 3.96,
        "India": 3.36,
        "South Africa": 3.74
    }

def main():
    print("💰 ADDING COST OF A HEALTHY DIET TO FINAL DATASET")
    print("=" * 60)
    
    # Load existing dataset (v3 with forest, irrigated land, and soybean)
    with open('know_it_all_final_dataset_v3_corrected.json', 'r') as f:
        dataset = json.load(f)
    
    print(f"✅ Loaded dataset with {dataset['dataset_info']['indicator_count']} indicators")
    
    # Load healthy diet data
    diet_cost_data = load_healthy_diet_data()
    
    # Add new data source
    dataset['data_sources']['fao_sofi'] = {
        "indicators": 1,
        "coverage": "97.4%",
        "source": "FAO - State of Food Security and Nutrition in the World (SOFI) Report",
        "release": "July 2024",
        "verification": "Manual extraction from SOFI report data",
        "indicators_list": [
            "Cost of a Healthy Diet (PPP $ per person per day)"
        ]
    }
    
    # Add indicator to the indicators section
    if 'food_security_indicators' not in dataset['indicators']:
        dataset['indicators']['food_security_indicators'] = []
    
    diet_cost_indicator = {
        "name": "Cost of a Healthy Diet",
        "description": "Which country has the most affordable healthy diet?",
        "data_field": "healthy_diet_cost_ppp",
        "type": "lower_better",  # Lower cost is better
        "unit": "PPP $ per person per day",
        "source": "FAO SOFI Report July 2024",
        "year": 2022,
        "statistics": {
            "countries_analyzed": 38,
            "countries_with_data": 37,
            "coverage_percent": 97.4,
            "range_min": 2.12,  # United Kingdom
            "range_max": 6.54,  # Japan
            "average": 3.58,
            "missing_countries": 1,
            "missing_list": ["Argentina"]
        }
    }
    
    dataset['indicators']['food_security_indicators'] = [diet_cost_indicator]
    
    # Add data to countries
    for country in dataset['countries']:
        country_name = country['name']
        
        if country_name in diet_cost_data:
            country['healthy_diet_cost_ppp'] = diet_cost_data[country_name]
    
    # Update indicator count
    dataset['dataset_info']['indicator_count'] = 33  # Was 32, now +1
    dataset['dataset_info']['last_updated'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    dataset['dataset_info']['update_notes'] = "Added Cost of a Healthy Diet indicator with 97.4% coverage"
    
    # Save updated dataset
    with open('know_it_all_final_dataset_v4.json', 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print("\n✅ SUCCESSFULLY ADDED COST OF A HEALTHY DIET:")
    print("Coverage: 37/38 countries (97.4%)")
    print("Missing: Argentina only")
    print("Most affordable: United Kingdom ($2.12/day)")
    print("Least affordable: Japan ($6.54/day)")
    print(f"\n📊 Updated dataset now has {dataset['dataset_info']['indicator_count']} indicators")
    print("\n📁 Saved to: know_it_all_final_dataset_v4.json")
    
    # Create summary
    summary = {
        "update_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "indicator_added": "Cost of a Healthy Diet",
        "new_total_indicators": 33,
        "coverage": {
            "countries_with_data": 37,
            "coverage_percent": 97.4,
            "missing": ["Argentina"]
        },
        "most_affordable": [
            {"country": "United Kingdom", "cost": 2.12},
            {"country": "Ireland", "cost": 2.48},
            {"country": "Belgium", "cost": 2.56},
            {"country": "United States", "cost": 2.63},
            {"country": "Denmark", "cost": 2.73}
        ],
        "least_affordable": [
            {"country": "Japan", "cost": 6.54},
            {"country": "Thailand", "cost": 4.93},
            {"country": "Indonesia", "cost": 4.64},
            {"country": "Chile", "cost": 4.54},
            {"country": "Turkey", "cost": 4.50}
        ],
        "source": "FAO SOFI Report July 2024",
        "year": 2022,
        "unit": "PPP dollar per person per day"
    }
    
    with open('healthy_diet_cost_added.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\n📄 Summary saved to: healthy_diet_cost_added.json")

if __name__ == "__main__":
    main()