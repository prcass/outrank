#!/usr/bin/env python3
"""
Extract ALL 28 agriculture rankings from Wikipedia
Follow Wikipedia's methodology for each ranking
"""

import json
import time
from datetime import datetime

class AllAgricultureExtractor:
    def __init__(self):
        self.wikipedia_agriculture_urls = {
            # Production rankings
            "Apple": "https://en.wikipedia.org/wiki/List_of_countries_by_apple_production",
            "Apricot": "https://en.wikipedia.org/wiki/List_of_countries_by_apricot_production", 
            "Artichoke": "https://en.wikipedia.org/wiki/List_of_countries_by_artichoke_production",
            "Avocado": "https://en.wikipedia.org/wiki/List_of_countries_by_avocado_production",
            "Barley": "https://en.wikipedia.org/wiki/List_of_countries_by_barley_production",
            "Cereal": "https://en.wikipedia.org/wiki/List_of_countries_by_cereal_production",
            "Cherry": "https://en.wikipedia.org/wiki/List_of_countries_by_cherry_production",
            "Coconut": "https://en.wikipedia.org/wiki/List_of_countries_by_coconut_production",
            "Coffee": "https://en.wikipedia.org/wiki/List_of_countries_by_coffee_production",
            "Corn": "https://en.wikipedia.org/wiki/List_of_countries_by_corn_production",
            "Cucumber": "https://en.wikipedia.org/wiki/List_of_countries_by_cucumber_production",
            "Eggplant": "https://en.wikipedia.org/wiki/List_of_countries_by_eggplant_production",
            "Fruit": "https://en.wikipedia.org/wiki/List_of_countries_by_fruit_production",
            "Garlic": "https://en.wikipedia.org/wiki/List_of_countries_by_garlic_production",
            "Grape": "https://en.wikipedia.org/wiki/List_of_countries_by_grape_production",
            "Papaya": "https://en.wikipedia.org/wiki/List_of_countries_by_papaya_production",
            "Pear": "https://en.wikipedia.org/wiki/List_of_countries_by_pear_production",
            "Pineapple": "https://en.wikipedia.org/wiki/List_of_countries_by_pineapple_production",
            "Plum": "https://en.wikipedia.org/wiki/List_of_countries_by_plum_production",
            "Potato": "https://en.wikipedia.org/wiki/List_of_countries_by_potato_production",
            "Rice": "https://en.wikipedia.org/wiki/List_of_countries_by_rice_production",
            "Soybean": "https://en.wikipedia.org/wiki/List_of_countries_by_soybean_production",
            "Tomato": "https://en.wikipedia.org/wiki/List_of_countries_by_tomato_production",
            "Vegetables": "https://en.wikipedia.org/wiki/List_of_countries_by_vegetable_production",
            "Wheat": "https://en.wikipedia.org/wiki/International_wheat_production_statistics",
            "Wine": "https://en.wikipedia.org/wiki/List_of_wine-producing_countries",
            
            # Land/Area rankings
            "Forest_area": "https://en.wikipedia.org/wiki/List_of_countries_by_forest_area",
            "Irrigated_land": "https://en.wikipedia.org/wiki/List_of_countries_by_irrigated_land_area"
        }
        
        self.extracted_rankings = {}
        self.coverage_summary = {}
    
    def load_our_countries(self):
        """Load our 38 target countries"""
        with open('countries_38_final.json', 'r') as f:
            data = json.load(f)
        return {c["name"]: c["iso3"] for c in data["selected_countries"]}
    
    def extract_single_ranking(self, ranking_name, url):
        """Extract a single ranking using WebFetch"""
        print(f"\n📊 Extracting: {ranking_name}")
        print(f"URL: {url}")
        
        # This would use WebFetch to get the complete ranking
        # For now, I'll create the framework and process a few key ones
        
        ranking_data = {
            "ranking_name": ranking_name,
            "wikipedia_url": url,
            "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "pending_extraction"
        }
        
        return ranking_data
    
    def process_all_rankings(self):
        """Process all 28 agriculture rankings"""
        print("🌾 EXTRACTING ALL 28 AGRICULTURE RANKINGS")
        print("=" * 55)
        print("Following Wikipedia methodology for each ranking")
        print()
        
        our_countries = self.load_our_countries()
        
        extraction_queue = []
        
        for ranking_name, url in self.wikipedia_agriculture_urls.items():
            print(f"📋 {ranking_name}: {url}")
            extraction_queue.append({
                "name": ranking_name,
                "url": url,
                "priority": self.get_priority(ranking_name)
            })
        
        print(f"\nTotal rankings to extract: {len(extraction_queue)}")
        
        # Sort by priority (most useful rankings first)
        extraction_queue.sort(key=lambda x: x["priority"], reverse=True)
        
        return extraction_queue
    
    def get_priority(self, ranking_name):
        """Assign priority to rankings based on usefulness for games"""
        high_priority = ["Coffee", "Wine", "Wheat", "Rice", "Potato", "Forest_area"]
        medium_priority = ["Apple", "Corn", "Tomato", "Grape", "Barley", "Soybean"]
        
        if ranking_name in high_priority:
            return 3
        elif ranking_name in medium_priority:
            return 2
        else:
            return 1

