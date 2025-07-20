#!/usr/bin/env python3
"""
Automated framework for extracting multiple rankings from various sources
Systematic approach to build comprehensive dataset
"""

import json
import time
from datetime import datetime

class RankingsExtractor:
    def __init__(self):
        self.target_countries = self.load_target_countries()
        self.rankings_database = []
        self.extraction_log = []
        
    def load_target_countries(self):
        """Load our 38 target countries"""
        with open('countries_38_final.json', 'r') as f:
            data = json.load(f)
        
        countries = {}
        for country in data["selected_countries"]:
            countries[country["name"]] = {
                "iso3": country["iso3"],
                "variations": self.get_country_variations(country["name"])
            }
        return countries
    
    def get_country_variations(self, country_name):
        """Get common variations of country names"""
        variations = {
            "United States": ["USA", "United States of America", "US", "U.S.", "U.S.A."],
            "United Kingdom": ["UK", "Great Britain", "Britain", "United Kingdom of Great Britain and Northern Ireland"],
            "South Korea": ["Korea, South", "Republic of Korea", "Korea (South)", "Korea Rep."],
            "Czech Republic": ["Czechia", "Czech Rep."],
            "Netherlands": ["Holland", "Netherlands (Kingdom of the)"],
            "New Zealand": ["NZ"],
            "South Africa": ["RSA", "Republic of South Africa"],
            "Vietnam": ["Viet Nam"],
            "China": ["China, People's Republic", "PRC", "People's Republic of China", "China PR"]
        }
        return variations.get(country_name, [country_name])
    
    def create_ranking_template(self, ranking_info):
        """Create a template for a new ranking"""
        return {
            "ranking_name": ranking_info["name"],
            "category": ranking_info["category"],
            "source": ranking_info["source"],
            "source_url": ranking_info["url"],
            "year": ranking_info["year"],
            "description": ranking_info["description"],
            "higher_is_better": ranking_info.get("higher_is_better", True),
            "data_type": ranking_info.get("data_type", "rank"),  # rank, score, percentage
            "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "countries_data": {},
            "coverage": {
                "target_countries": len(self.target_countries),
                "countries_found": 0,
                "coverage_percent": 0.0,
                "missing_countries": []
            }
        }
    
    def process_ranking_data(self, ranking_info, data_table):
        """Process ranking data and check coverage"""
        ranking = self.create_ranking_template(ranking_info)
        
        # Try to match countries from data table
        matched_countries = []
        unmatched_countries = []
        
        for country_name, country_info in self.target_countries.items():
            found = False
            
            # Check main name and variations
            all_names = [country_name] + country_info["variations"]
            
            for name_variant in all_names:
                if self.find_country_in_data(name_variant, data_table):
                    matched_countries.append(country_name)
                    # Extract the data point (rank, score, etc.)
                    data_value = self.extract_data_value(name_variant, data_table, ranking["data_type"])
                    ranking["countries_data"][country_name] = data_value
                    found = True
                    break
            
            if not found:
                unmatched_countries.append(country_name)
        
        # Update coverage statistics
        ranking["coverage"]["countries_found"] = len(matched_countries)
        ranking["coverage"]["coverage_percent"] = (len(matched_countries) / len(self.target_countries)) * 100
        ranking["coverage"]["missing_countries"] = unmatched_countries
        
        return ranking
    
    def find_country_in_data(self, country_name, data_table):
        """Check if country exists in data table"""
        # This is a placeholder - actual implementation would search the data
        # For now, return True to simulate finding countries
        return True
    
    def extract_data_value(self, country_name, data_table, data_type):
        """Extract the actual data value for a country"""
        # This is a placeholder - actual implementation would extract real values
        # For now, return sample data
        import random
        if data_type == "rank":
            return random.randint(1, 150)
        elif data_type == "score":
            return round(random.uniform(0, 100), 2)
        elif data_type == "percentage":
            return round(random.uniform(0, 100), 1)
    
    def batch_process_rankings(self, rankings_list):
        """Process multiple rankings in batch"""
        results = {
            "processed": [],
            "complete_coverage": [],
            "partial_coverage": [],
            "insufficient_coverage": []
        }
        
        for ranking_info in rankings_list:
            print(f"\n🔍 Processing: {ranking_info['name']}")
            
            # Simulate data table (in reality, this would be provided)
            data_table = {}  # Placeholder
            
            ranking = self.process_ranking_data(ranking_info, data_table)
            
            # Categorize by coverage
            coverage = ranking["coverage"]["coverage_percent"]
            
            if coverage == 100:
                results["complete_coverage"].append(ranking)
                print(f"  ✅ 100% coverage - READY TO USE")
            elif coverage >= 95:
                results["partial_coverage"].append(ranking)
                print(f"  ⚠️  {coverage:.1f}% coverage - NEAR COMPLETE")
            else:
                results["insufficient_coverage"].append(ranking)
                print(f"  ❌ {coverage:.1f}% coverage - INSUFFICIENT")
            
            results["processed"].append(ranking)
            
            # Log the extraction
            self.extraction_log.append({
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "ranking": ranking_info["name"],
                "coverage": coverage,
                "status": "complete" if coverage == 100 else "partial" if coverage >= 95 else "insufficient"
            })
        
        return results
    
    def generate_extraction_report(self, results):
        """Generate a summary report of extraction results"""
        report = {
            "extraction_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "summary": {
                "total_processed": len(results["processed"]),
                "complete_coverage": len(results["complete_coverage"]),
                "partial_coverage": len(results["partial_coverage"]),
                "insufficient_coverage": len(results["insufficient_coverage"])
            },
            "ready_to_use": [
                {
                    "name": r["ranking_name"],
                    "category": r["category"],
                    "source": r["source"],
                    "year": r["year"]
                }
                for r in results["complete_coverage"]
            ],
            "near_complete": [
                {
                    "name": r["ranking_name"],
                    "coverage": r["coverage"]["coverage_percent"],
                    "missing": r["coverage"]["missing_countries"]
                }
                for r in results["partial_coverage"]
            ]
        }
        
        return report

