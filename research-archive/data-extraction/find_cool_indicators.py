#!/usr/bin/env python3
"""
Find the most interesting and fun World Bank indicators
"""

import urllib.request
import json
import time

def search_indicators(keyword):
    """Search for indicators by keyword"""
    url = f"https://api.worldbank.org/v2/indicator"
    params = f"?format=json&per_page=50&source=2"  # World Development Indicators
    
    try:
        with urllib.request.urlopen(url + params, timeout=30) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1:
            results = []
            for indicator in data[1]:
                if keyword.lower() in indicator["name"].lower():
                    results.append({
                        "id": indicator["id"],
                        "name": indicator["name"],
                        "note": indicator.get("sourceNote", "")[:200]
                    })
            return results
    except:
        return []

def get_all_topics():
    """Get all available topics"""
    url = "https://api.worldbank.org/v2/topic?format=json&per_page=50"
    
    try:
        with urllib.request.urlopen(url, timeout=30) as response:
            data = json.loads(response.read().decode())
            
        if len(data) > 1:
            return [(t["id"], t["value"]) for t in data[1]]
    except:
        return []

def main():
    print("🎮 Finding the COOLEST World Bank Indicators for Gaming!")
    print("=" * 60)
    
    # Search for fun/interesting keywords
    fun_keywords = [
        "alcohol", "beer", "wine", "cigarette", "tobacco",
        "mobile", "internet", "social", "facebook",
        "tourist", "visitor", "travel",
        "car", "vehicle", "transport", "traffic",
        "movie", "cinema", "entertainment",
        "obesity", "overweight", "diet",
        "happiness", "satisfaction",
        "crime", "theft", "murder",
        "marriage", "divorce", 
        "youth", "adolescent",
        "gambling", "lottery",
        "coffee", "tea", "sugar",
        "meat", "vegetarian",
        "energy drink", "fast food",
        "video game", "gaming",
        "sport", "olympic", "football",
        "billionaire", "millionaire",
        "startup", "entrepreneur",
        "renewable", "solar", "wind",
        "pollution", "plastic",
        "forest", "deforestation",
        "endangered", "species"
    ]
    
    cool_indicators = {}
    
    print("\n🔍 Searching for fun indicators...")
    
    for keyword in fun_keywords[:10]:  # Test first 10
        print(f"\n📌 Searching: {keyword}")
        results = search_indicators(keyword)
        
        if results:
            cool_indicators[keyword] = results
            for r in results[:3]:  # Show top 3
                print(f"  ✓ {r['name']}")
        else:
            print(f"  ❌ No results")
        
        time.sleep(0.5)  # Rate limit
    
    # Get some specific known cool indicators
    print("\n\n🌟 KNOWN AWESOME INDICATORS:")
    print("-" * 60)
    
    awesome_indicators = {
        "IT.NET.USER.ZS": "Individuals using the Internet (% of population)",
        "IT.CEL.SETS.P2": "Mobile cellular subscriptions (per 100 people)",
        "ST.INT.ARVL": "International tourism, number of arrivals",
        "EN.ATM.CO2E.PC": "CO2 emissions (metric tons per capita)",
        "SH.ALC.PCAP.LI": "Alcohol consumption per capita (liters of pure alcohol)",
        "NV.MNF.FBTO.ZS.UN": "Food, beverages and tobacco (% of value added in manufacturing)",
        "SH.PRV.SMOK": "Smoking prevalence (% of adults)",
        "SP.DYN.AMRT.MA": "Mortality rate, adult, male (per 1,000 male adults)",
        "SE.TER.ENRR": "School enrollment, tertiary (% gross)",
        "MS.MIL.XPND.GD.ZS": "Military expenditure (% of GDP)",
        "IC.BUS.EASE.XQ": "Ease of doing business score",
        "SL.TLF.CACT.FE.ZS": "Labor force participation rate, female (%)",
        "EG.ELC.ACCS.ZS": "Access to electricity (% of population)",
        "SH.STA.OWGH.ZS": "Prevalence of overweight (% of adults)",
        "NY.GDP.PCAP.PP.CD": "GDP per capita, PPP (current international $)",
        "SP.POP.65UP.TO.ZS": "Population ages 65 and above (% of total)",
        "SE.PRM.NENR": "School enrollment, primary (% net)",
        "SH.DYN.MORT": "Mortality rate, under-5 (per 1,000 live births)",
        "EN.ATM.PM25.MC.M3": "PM2.5 air pollution, mean annual exposure",
        "AG.LND.FRST.ZS": "Forest area (% of land area)"
    }
    
    for code, name in awesome_indicators.items():
        print(f"• {name}")
    
    print("\n\n🎯 SUGGESTED FUN CHALLENGE CATEGORIES:")
    print("-" * 60)
    
    fun_categories = {
        "🍺 Lifestyle & Consumption": [
            "Alcohol consumption per capita",
            "Tobacco use prevalence", 
            "Coffee consumption per capita",
            "Sugar consumption per capita",
            "Meat consumption per capita"
        ],
        "📱 Digital Life": [
            "Internet users %",
            "Mobile subscriptions per 100",
            "Secure internet servers per million",
            "Fixed broadband speed (Mbps)",
            "Social media penetration"
        ],
        "✈️ Travel & Tourism": [
            "International tourist arrivals",
            "Tourism receipts (% of exports)",
            "Number of airports",
            "Passport power (visa-free countries)",
            "Hotel beds per capita"
        ],
        "🚗 Transportation": [
            "Cars per 1,000 people",
            "Traffic congestion index",
            "Road traffic deaths per 100k",
            "Railway passengers carried",
            "Electric vehicle adoption %"
        ],
        "💪 Health & Lifestyle": [
            "Obesity prevalence %",
            "Life expectancy at birth",
            "Gym memberships per capita",
            "Fast food restaurants per capita",
            "Mental health index"
        ],
        "🎮 Entertainment & Culture": [
            "Cinema screens per million",
            "Video game revenue per capita",
            "Music streaming users %",
            "Book publications per million",
            "Museum visits per capita"
        ],
        "💰 Wealth & Inequality": [
            "Billionaires per million people",
            "Lottery spending per capita",
            "Luxury car sales per capita",
            "Private jet ownership",
            "Gini inequality index"
        ],
        "🌍 Environment & Sustainability": [
            "CO2 emissions per capita",
            "Renewable energy %",
            "Plastic waste per capita",
            "Recycling rate %",
            "Electric car market share"
        ]
    }
    
    for category, indicators in fun_categories.items():
        print(f"\n{category}:")
        for ind in indicators:
            print(f"  • {ind}")
    
    print("\n\n💡 RANKING CHALLENGES THAT MAKE PLAYERS GO 'WOW!':")
    print("-" * 60)
    
    wow_challenges = [
        "Which country drinks the most coffee per person?",
        "Which country has the most mobile phones per person (over 100%!)?",
        "Which country gets the most international tourists?",
        "Which country has the fastest internet speeds?",
        "Which country has the most millionaires per capita?",
        "Which country eats the most meat per person?",
        "Which country has the highest obesity rate?",
        "Which country spends the most on lottery tickets?",
        "Which country has the most cars per person?",
        "Which country produces the most renewable energy?",
        "Which country has the youngest population?",
        "Which country has the most paid vacation days?",
        "Which country sleeps the most hours per night?",
        "Which country has the happiest people?",
        "Which country has the most startup unicorns?",
        "Which country watches the most TV per day?",
        "Which country has the most pets per household?",
        "Which country recycles the most?",
        "Which country has the most expensive Big Mac?",
        "Which country has the tallest people?"
    ]
    
    for i, challenge in enumerate(wow_challenges, 1):
        print(f"{i}. {challenge}")

if __name__ == "__main__":
    main()