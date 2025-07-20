#!/usr/bin/env python3
"""
Quick Dataset Selection: 40 Countries + 40 Fun Challenges
Efficient approach - test core indicators only
"""

import urllib.request
import json
import time

def test_key_indicators(country_iso3):
    """Test just 5 key indicators for speed"""
    key_indicators = [
        "SP.POP.TOTL",        # Population  
        "NY.GDP.PCAP.CD",     # GDP per capita
        "SP.DYN.LE00.IN",     # Life expectancy
        "IT.NET.USER.ZS",     # Internet users
        "ST.INT.ARVL"         # Tourist arrivals
    ]
    
    available = 0
    for indicator in key_indicators:
        url = f"https://api.worldbank.org/v2/country/{country_iso3}/indicator/{indicator}"
        params = "?format=json&date=2022:2024&per_page=1"
        
        try:
            with urllib.request.urlopen(url + params, timeout=3) as response:
                data = json.loads(response.read().decode())
                
            if len(data) > 1 and data[1] and data[1][0]["value"] is not None:
                available += 1
                
        except:
            pass
        
        time.sleep(0.1)
    
    return available, len(key_indicators)

def main():
    print("🚀 Quick Dataset Selection - Testing Core Indicators Only")
    print("=" * 60)
    
    # Pre-selected countries known to have good World Bank data
    excellent_countries = {
        # Major economies (excellent data)
        "USA": "United States", "CHN": "China", "JPN": "Japan", "DEU": "Germany",
        "GBR": "United Kingdom", "FRA": "France", "ITA": "Italy", "CAN": "Canada",
        "AUS": "Australia", "KOR": "South Korea", "ESP": "Spain", "NLD": "Netherlands",
        
        # Nordic countries (excellent data)  
        "SWE": "Sweden", "NOR": "Norway", "DNK": "Denmark", "FIN": "Finland",
        "ISL": "Iceland",
        
        # Other developed (good data)
        "CHE": "Switzerland", "BEL": "Belgium", "AUT": "Austria", "NZL": "New Zealand",
        "SGP": "Singapore", "ISR": "Israel", "IRL": "Ireland", "LUX": "Luxembourg",
        
        # Major emerging (decent data)
        "BRA": "Brazil", "MEX": "Mexico", "ARG": "Argentina", "CHL": "Chile",
        "COL": "Colombia", "TUR": "Turkey", "POL": "Poland", "CZE": "Czech Republic",
        
        # Asia Pacific (good data)
        "THA": "Thailand", "MYS": "Malaysia", "PHL": "Philippines", "IDN": "Indonesia",
        "VNM": "Vietnam", "IND": "India",
        
        # Others with interesting data
        "ZAF": "South Africa", "EGY": "Egypt", "MAR": "Morocco", "URY": "Uruguay",
        "CRI": "Costa Rica", "PAN": "Panama", "EST": "Estonia", "RUS": "Russia"
    }
    
    print(f"Testing {len(excellent_countries)} pre-selected countries...")
    
    country_scores = {}
    
    for iso3, name in excellent_countries.items():
        print(f"🌍 {name[:20]:20} ({iso3})...", end=" ")
        available, total = test_key_indicators(iso3)
        score = (available / total) * 100
        
        country_scores[iso3] = {
            "name": name,
            "score": score,
            "available": available,
            "total": total
        }
        
        print(f"{available}/{total} = {score:3.0f}%")
    
    # Select top 40
    sorted_countries = sorted(country_scores.items(), 
                             key=lambda x: x[1]["score"], 
                             reverse=True)
    
    selected_40 = sorted_countries[:40]
    
    print(f"\n🏆 TOP 40 SELECTED COUNTRIES:")
    print("-" * 50)
    
    for i, (iso3, data) in enumerate(selected_40, 1):
        print(f"{i:2d}. {data['name']:25} ({iso3}) - {data['score']:3.0f}%")
    
    # Define 40 awesome challenges based on known World Bank indicators
    awesome_challenges = [
        # Demographics & Society (10 challenges)
        "Which country has the most people?",
        "Which country has the youngest population?", 
        "Which country has the oldest population?",
        "Which country has the highest life expectancy?",
        "Which country has the most women in the workforce?",
        "Which country has the lowest child mortality?",
        "Which country has the highest birth rate?",
        "Which country has the most urban population?",
        "Which country has the most rural population?",
        "Which country has the most refugees?",
        
        # Economy & Wealth (10 challenges)
        "Which country has the highest GDP per person?",
        "Which country has the fastest economic growth?",
        "Which country has the highest unemployment?",
        "Which country has the worst inflation?",
        "Which country is easiest to start a business?",
        "Which country exports the most?",
        "Which country imports the most?",
        "Which country has the most income inequality?",
        "Which country has the highest minimum wage?",
        "Which country has the most billionaires per capita?",
        
        # Technology & Digital (5 challenges)
        "Which country is most connected to the internet?",
        "Which country has the most mobile phones per person?",
        "Which country has the fastest internet?",
        "Which country spends most on research & development?",
        "Which country has the most tech patents?",
        
        # Environment & Energy (5 challenges)
        "Which country pollutes the most CO2 per person?",
        "Which country has the most renewable energy?",
        "Which country has the most forest coverage?",
        "Which country uses the most electricity per person?",
        "Which country has the cleanest air?",
        
        # Health & Lifestyle (5 challenges)
        "Which country has the most overweight people?",
        "Which country drinks the most alcohol?",
        "Which country has the most smokers?",
        "Which country spends most on healthcare?",
        "Which country has the most doctors per person?",
        
        # Travel & Tourism (5 challenges)  
        "Which country gets the most tourists?",
        "Which country makes the most from tourism?",
        "Which country has the most airports?",
        "Which country has the strongest passport?",
        "Which country has the most UNESCO sites?"
    ]
    
    print(f"\n🎯 PROPOSED 40 AWESOME CHALLENGES:")
    print("-" * 50)
    
    for i, challenge in enumerate(awesome_challenges, 1):
        print(f"{i:2d}. {challenge}")
    
    # Create output
    result = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "selected_countries": [
            {"rank": i+1, "iso3": iso3, "name": data["name"], "data_score": data["score"]}
            for i, (iso3, data) in enumerate(selected_40)
        ],
        "proposed_challenges": [
            {"id": i+1, "challenge": challenge}
            for i, challenge in enumerate(awesome_challenges)
        ],
        "method": "Tested 5 core World Bank indicators for data availability",
        "total_tested": len(excellent_countries)
    }
    
    with open('quick_dataset_selection.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    
    print(f"\n✅ QUICK SELECTION COMPLETE!")
    print(f"📁 Results saved to: quick_dataset_selection.json") 
    print(f"🌍 Countries: {len(selected_40)} selected")
    print(f"🎯 Challenges: {len(awesome_challenges)} proposed")
    
    print(f"\n💡 NEXT STEP:")
    print("Review the selections and verify specific World Bank indicator codes")

if __name__ == "__main__":
    main()