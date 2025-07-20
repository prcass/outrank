#!/usr/bin/env python3
"""
Get ACTUAL World Bank indicators - no assumptions
Query the World Bank API to see what indicators actually exist
"""

import urllib.request
import json
import time

def get_all_wb_indicators():
    """Get all available World Bank indicators from their API"""
    print("🔍 Fetching ALL World Bank indicators from API...")
    
    all_indicators = []
    page = 1
    per_page = 1000
    
    while True:
        url = f"https://api.worldbank.org/v2/indicator?format=json&per_page={per_page}&page={page}"
        
        try:
            print(f"  Fetching page {page}...", end=" ")
            with urllib.request.urlopen(url, timeout=10) as response:
                data = json.loads(response.read().decode())
            
            if len(data) > 1 and data[1]:
                indicators_on_page = len(data[1])
                print(f"Got {indicators_on_page} indicators")
                
                for indicator in data[1]:
                    all_indicators.append({
                        "id": indicator["id"],
                        "name": indicator["name"],
                        "source": indicator.get("source", {}).get("value", ""),
                        "topics": [t.get("value", "") for t in indicator.get("topics", [])],
                        "unit": indicator.get("unit", ""),
                        "sourceNote": indicator.get("sourceNote", "")[:200]  # Truncate long descriptions
                    })
                
                # Check if we have more pages
                total_pages = data[0]["pages"]
                print(f"    (Page {page} of {total_pages})")
                
                if page >= total_pages:
                    break
                    
                page += 1
                time.sleep(0.5)  # Rate limiting
            else:
                break
                
        except Exception as e:
            print(f"Error: {e}")
            break
    
    return all_indicators

def filter_interesting_indicators(indicators):
    """Filter for indicators that would make interesting game challenges"""
    print(f"\n🎯 Filtering {len(indicators)} indicators for interesting game challenges...")
    
    # Keywords that suggest interesting/fun data for ranking games
    interesting_keywords = [
        # Demographics & Population
        "population", "birth", "death", "mortality", "life expectancy", "age",
        
        # Economy & Development  
        "gdp", "income", "wealth", "poverty", "unemployment", "inflation",
        "export", "import", "trade", "business", "ease of doing",
        
        # Technology & Digital
        "internet", "mobile", "phone", "computer", "technology", "broadband",
        "digital", "online",
        
        # Health & Lifestyle
        "health", "hospital", "doctor", "physician", "medical", "disease",
        "nutrition", "obesity", "overweight", "alcohol", "smoking", "tobacco",
        
        # Education
        "education", "school", "literacy", "enrollment", "university", "tertiary",
        "primary", "secondary",
        
        # Environment & Energy
        "energy", "electricity", "renewable", "co2", "emissions", "pollution",
        "forest", "water", "sanitation", "environment",
        
        # Tourism & Transport
        "tourism", "tourist", "travel", "transport", "airport", "road",
        "infrastructure",
        
        # Social & Cultural
        "women", "female", "gender", "child", "refugee", "migration",
        
        # Innovation & Research
        "research", "development", "patent", "innovation", "science"
    ]
    
    filtered = []
    
    for indicator in indicators:
        name_lower = indicator["name"].lower()
        note_lower = indicator["sourceNote"].lower()
        
        # Check if any interesting keyword appears in name or description
        if any(keyword in name_lower or keyword in note_lower for keyword in interesting_keywords):
            # Skip overly technical or administrative indicators
            skip_keywords = ["metadata", "statistical", "methodology", "classification", 
                           "code", "index number", "deflator", "constant", "current prices"]
            
            if not any(skip in name_lower for skip in skip_keywords):
                filtered.append(indicator)
    
    return filtered

def main():
    print("🌍 ACTUAL WORLD BANK INDICATORS - NO ASSUMPTIONS")
    print("=" * 60)
    
    # Get all actual indicators from World Bank API
    all_indicators = get_all_wb_indicators()
    
    print(f"\n📊 Found {len(all_indicators)} total World Bank indicators")
    
    # Filter for interesting ones
    interesting = filter_interesting_indicators(all_indicators)
    
    print(f"📊 Filtered to {len(interesting)} potentially interesting indicators")
    
    # Sort by name for readability
    interesting.sort(key=lambda x: x["name"])
    
    # Show top 50 most promising for games
    print(f"\n🎯 TOP 50 ACTUAL WORLD BANK INDICATORS FOR GAME CHALLENGES:")
    print("=" * 80)
    
    top_50 = interesting[:50]
    
    for i, indicator in enumerate(top_50, 1):
        print(f"{i:2d}. {indicator['name']}")
        print(f"    Code: {indicator['id']}")
        print(f"    Source: {indicator['source']}")
        if indicator['unit']:
            print(f"    Unit: {indicator['unit']}")
        if indicator['sourceNote']:
            print(f"    Note: {indicator['sourceNote'][:100]}...")
        print()
    
    # Save all results
    output = {
        "fetch_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "total_indicators_found": len(all_indicators),
        "interesting_indicators_count": len(interesting),
        "top_50_for_games": top_50,
        "all_interesting": interesting,
        "methodology": "Direct World Bank API query - no assumptions"
    }
    
    with open('actual_wb_indicators.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"✅ ACTUAL WORLD BANK DATA RETRIEVED!")
    print(f"📁 Full results saved to: actual_wb_indicators.json")
    print(f"📊 Total indicators available: {len(all_indicators)}")
    print(f"📊 Game-suitable indicators: {len(interesting)}")
    print(f"📊 Top 50 shown above")
    
    print(f"\n💡 NEXT STEP:")
    print(f"Review the 50 actual indicators and select which ones to test for data availability")

if __name__ == "__main__":
    main()