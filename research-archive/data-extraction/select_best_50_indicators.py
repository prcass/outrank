#!/usr/bin/env python3
"""
Select the best 50 World Bank indicators for country ranking games
From the 962 actual comparative indicators, pick the most interesting
"""

import json

def main():
    print("🎯 SELECTING BEST 50 WORLD BANK INDICATORS FOR GAMES")
    print("=" * 60)
    
    # Load the comparative indicators
    with open('comparative_wb_indicators.json', 'r') as f:
        data = json.load(f)
    
    all_indicators = data['all_comparative']
    print(f"Starting with {len(all_indicators)} comparative indicators")
    
    # Manually curate the most interesting ones for ranking games
    game_worthy_indicators = []
    
    for indicator in all_indicators:
        name = indicator['name'].lower()
        code = indicator['id']
        
        # Categories we want for engaging gameplay
        include_patterns = [
            # Basic demographics (always interesting)
            ('population, total', 'SP.POP.TOTL'),
            ('life expectancy at birth', 'SP.DYN.LE00.IN'),
            ('birth rate', 'SP.DYN.CBRT.IN'),
            ('death rate', 'SP.DYN.CDRT.IN'),
            ('fertility rate', 'SP.DYN.TFRT.IN'),
            
            # Economy (players love wealth comparisons)
            ('gdp per capita', 'NY.GDP.PCAP.CD'),
            ('gdp (current us$)', 'NY.GDP.MKTP.CD'), 
            ('gdp growth', 'NY.GDP.MKTP.KD.ZG'),
            ('gni per capita', 'NY.GNP.PCAP.CD'),
            ('unemployment', 'SL.UEM.TOTL.ZS'),
            ('inflation', 'FP.CPI.TOTL.ZG'),
            
            # Technology (modern/relevant)
            ('internet users', 'IT.NET.USER.ZS'),
            ('mobile cellular subscriptions', 'IT.CEL.SETS.P2'),
            ('fixed broadband subscriptions', 'IT.NET.BBND.P2'),
            ('secure internet servers', 'IT.NET.SECR.P6'),
            
            # Trade & Business
            ('exports of goods and services', 'NE.EXP.GNFS.CD'),
            ('imports of goods and services', 'NE.IMP.GNFS.CD'),
            ('foreign direct investment', 'BX.KLT.DINV.CD.WD'),
            
            # Environment (hot topic)
            ('co2 emissions', 'EN.ATM.CO2E.PC'),
            ('forest area', 'AG.LND.FRST.ZS'),
            ('renewable energy consumption', 'EG.FEC.RNEW.ZS'),
            ('electric power consumption', 'EG.USE.ELEC.KH.PC'),
            ('access to electricity', 'EG.ELC.ACCS.ZS'),
            
            # Health & Social
            ('health expenditure', 'SH.XPD.CHEX.GD.ZS'),
            ('physicians', 'SH.MED.PHYS.ZS'),
            ('hospital beds', 'SH.MED.BEDS.ZS'),
            ('mortality rate, under-5', 'SH.DYN.MORT'),
            ('prevalence of overweight', 'SH.STA.OWGH.ZS'),
            
            # Education
            ('school enrollment, primary', 'SE.PRM.NENR'),
            ('school enrollment, secondary', 'SE.SEC.NENR'),
            ('school enrollment, tertiary', 'SE.TER.ENRR'),
            ('literacy rate', 'SE.ADT.LITR.ZS'),
            
            # Infrastructure & Development
            ('access to improved water source', 'SH.H2O.BASW.ZS'),
            ('access to improved sanitation facilities', 'SH.STA.BASS.ZS'),
            ('roads, paved', 'IS.ROD.PAVE.ZS'),
            ('rail lines', 'IS.RRS.TOTL.KM'),
            
            # Tourism & Culture
            ('international tourism, number of arrivals', 'ST.INT.ARVL'),
            ('international tourism, receipts', 'ST.INT.RCPT.CD'),
            
            # Gender & Social
            ('labor force participation rate, female', 'SL.TLF.CACT.FE.ZS'),
            ('labor force participation rate, male', 'SL.TLF.CACT.MA.ZS'),
            ('ratio of female to male labor force participation rate', 'SL.TLF.CACT.FM.ZS'),
            
            # Age demographics
            ('population ages 0-14', 'SP.POP.0014.TO.ZS'),
            ('population ages 15-64', 'SP.POP.1564.TO.ZS'),
            ('population ages 65 and above', 'SP.POP.65UP.TO.ZS'),
            
            # Urban/Rural
            ('urban population', 'SP.URB.TOTL.IN.ZS'),
            ('rural population', 'SP.RUR.TOTL.ZS'),
            
            # Military & Government
            ('military expenditure', 'MS.MIL.XPND.GD.ZS'),
            
            # Innovation
            ('research and development expenditure', 'GB.XPD.RSDV.GD.ZS'),
            ('patent applications, residents', 'IP.PAT.RESD'),
            ('patent applications, nonresidents', 'IP.PAT.NRES'),
            
            # Energy specific
            ('electricity production from oil sources', 'EG.ELC.PETR.ZS'),
            ('electricity production from coal sources', 'EG.ELC.COAL.ZS'),
            ('electricity production from natural gas sources', 'EG.ELC.NGAS.ZS'),
            ('electricity production from hydroelectric sources', 'EG.ELC.HYRO.ZS'),
            ('electricity production from nuclear sources', 'EG.ELC.NUCL.ZS'),
        ]
        
        # Check if this indicator matches any of our wanted patterns
        for pattern, expected_code in include_patterns:
            if pattern in name and (expected_code == code or expected_code in code):
                game_worthy_indicators.append({
                    **indicator,
                    'game_category': categorize_indicator(pattern),
                    'suggested_challenge': create_challenge(pattern)
                })
                break
    
    print(f"Found {len(game_worthy_indicators)} game-worthy indicators")
    
    # Sort by category and show results
    game_worthy_indicators.sort(key=lambda x: (x['game_category'], x['name']))
    
    print(f"\n🏆 50 BEST ACTUAL WORLD BANK INDICATORS FOR COUNTRY RANKING:")
    print("=" * 80)
    
    current_category = None
    count = 0
    
    for indicator in game_worthy_indicators:
        if count >= 50:
            break
            
        category = indicator['game_category']
        if category != current_category:
            print(f"\n### {category.upper()}")
            current_category = category
        
        count += 1
        print(f"{count:2d}. {indicator['name']}")
        print(f"    Code: {indicator['id']}")
        print(f"    Challenge: {indicator['suggested_challenge']}")
        print()
    
    # Save the best 50
    output = {
        "selection_date": "2025-07-18",
        "methodology": "Hand-curated from 962 actual World Bank comparative indicators",
        "total_game_worthy": len(game_worthy_indicators),
        "best_50_indicators": game_worthy_indicators[:50],
        "all_game_worthy": game_worthy_indicators
    }
    
    with open('best_50_wb_indicators.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2)
    
    print(f"✅ BEST 50 INDICATORS SELECTED!")
    print(f"📁 Results saved to: best_50_wb_indicators.json")
    print(f"📊 These are actual World Bank indicators with verified codes")
    print(f"📊 Ready for data availability testing")

def categorize_indicator(pattern):
    """Categorize indicators by theme"""
    if any(word in pattern for word in ['population', 'birth', 'death', 'fertility', 'age']):
        return "demographics"
    elif any(word in pattern for word in ['gdp', 'income', 'unemployment', 'inflation', 'gni']):
        return "economy"
    elif any(word in pattern for word in ['internet', 'mobile', 'broadband', 'technology']):
        return "technology"
    elif any(word in pattern for word in ['export', 'import', 'trade', 'investment']):
        return "trade"
    elif any(word in pattern for word in ['co2', 'forest', 'renewable', 'energy', 'electricity']):
        return "environment"
    elif any(word in pattern for word in ['health', 'hospital', 'physician', 'mortality', 'overweight']):
        return "health"
    elif any(word in pattern for word in ['school', 'education', 'literacy', 'enrollment']):
        return "education"
    elif any(word in pattern for word in ['tourism', 'tourist']):
        return "tourism"
    elif any(word in pattern for word in ['labor', 'female', 'male']):
        return "social"
    elif any(word in pattern for word in ['water', 'sanitation', 'roads', 'infrastructure']):
        return "infrastructure"
    elif any(word in pattern for word in ['military', 'research', 'patent']):
        return "innovation"
    else:
        return "other"

def create_challenge(pattern):
    """Create a fun challenge question from indicator pattern"""
    if 'population, total' in pattern:
        return "Which country has the most people?"
    elif 'life expectancy' in pattern:
        return "Which country has the highest life expectancy?"
    elif 'gdp per capita' in pattern:
        return "Which country has the highest GDP per person?"
    elif 'unemployment' in pattern:
        return "Which country has the highest unemployment rate?"
    elif 'internet users' in pattern:
        return "Which country is most connected to the internet?"
    elif 'mobile cellular' in pattern:
        return "Which country has the most mobile phones per person?"
    elif 'exports' in pattern:
        return "Which country exports the most goods and services?"
    elif 'co2 emissions' in pattern:
        return "Which country has the highest CO2 emissions per person?"
    elif 'forest area' in pattern:
        return "Which country has the most forest coverage?"
    elif 'tourism' in pattern and 'arrivals' in pattern:
        return "Which country gets the most international tourists?"
    elif 'health expenditure' in pattern:
        return "Which country spends the most on healthcare?"
    elif 'school enrollment, tertiary' in pattern:
        return "Which country has the highest university enrollment?"
    elif 'military expenditure' in pattern:
        return "Which country spends the most on military?"
    else:
        return f"Which country ranks highest in: {pattern}?"

if __name__ == "__main__":
    main()