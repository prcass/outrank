#!/usr/bin/env python3
"""
Extract ALL agriculture rankings from Wikipedia list
Get all countries data first, analyze coverage later
"""

import json
import time
from datetime import datetime

class AgricultureRankingsExtractor:
    def __init__(self):
        self.rankings = []
        self.extraction_log = []
        
    def create_ranking_template(self, ranking_name, description, source, year, data_type="value"):
        """Create a template for each agriculture ranking"""
        return {
            "ranking_name": ranking_name,
            "category": "Agriculture",
            "description": description,
            "source": source,
            "source_url": "",  # To be filled when data provided
            "year": year,
            "data_type": data_type,  # value, percentage, rank, etc.
            "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "all_countries_data": {},  # Store ALL countries, not just our 38
            "total_countries": 0,
            "data_range": {
                "min": None,
                "max": None,
                "unit": ""
            }
        }
    
    def define_agriculture_rankings(self):
        """Define all agriculture rankings from Wikipedia page"""
        
        agriculture_rankings = [
            {
                "name": "Agricultural Output (Total)",
                "description": "Total agricultural production value by country",
                "typical_source": "FAO (Food and Agriculture Organization)",
                "data_type": "value",
                "unit": "billion USD"
            },
            {
                "name": "Agricultural Output (Per Capita)",
                "description": "Agricultural production value per person",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "USD per capita"
            },
            {
                "name": "Cereal Production",
                "description": "Total cereal grain production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Wheat Production",
                "description": "Total wheat production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Rice Production",
                "description": "Total rice production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Corn/Maize Production",
                "description": "Total corn/maize production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Coffee Production",
                "description": "Total coffee production by country",
                "typical_source": "International Coffee Organization",
                "data_type": "value",
                "unit": "thousand 60kg bags"
            },
            {
                "name": "Tea Production",
                "description": "Total tea production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "thousand tonnes"
            },
            {
                "name": "Sugar Production",
                "description": "Total sugar production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Wine Production",
                "description": "Total wine production by country",
                "typical_source": "International Organisation of Vine and Wine",
                "data_type": "value",
                "unit": "million hectolitres"
            },
            {
                "name": "Beer Production",
                "description": "Total beer production by country",
                "typical_source": "Various brewing associations",
                "data_type": "value",
                "unit": "million hectolitres"
            },
            {
                "name": "Meat Production",
                "description": "Total meat production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Milk Production",
                "description": "Total milk production by country",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Fish and Seafood Production",
                "description": "Total fisheries and aquaculture production",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "million tonnes"
            },
            {
                "name": "Agricultural Land Area",
                "description": "Total agricultural land area by country",
                "typical_source": "FAO/World Bank",
                "data_type": "value",
                "unit": "thousand sq km"
            },
            {
                "name": "Arable Land (% of land area)",
                "description": "Percentage of land area that is arable",
                "typical_source": "World Bank",
                "data_type": "percentage",
                "unit": "%"
            },
            {
                "name": "Agricultural Employment",
                "description": "Percentage of workforce in agriculture",
                "typical_source": "ILO/World Bank",
                "data_type": "percentage",
                "unit": "% of total employment"
            },
            {
                "name": "Food Security Index",
                "description": "Global Food Security Index ranking",
                "typical_source": "Economist Intelligence Unit",
                "data_type": "rank",
                "unit": "rank"
            },
            {
                "name": "Agricultural Exports",
                "description": "Total agricultural export value",
                "typical_source": "WTO/FAO",
                "data_type": "value",
                "unit": "billion USD"
            },
            {
                "name": "Agricultural Imports",
                "description": "Total agricultural import value",
                "typical_source": "WTO/FAO",
                "data_type": "value",
                "unit": "billion USD"
            },
            {
                "name": "Organic Farming Area",
                "description": "Total area under organic farming",
                "typical_source": "FiBL & IFOAM",
                "data_type": "value",
                "unit": "million hectares"
            },
            {
                "name": "Fertilizer Consumption",
                "description": "Fertilizer consumption per hectare of arable land",
                "typical_source": "FAO",
                "data_type": "value",
                "unit": "kg per hectare"
            },
            {
                "name": "Irrigation Coverage",
                "description": "Percentage of agricultural land that is irrigated",
                "typical_source": "FAO",
                "data_type": "percentage",
                "unit": "%"
            },
            {
                "name": "Agricultural Productivity",
                "description": "Agricultural value added per worker",
                "typical_source": "World Bank",
                "data_type": "value",
                "unit": "constant 2015 USD"
            },
            {
                "name": "Crop Yield Index",
                "description": "Average crop yield compared to global average",
                "typical_source": "FAO",
                "data_type": "index",
                "unit": "index (100 = global avg)"
            }
        ]
        
        return agriculture_rankings
    
    def extract_sample_data(self, ranking_info):
        """Create sample extraction for a ranking - to be replaced with real data"""
        
        ranking = self.create_ranking_template(
            ranking_name=ranking_info["name"],
            description=ranking_info["description"],
            source=ranking_info["typical_source"],
            year=2024,  # Will be updated with actual year
            data_type=ranking_info["data_type"]
        )
        
        # This is where real data would be extracted
        # For now, showing the structure
        print(f"\n📊 {ranking_info['name']}")
        print(f"   Description: {ranking_info['description']}")
        print(f"   Source: {ranking_info['typical_source']}")
        print(f"   Data Type: {ranking_info['data_type']}")
        print(f"   Unit: {ranking_info.get('unit', 'N/A')}")
        print(f"   Status: ⏳ Awaiting data...")
        
        return ranking
    
    def process_all_agriculture_rankings(self):
        """Process all agriculture rankings"""
        
        rankings_list = self.define_agriculture_rankings()
        
        print(f"\n📋 AGRICULTURE RANKINGS TO EXTRACT: {len(rankings_list)}")
        print("=" * 60)
        
        for i, ranking_info in enumerate(rankings_list, 1):
            print(f"\n{i}. {ranking_info['name']}")
            print(f"   • {ranking_info['description']}")
            print(f"   • Expected source: {ranking_info['typical_source']}")
            print(f"   • Data type: {ranking_info['data_type']} ({ranking_info.get('unit', '')})")
        
        return rankings_list
    
    def create_extraction_instructions(self):
        """Create instructions for data extraction"""
        
        instructions = {
            "extraction_method": "Extract ALL countries data from each ranking",
            "data_format": "Provide data in any of these formats:",
            "acceptable_formats": [
                "Copy/paste tables from source websites",
                "CSV data",
                "JSON data", 
                "PDF content",
                "Direct values listing"
            ],
            "example_format": """
Example data format:
=== Wheat Production 2024 ===
Source: FAO
China: 134.3 million tonnes
India: 107.6 million tonnes
Russia: 85.9 million tonnes
United States: 49.7 million tonnes
[... all countries ...]
            """,
            "coverage_analysis": "After extraction, we will analyze which of our 38 countries are covered",
            "flexibility": "We keep ALL data, allowing us to switch countries if needed"
        }
        
        return instructions

