#!/usr/bin/env python3
"""
Extract EXACT agriculture rankings from Wikipedia list
Use the actual list from Wikipedia, not assumptions
"""

import json
import time
from datetime import datetime

class WikipediaAgricultureExtractor:
    def __init__(self):
        self.rankings = []
        
    def get_exact_wikipedia_agriculture_list(self):
        """Get the EXACT agriculture rankings list from Wikipedia"""
        
        # EXACT list from Wikipedia's List of international rankings - Agriculture section
        wikipedia_agriculture_rankings = [
            # Production rankings
            {"name": "Apple production", "category": "Production", "unit": "tonnes"},
            {"name": "Apricot production", "category": "Production", "unit": "tonnes"},
            {"name": "Artichoke production", "category": "Production", "unit": "tonnes"},
            {"name": "Avocado production", "category": "Production", "unit": "tonnes"},
            {"name": "Barley production", "category": "Production", "unit": "tonnes"},
            {"name": "Cereal production", "category": "Production", "unit": "tonnes"},
            {"name": "Cherry production", "category": "Production", "unit": "tonnes"},
            {"name": "Coconut production", "category": "Production", "unit": "tonnes"},
            {"name": "Coffee production", "category": "Production", "unit": "tonnes or bags"},
            {"name": "Corn production", "category": "Production", "unit": "tonnes"},
            {"name": "Cucumber production", "category": "Production", "unit": "tonnes"},
            {"name": "Eggplant production", "category": "Production", "unit": "tonnes"},
            {"name": "Fruit production", "category": "Production", "unit": "tonnes"},
            {"name": "Garlic production", "category": "Production", "unit": "tonnes"},
            {"name": "Grape production", "category": "Production", "unit": "tonnes"},
            {"name": "Papaya production", "category": "Production", "unit": "tonnes"},
            {"name": "Pear production", "category": "Production", "unit": "tonnes"},
            {"name": "Pineapple production", "category": "Production", "unit": "tonnes"},
            {"name": "Plum production", "category": "Production", "unit": "tonnes"},
            {"name": "Potato production", "category": "Production", "unit": "tonnes"},
            {"name": "Rice production", "category": "Production", "unit": "tonnes"},
            {"name": "Soybean production", "category": "Production", "unit": "tonnes"},
            {"name": "Tomato production", "category": "Production", "unit": "tonnes"},
            {"name": "Vegetables production", "category": "Production", "unit": "tonnes"},
            {"name": "Wheat production", "category": "Production", "unit": "tonnes"},
            {"name": "Wine production", "category": "Production", "unit": "hectolitres"},
            
            # Land/Area rankings
            {"name": "Forest area", "category": "Land", "unit": "sq km or %"},
            {"name": "Irrigated land area", "category": "Land", "unit": "sq km or %"}
        ]
        
        return wikipedia_agriculture_rankings
    
    def create_ranking_template(self, ranking_info):
        """Create a template for each ranking"""
        return {
            "ranking_name": ranking_info["name"],
            "category": "Agriculture - " + ranking_info["category"],
            "unit": ranking_info["unit"],
            "source": "TBD - from Wikipedia links",
            "source_url": "",
            "year": "",
            "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "all_countries_data": {},
            "total_countries": 0,
            "data_status": "Awaiting data"
        }
    
    def display_exact_list(self):
        """Display the exact Wikipedia agriculture rankings"""
        
        rankings = self.get_exact_wikipedia_agriculture_list()
        
        print("📋 EXACT WIKIPEDIA AGRICULTURE RANKINGS")
        print("=" * 50)
        print("From: https://en.wikipedia.org/wiki/List_of_international_rankings")
        print()
        
        # Group by category
        production_rankings = [r for r in rankings if r["category"] == "Production"]
        land_rankings = [r for r in rankings if r["category"] == "Land"]
        
        print("🌾 PRODUCTION RANKINGS:")
        for i, ranking in enumerate(production_rankings, 1):
            print(f"{i:2d}. {ranking['name']} (unit: {ranking['unit']})")
        
        print(f"\n🌍 LAND/AREA RANKINGS:")
        for i, ranking in enumerate(land_rankings, 1):
            print(f"{i:2d}. {ranking['name']} (unit: {ranking['unit']})")
        
        print(f"\nTotal rankings: {len(rankings)}")
        
        return rankings
    
    def create_extraction_structure(self):
        """Create the structure for extracting all these rankings"""
        
        rankings = self.get_exact_wikipedia_agriculture_list()
        extraction_structure = []
        
        for ranking in rankings:
            template = self.create_ranking_template(ranking)
            extraction_structure.append(template)
        
        return extraction_structure

def main():
    print("🌾 WIKIPEDIA AGRICULTURE RANKINGS - EXACT LIST")
    print("=" * 60)
    print("Using the EXACT list from Wikipedia - NO ASSUMPTIONS")
    print()
    
    # Initialize extractor
    extractor = WikipediaAgricultureExtractor()
    
    # Display exact list
    rankings = extractor.display_exact_list()
    
    # Create extraction structure
    extraction_structure = extractor.create_extraction_structure()
    
    # Save the structure
    output = {
        "source": "Wikipedia - List of international rankings",
        "url": "https://en.wikipedia.org/wiki/List_of_international_rankings",
        "section": "Agriculture",
        "total_rankings": len(rankings),
        "rankings_list": rankings,
        "extraction_templates": extraction_structure,
        "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "instructions": {
            "step1": "Click on each ranking link in Wikipedia",
            "step2": "Copy the data table from the source",
            "step3": "Provide data for ALL countries",
            "step4": "I'll extract and analyze coverage"
        }
    }
    
    with open('wikipedia_agriculture_exact.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n📁 Saved to: wikipedia_agriculture_exact.json")
    
    print(f"\n🎯 DATA NEEDED:")
    print("For each ranking, provide:")
    print("• The data table/values for ALL countries")
    print("• Source URL and year")
    print("• Any format: table, CSV, list, etc.")
    
    print(f"\n💡 POPULAR RANKINGS TO START WITH:")
    print("• Coffee production (interesting distribution)")
    print("• Wine production (concentrated in few countries)")
    print("• Rice production (Asia-focused)")
    print("• Wheat production (global staple)")
    print("• Forest area (environmental indicator)")

if __name__ == "__main__":
    main()