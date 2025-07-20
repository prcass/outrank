#!/usr/bin/env python3
"""
Filter World Bank indicators for country comparison data
Focus on indicators that allow ranking countries against each other
"""

import json

def main():
    print("🎯 FILTERING FOR COUNTRY COMPARISON INDICATORS")
    print("=" * 60)
    
    # Load the actual indicators we retrieved
    with open('actual_wb_indicators.json', 'r') as f:
        data = json.load(f)
    
    all_interesting = data['all_interesting']
    print(f"Starting with {len(all_interesting)} interesting indicators")
    
    # Filter for indicators suitable for country comparison games
    comparative_indicators = []
    
    # We want indicators that:
    # 1. Apply to multiple countries (not country-specific)
    # 2. Are numeric/measurable for ranking
    # 3. Are interesting for players
    
    for indicator in all_interesting:
        name = indicator['name']
        code = indicator['id']
        source = indicator['source']
        
        # Skip country-specific indicators
        skip_patterns = [
            ' to ', ' in ', 'USD million', 'success rate', 'disbursed',
            'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia',
            'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus',
            'Belgium', 'Benin', 'Bolivia', 'Bosnia', 'Botswana', 'Brazil', 'Bulgaria',
            'Burkina', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile',
            'China', 'Colombia', 'Congo', 'Costa Rica', 'Croatia', 'Cyprus', 'Czech',
            'Denmark', 'Djibouti', 'Dominican', 'Ecuador', 'Egypt', 'Salvador', 'Estonia',
            'Ethiopia', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
            'Ghana', 'Greece', 'Guatemala', 'Guinea', 'Haiti', 'Honduras', 'Hungary',
            'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
            'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Korea',
            'Kuwait', 'Kyrgyz', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia',
            'Libya', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
            'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova', 'Mongolia',
            'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal',
            'Netherlands', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman',
            'Pakistan', 'Panama', 'Papua', 'Paraguay', 'Peru', 'Philippines', 'Poland',
            'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi', 'Senegal',
            'Serbia', 'Sierra', 'Singapore', 'Slovak', 'Slovenia', 'Somalia', 'South Africa',
            'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
            'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Trinidad', 'Tunisia', 'Turkey',
            'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab', 'United Kingdom', 'United States',
            'Uruguay', 'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
        ]
        
        if any(pattern in name for pattern in skip_patterns):
            continue
            
        # Skip very technical or administrative indicators  
        technical_skip = [
            'metadata', 'statistical capacity', 'methodology', 'classification',
            'deflator', 'constant', 'current LCU', 'index number', 'code',
            'adjusted for', 'terms of trade', 'purchasing power parity'
        ]
        
        if any(tech in name.lower() for tech in technical_skip):
            continue
            
        # Focus on World Development Indicators (main source)
        if 'World Development Indicators' in source:
            comparative_indicators.append(indicator)
    
    print(f"Filtered to {len(comparative_indicators)} country comparison indicators")
    
    # Sort by name and show top 50
    comparative_indicators.sort(key=lambda x: x['name'])
    
    print(f"\n🏆 TOP 50 ACTUAL WORLD BANK INDICATORS FOR COUNTRY RANKING:")
    print("=" * 80)
    
    for i, indicator in enumerate(comparative_indicators[:50], 1):
        name = indicator['name']
        code = indicator['id']
        unit = indicator.get('unit', '')
        
        print(f"{i:2d}. {name}")
        print(f"    Code: {code}")
        if unit:
            print(f"    Unit: {unit}")
        
        # Suggest potential game challenge
        challenge = suggest_challenge(name)
        if challenge:
            print(f"    Challenge: {challenge}")
        print()
    
    # Save results
    output = {
        "filter_date": "2025-07-18",
        "methodology": "Filtered actual World Bank indicators for country comparison",
        "total_comparative": len(comparative_indicators),
        "top_50_for_ranking": comparative_indicators[:50],
        "all_comparative": comparative_indicators
    }
    
    with open('comparative_wb_indicators.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"✅ FILTERED INDICATORS SAVED!")
    print(f"📁 Results saved to: comparative_wb_indicators.json")
    print(f"📊 Country comparison indicators: {len(comparative_indicators)}")
    print(f"📊 Top 50 suitable for ranking games shown above")

def suggest_challenge(indicator_name):
    """Suggest a game challenge based on indicator name"""
    name_lower = indicator_name.lower()
    
    if 'population' in name_lower and 'total' in name_lower:
        return "Which country has the most people?"
    elif 'gdp per capita' in name_lower:
        return "Which country has the highest GDP per person?"
    elif 'life expectancy' in name_lower:
        return "Which country has the highest life expectancy?"
    elif 'internet' in name_lower and 'user' in name_lower:
        return "Which country is most connected to the internet?"
    elif 'mobile' in name_lower or 'cellular' in name_lower:
        return "Which country has the most mobile phones per person?"
    elif 'unemployment' in name_lower:
        return "Which country has the highest unemployment?"
    elif 'inflation' in name_lower:
        return "Which country has the worst inflation?"
    elif 'export' in name_lower:
        return "Which country exports the most?"
    elif 'import' in name_lower:
        return "Which country imports the most?"
    elif 'forest' in name_lower:
        return "Which country has the most forest coverage?"
    elif 'co2' in name_lower or 'carbon' in name_lower:
        return "Which country has the highest CO2 emissions?"
    elif 'energy' in name_lower and 'renewable' in name_lower:
        return "Which country has the most renewable energy?"
    elif 'education' in name_lower or 'school' in name_lower:
        return "Which country has the best education system?"
    elif 'health' in name_lower:
        return "Which country spends the most on healthcare?"
    elif 'tourism' in name_lower or 'tourist' in name_lower:
        return "Which country gets the most tourists?"
    
    return None

if __name__ == "__main__":
    main()