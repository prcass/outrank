#!/usr/bin/env python3
"""
Display all categories and indicators in our final dataset
Show complete breakdown of 29 indicators across all sources
"""

import json

def display_world_bank_categories():
    """Display World Bank categories (20 indicators)"""
    print("🏦 WORLD BANK INDICATORS (20 total)")
    print("=" * 40)
    print("Source: World Bank Open Data API")
    print("Coverage: 100% (38/38 countries)")
    print()
    
    # From our previous World Bank selection of 20 indicators
    # These were the final 20 selected from 36 available with 100% coverage
    wb_categories = {
        "📊 Demographics (8 indicators)": [
            "Population, total",
            "Population density (people per sq. km of land area)", 
            "Population ages 65 and above (% of total population)",
            "Urban population (% of total population)",
            "Life expectancy at birth, total (years)",
            "Fertility rate, total (births per woman)",
            "Mortality rate, infant (per 1,000 live births)",
            "Birth rate, crude (per 1,000 people)"
        ],
        "💰 Economy (8 indicators)": [
            "GDP (current US$)",
            "GDP per capita (current US$)",
            "GDP growth (annual %)",
            "Inflation, consumer prices (annual %)",
            "Unemployment, total (% of total labor force)",
            "Labor force participation rate, total (% of total population ages 15+)",
            "Foreign direct investment, net inflows (% of GDP)",
            "Central government debt, total (% of GDP)"
        ],
        "🔬 Technology & Innovation (4 indicators)": [
            "Research and development expenditure (% of GDP)",
            "High-technology exports (% of manufactured exports)",
            "Individuals using the Internet (% of population)",
            "Patent applications, residents"
        ]
    }
    
    for category, indicators in wb_categories.items():
        print(f"{category}:")
        for i, indicator in enumerate(indicators, 1):
            print(f"  {i:2d}. {indicator}")
        print()

def display_unesco_categories():
    """Display UNESCO categories (4 indicators)"""
    print("🏛️  UNESCO WORLD HERITAGE SITES (4 total)")
    print("=" * 45)
    print("Source: UNESCO World Heritage Centre (https://whc.unesco.org/)")
    print("Coverage: 100% (38/38 countries)")
    print()
    
    unesco_indicators = [
        "Total UNESCO World Heritage Sites",
        "Cultural UNESCO Sites", 
        "Natural UNESCO Sites",
        "Mixed UNESCO Sites"
    ]
    
    print("🎯 Heritage & Culture Categories:")
    for i, indicator in enumerate(unesco_indicators, 1):
        print(f"  {i}. {indicator}")
        if indicator == "Total UNESCO World Heritage Sites":
            print(f"     → Which country has the most UNESCO World Heritage Sites?")
        elif indicator == "Cultural UNESCO Sites":
            print(f"     → Which country has the most cultural heritage sites?")
        elif indicator == "Natural UNESCO Sites":
            print(f"     → Which country has the most natural heritage sites?")
        elif indicator == "Mixed UNESCO Sites":
            print(f"     → Which country has the most mixed heritage sites?")
    print()

def display_happiness_categories():
    """Display World Happiness Report categories (5 indicators)"""
    print("😊 WORLD HAPPINESS REPORT (5 total)")
    print("=" * 35)
    print("Source: World Happiness Report (user provided table)")
    print("Coverage: 100% (38/38 countries)")
    print()
    
    happiness_indicators = [
        ("Life Evaluation (Happiness Score)", "Which country has the highest life satisfaction/happiness score?"),
        ("Social Support Ranking", "Which country ranks best for social support?"),
        ("Freedom Ranking", "Which country ranks best for freedom to make life choices?"),
        ("Generosity Ranking", "Which country ranks best for generosity?"),
        ("Helped a Stranger Ranking", "Which country ranks best for helping strangers?")
    ]
    
    print("🎯 Well-being & Social Categories:")
    for i, (indicator, question) in enumerate(happiness_indicators, 1):
        print(f"  {i}. {indicator}")
        print(f"     → {question}")
    print()

def display_category_summary():
    """Display overall category summary"""
    print("📋 CATEGORY SUMMARY BY THEME")
    print("=" * 35)
    print()
    
    themes = {
        "🏛️  Cultural & Heritage": [
            "Total UNESCO World Heritage Sites",
            "Cultural UNESCO Sites", 
            "Natural UNESCO Sites",
            "Mixed UNESCO Sites"
        ],
        "😊 Well-being & Social": [
            "Life Evaluation (Happiness Score)",
            "Social Support Ranking",
            "Freedom Ranking", 
            "Generosity Ranking",
            "Helped a Stranger Ranking"
        ],
        "👥 Demographics & Society": [
            "Population, total",
            "Population density",
            "Population ages 65+",
            "Urban population %",
            "Life expectancy",
            "Fertility rate",
            "Infant mortality",
            "Birth rate"
        ],
        "💰 Economic Indicators": [
            "GDP (total)",
            "GDP per capita", 
            "GDP growth",
            "Inflation rate",
            "Unemployment rate",
            "Labor force participation",
            "Foreign investment",
            "Government debt"
        ],
        "🔬 Technology & Innovation": [
            "R&D expenditure",
            "High-tech exports",
            "Internet usage",
            "Patent applications"
        ]
    }
    
    total_indicators = 0
    for theme, indicators in themes.items():
        print(f"{theme} ({len(indicators)} indicators):")
        for indicator in indicators:
            print(f"  • {indicator}")
        print()
        total_indicators += len(indicators)
    
    print(f"🎯 TOTAL: {total_indicators} indicators across 5 major themes")

def main():
    print("🎮 KNOW-IT-ALL FINAL DATASET CATEGORIES")
    print("=" * 50)
    print("Complete breakdown of all 29 indicators")
    print("All indicators: 100% data coverage across 38 countries")
    print()
    
    # Display each source
    display_world_bank_categories()
    display_unesco_categories() 
    display_happiness_categories()
    
    # Display thematic summary
    display_category_summary()
    
    print("\n✅ All categories ready for ranking game implementation!")
    print("🎯 Perfect mix of economic, cultural, and well-being indicators")

if __name__ == "__main__":
    main()