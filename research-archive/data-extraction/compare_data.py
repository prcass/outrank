#!/usr/bin/env python3
"""
Compare current game data with World Bank data
Shows what would change if we apply the updates
"""

import json
import re

def load_game_data():
    """Load current game data from data.js"""
    try:
        with open('data.js', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the countries section
        countries_match = re.search(r'"countries":\s*{[^}]*"items":\s*{([^}]+)}', content, re.DOTALL)
        if not countries_match:
            print("❌ Could not find countries data in data.js")
            return {}
        
        # This is a simplified extraction - in reality we'd need more robust parsing
        # For now, let's manually extract some key countries
        countries = {}
        
        # Look for specific countries by searching for their names
        country_patterns = {
            "United States": r'"001":\s*{[^}]*"name":\s*"United States"[^}]*}',
            "China": r'"002":\s*{[^}]*"name":\s*"China"[^}]*}',
            "Japan": r'"003":\s*{[^}]*"name":\s*"Japan"[^}]*}',
            "Germany": r'"004":\s*{[^}]*"name":\s*"Germany"[^}]*}',
            "United Kingdom": r'"005":\s*{[^}]*"name":\s*"United Kingdom"[^}]*}',
            "France": r'"006":\s*{[^}]*"name":\s*"France"[^}]*}',
            "India": r'"007":\s*{[^}]*"name":\s*"India"[^}]*}',
            "Brazil": r'"009":\s*{[^}]*"name":\s*"Brazil"[^}]*}',
            "Canada": r'"010":\s*{[^}]*"name":\s*"Canada"[^}]*}',
            "Italy": r'"008":\s*{[^}]*"name":\s*"Italy"[^}]*}'
        }
        
        for country_name, pattern in country_patterns.items():
            match = re.search(pattern, content, re.DOTALL)
            if match:
                country_data = match.group(0)
                
                # Extract specific values
                country_info = {"name": country_name}
                
                # Extract numeric values
                for field in ["gdp_per_capita", "population", "life_expectancy", "internet_penetration", "inflation_rate", "unemployment_rate"]:
                    value_match = re.search(f'"{field}":\s*([0-9.]+)', country_data)
                    if value_match:
                        country_info[field] = float(value_match.group(1))
                    else:
                        country_info[field] = None
                
                countries[country_name] = country_info
        
        return countries
        
    except Exception as e:
        print(f"❌ Error loading game data: {e}")
        return {}

def load_world_bank_data():
    """Load World Bank updates"""
    try:
        with open('world_bank_game_updates.json', 'r', encoding='utf-8') as f:
            wb_data = json.load(f)
        
        # Convert to dictionary keyed by country name
        wb_dict = {}
        for country in wb_data:
            wb_dict[country["name"]] = country["updates"]
        
        return wb_dict
        
    except Exception as e:
        print(f"❌ Error loading World Bank data: {e}")
        return {}

def compare_data(game_data, wb_data):
    """Compare game data with World Bank data"""
    print("🔍 COMPARING CURRENT GAME DATA vs WORLD BANK DATA")
    print("=" * 70)
    
    fields = ["gdp_per_capita", "population", "life_expectancy", "internet_penetration", "inflation_rate", "unemployment_rate"]
    field_names = ["GDP per Capita", "Population", "Life Expectancy", "Internet %", "Inflation %", "Unemployment %"]
    
    changes_found = False
    
    for country_name in wb_data.keys():
        if country_name in game_data:
            print(f"\n🌍 {country_name}:")
            print("-" * 50)
            
            country_has_changes = False
            
            for i, field in enumerate(fields):
                current_value = game_data[country_name].get(field)
                new_value = wb_data[country_name].get(field)
                
                if current_value is not None and new_value is not None:
                    # Check if values are different (with some tolerance for floating point)
                    if field == "population":
                        # Population should be exact match
                        different = int(current_value) != int(new_value)
                        current_display = f"{int(current_value):,}"
                        new_display = f"{int(new_value):,}"
                    else:
                        # Other fields allow small differences
                        different = abs(float(current_value) - float(new_value)) > 0.1
                        if field == "gdp_per_capita":
                            current_display = f"${current_value:,.2f}"
                            new_display = f"${new_value:,.2f}"
                        elif field in ["life_expectancy"]:
                            current_display = f"{current_value:.1f} years"
                            new_display = f"{new_value:.1f} years"
                        elif field in ["internet_penetration", "inflation_rate", "unemployment_rate"]:
                            current_display = f"{current_value:.1f}%"
                            new_display = f"{new_value:.1f}%"
                        else:
                            current_display = str(current_value)
                            new_display = str(new_value)
                    
                    if different:
                        print(f"  🔄 {field_names[i]:15} | Current: {current_display:>15} → New: {new_display:>15}")
                        country_has_changes = True
                        changes_found = True
                    else:
                        print(f"  ✓ {field_names[i]:15} | {current_display:>15} (no change)")
                        
                elif current_value is None and new_value is not None:
                    if field == "population":
                        new_display = f"{int(new_value):,}"
                    elif field == "gdp_per_capita":
                        new_display = f"${new_value:,.2f}"
                    elif field in ["life_expectancy"]:
                        new_display = f"{new_value:.1f} years"
                    elif field in ["internet_penetration", "inflation_rate", "unemployment_rate"]:
                        new_display = f"{new_value:.1f}%"
                    else:
                        new_display = str(new_value)
                    
                    print(f"  ➕ {field_names[i]:15} | Current: {'None':>15} → New: {new_display:>15}")
                    country_has_changes = True
                    changes_found = True
                    
                elif current_value is not None and new_value is None:
                    print(f"  ⚠️  {field_names[i]:15} | Current: {current_value} → New: None")
                    
            if not country_has_changes:
                print("  ✅ No changes needed - all data is current!")
                
        else:
            print(f"\n❓ {country_name}: Not found in current game data")
    
    print("\n" + "=" * 70)
    if changes_found:
        print("📊 SUMMARY: Changes detected! World Bank has newer data.")
        print("💡 Run this to apply updates:")
        print("   node precision_update.js world_bank_game_updates.json")
    else:
        print("✅ SUMMARY: All data is current! No updates needed.")
    
    return changes_found

def main():
    print("🎮 Game Data vs World Bank Comparison Tool")
    print("=" * 70)
    
    # Load both datasets
    print("📖 Loading current game data...")
    game_data = load_game_data()
    
    print("🌍 Loading World Bank data...")
    wb_data = load_world_bank_data()
    
    if not game_data:
        print("❌ Could not load game data. Make sure data.js exists.")
        return
        
    if not wb_data:
        print("❌ Could not load World Bank data. Make sure world_bank_game_updates.json exists.")
        return
    
    print(f"✅ Loaded {len(game_data)} countries from game")
    print(f"✅ Loaded {len(wb_data)} countries from World Bank")
    
    # Compare the data
    compare_data(game_data, wb_data)

if __name__ == "__main__":
    main()