def main():
    print("🌾 AGRICULTURE RANKINGS EXTRACTION - ALL COUNTRIES")
    print("=" * 60)
    print("Extract ALL data first, analyze coverage later")
    print()
    
    # Initialize extractor
    extractor = AgricultureRankingsExtractor()
    
    # Get all agriculture rankings
    rankings_list = extractor.process_all_agriculture_rankings()
    
    # Create extraction instructions
    instructions = extractor.create_extraction_instructions()
    
    # Save the template
    output = {
        "category": "Agriculture",
        "total_rankings": len(rankings_list),
        "rankings_list": rankings_list,
        "extraction_instructions": instructions,
        "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "Awaiting data for all rankings"
    }
    
    with open('agriculture_rankings_template.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n📁 Template saved to: agriculture_rankings_template.json")
    
    print(f"\n🎯 NEXT STEPS:")
    print("1. Provide data for any/all of these agriculture rankings")
    print("2. I'll extract ALL countries (not just our 38)")
    print("3. We'll analyze coverage for our target countries")
    print("4. Select best rankings based on coverage and interest")
    print("5. Add to final dataset")
    
    print(f"\n💡 BENEFITS OF THIS APPROACH:")
    print("• Maximum flexibility - can change country list later")
    print("• See global context - understand where countries rank globally")
    print("• Identify interesting patterns - find surprising leaders/laggards")
    print("• No data loss - keep everything for future use")

if __name__ == "__main__":
    main()