def create_sample_rankings_list():
    """Create a sample list of rankings to process"""
    rankings = [
        {
            "name": "Human Development Index",
            "category": "Quality of Life",
            "source": "United Nations Development Programme",
            "url": "https://hdr.undp.org/data-center/human-development-index",
            "year": 2024,
            "description": "Composite index measuring average achievement in human development",
            "higher_is_better": True,
            "data_type": "score"
        },
        {
            "name": "Global Innovation Index",
            "category": "Innovation",
            "source": "World Intellectual Property Organization",
            "url": "https://www.wipo.int/global_innovation_index/",
            "year": 2024,
            "description": "Ranking of countries by innovation capacity and output",
            "higher_is_better": False,
            "data_type": "rank"
        },
        {
            "name": "Environmental Performance Index",
            "category": "Environment",
            "source": "Yale University",
            "url": "https://epi.yale.edu/",
            "year": 2024,
            "description": "Environmental health and ecosystem vitality",
            "higher_is_better": True,
            "data_type": "score"
        },
        {
            "name": "Press Freedom Index",
            "category": "Civil Liberties",
            "source": "Reporters Without Borders",
            "url": "https://rsf.org/en/ranking",
            "year": 2024,
            "description": "Press freedom ranking",
            "higher_is_better": False,
            "data_type": "rank"
        },
        {
            "name": "Global Competitiveness Index",
            "category": "Economic",
            "source": "World Economic Forum",
            "url": "https://www.weforum.org/",
            "year": 2024,
            "description": "Economic competitiveness of countries",
            "higher_is_better": True,
            "data_type": "score"
        }
    ]
    
    return rankings

def main():
    print("🤖 AUTOMATED RANKINGS EXTRACTION FRAMEWORK")
    print("=" * 50)
    print("Systematic approach to extract multiple rankings")
    print()
    
    # Initialize extractor
    extractor = RankingsExtractor()
    
    # Create sample rankings list
    rankings_to_process = create_sample_rankings_list()
    
    print(f"📋 Rankings to process: {len(rankings_to_process)}")
    for ranking in rankings_to_process:
        print(f"  • {ranking['name']} ({ranking['category']})")
    
    # Process rankings in batch
    results = extractor.batch_process_rankings(rankings_to_process)
    
    # Generate report
    report = extractor.generate_extraction_report(results)
    
    # Save results
    with open('automated_extraction_results.json', 'w') as f:
        json.dump({
            "results": results,
            "report": report,
            "extraction_log": extractor.extraction_log
        }, f, indent=2)
    
    print(f"\n📊 EXTRACTION SUMMARY:")
    print(f"Total processed: {report['summary']['total_processed']}")
    print(f"Complete coverage (100%): {report['summary']['complete_coverage']}")
    print(f"Near complete (95%+): {report['summary']['partial_coverage']}")
    print(f"Insufficient (<95%): {report['summary']['insufficient_coverage']}")
    
    if report["ready_to_use"]:
        print(f"\n✅ READY TO USE:")
        for ranking in report["ready_to_use"]:
            print(f"  • {ranking['name']} ({ranking['year']})")
    
    print(f"\n📁 Results saved to: automated_extraction_results.json")
    
    print(f"\n🚀 NEXT STEPS FOR FULL AUTOMATION:")
    print("1. Provide ranking data in structured format (CSV, JSON, or tables)")
    print("2. Run extractor on all rankings")
    print("3. Automatically filter to 100% coverage")
    print("4. Add to existing dataset")
    print("5. Generate final comprehensive dataset")

if __name__ == "__main__":
    main()