def extract_high_priority_rankings():
    """Extract the most important rankings first"""
    
    high_priority_rankings = [
        {
            "name": "Coffee",
            "url": "https://en.wikipedia.org/wiki/List_of_countries_by_coffee_production",
            "extract_prompt": "Extract the complete coffee production ranking table. Include: 1) Data source and year, 2) Complete ranking with all countries (rank, country, production amount), 3) Total world production, 4) References and external links."
        },
        {
            "name": "Wine", 
            "url": "https://en.wikipedia.org/wiki/List_of_wine-producing_countries",
            "extract_prompt": "Extract the complete wine production ranking table. Include: 1) Data source and year, 2) Complete ranking with all countries (rank, country, production amount), 3) Total world production, 4) References and external links."
        },
        {
            "name": "Wheat",
            "url": "https://en.wikipedia.org/wiki/International_wheat_production_statistics", 
            "extract_prompt": "Extract the complete wheat production ranking table. Include: 1) Data source and year, 2) Complete ranking with all countries (rank, country, production amount), 3) Total world production, 4) References and external links."
        },
        {
            "name": "Rice",
            "url": "https://en.wikipedia.org/wiki/List_of_countries_by_rice_production",
            "extract_prompt": "Extract the complete rice production ranking table. Include: 1) Data source and year, 2) Complete ranking with all countries (rank, country, production amount), 3) Total world production, 4) References and external links."
        },
        {
            "name": "Forest_area",
            "url": "https://en.wikipedia.org/wiki/List_of_countries_by_forest_area",
            "extract_prompt": "Extract the complete forest area ranking table. Include: 1) Data source and year, 2) Complete ranking with all countries (rank, country, forest area), 3) References and external links."
        }
    ]
    
    return high_priority_rankings

def main():
    print("🤖 AUTOMATED EXTRACTION OF ALL WIKIPEDIA AGRICULTURE RANKINGS")
    print("=" * 70)
    print("NO manual steps, following Wikipedia's curated sources")
    print()
    
    extractor = AllAgricultureExtractor()
    
    # Process all rankings
    extraction_queue = extractor.process_all_rankings()
    
    print(f"\n🎯 EXTRACTION PRIORITY ORDER:")
    for i, item in enumerate(extraction_queue[:10], 1):
        priority_label = {3: "HIGH", 2: "MEDIUM", 1: "LOW"}[item["priority"]]
        print(f"{i:2d}. {item['name']} ({priority_label})")
    
    # Get high priority rankings for immediate extraction
    high_priority = extract_high_priority_rankings()
    
    print(f"\n🚀 READY TO EXTRACT {len(high_priority)} HIGH-PRIORITY RANKINGS:")
    for ranking in high_priority:
        print(f"  • {ranking['name']}")
    
    # Save extraction plan
    extraction_plan = {
        "total_rankings": len(extraction_queue),
        "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "methodology": "Wikipedia curated sources with complete data extraction",
        "all_rankings": extraction_queue,
        "high_priority_immediate": high_priority,
        "next_steps": [
            "Extract high-priority rankings using WebFetch",
            "Parse complete ranking tables",
            "Calculate coverage for our 38 countries", 
            "Select rankings with 75%+ coverage",
            "Add to final dataset"
        ]
    }
    
    with open('agriculture_extraction_plan.json', 'w') as f:
        json.dump(extraction_plan, f, indent=2)
    
    print(f"\n📁 Extraction plan saved to: agriculture_extraction_plan.json")
    print(f"\n✅ READY TO BEGIN AUTOMATED EXTRACTION")
    print("Will extract all rankings systematically using Wikipedia's sources")

if __name__ == "__main__":
    main()