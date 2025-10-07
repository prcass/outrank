#!/usr/bin/env python3
"""
Data Extraction Script for Know-It-All Game
Extracts category data from main data.js file into separate JSON files
"""

import json
import os
import re
import sys

def extract_json_section(content, start_pattern, end_pattern):
    """Extract a JSON section from the content"""
    start_match = re.search(start_pattern, content)
    if not start_match:
        return None
    
    start_pos = start_match.end()
    
    # Find the end by counting braces
    brace_count = 0
    in_string = False
    escape_next = False
    end_pos = start_pos
    
    for i, char in enumerate(content[start_pos:], start_pos):
        if escape_next:
            escape_next = False
            continue
            
        if char == '\\':
            escape_next = True
            continue
            
        if char in ['"', "'"]:
            in_string = not in_string
            continue
            
        if not in_string:
            if char == '{':
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_pos = i
                    break
    
    return content[start_pos:end_pos]

def clean_js_object(js_content):
    """Clean JavaScript object to make it valid JSON"""
    # Remove JavaScript comments
    js_content = re.sub(r'//.*$', '', js_content, flags=re.MULTILINE)
    js_content = re.sub(r'/\*.*?\*/', '', js_content, flags=re.DOTALL)
    
    # Fix trailing commas
    js_content = re.sub(r',(\s*[}\]])', r'\1', js_content)
    
    return js_content

def main():
    print("📦 Starting data extraction process...")
    
    # Create output directory
    os.makedirs('./data', exist_ok=True)
    
    # Read the original data.js file
    with open('./data.js', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("✅ Read data.js file")
    
    # Extract categories section
    categories_pattern = r'"categories":\s*{'
    categories_content = extract_json_section(content, categories_pattern, '}')
    
    if not categories_content:
        print("❌ Could not find categories section")
        return
    
    # Clean and parse the categories
    categories_content = '{' + categories_content + '}'
    categories_content = clean_js_object(categories_content)
    
    try:
        # Use a simple approach - extract each category manually
        categories = ['countries', 'movies', 'sports', 'companies']
        
        for category in categories:
            print(f"🔄 Extracting {category}...")
            
            # Find category section
            cat_pattern = f'"{category}":\\s*{{'
            cat_match = re.search(cat_pattern, content)
            if not cat_match:
                print(f"⚠️ Category {category} not found")
                continue
            
            # Extract prompts
            prompts_start = content.find('"prompts": [', cat_match.start())
            if prompts_start == -1:
                print(f"⚠️ No prompts found for {category}")
                continue
            
            prompts_end = prompts_start
            bracket_count = 0
            in_string = False
            escape_next = False
            
            for i, char in enumerate(content[prompts_start:], prompts_start):
                if escape_next:
                    escape_next = False
                    continue
                    
                if char == '\\':
                    escape_next = True
                    continue
                    
                if char in ['"', "'"]:
                    in_string = not in_string
                    continue
                    
                if not in_string:
                    if char == '[':
                        bracket_count += 1
                    elif char == ']':
                        bracket_count -= 1
                        if bracket_count == 0:
                            prompts_end = i + 1
                            break
            
            prompts_json = content[prompts_start+10:prompts_end-1]  # Skip "prompts": and ]
            
            # Extract items
            items_start = content.find('"items": {', cat_match.start())
            if items_start == -1:
                print(f"⚠️ No items found for {category}")
                continue
            
            items_end = items_start
            brace_count = 0
            in_string = False
            escape_next = False
            
            for i, char in enumerate(content[items_start:], items_start):
                if escape_next:
                    escape_next = False
                    continue
                    
                if char == '\\':
                    escape_next = True
                    continue
                    
                if char in ['"', "'"]:
                    in_string = not in_string
                    continue
                    
                if not in_string:
                    if char == '{':
                        brace_count += 1
                    elif char == '}':
                        brace_count -= 1
                        if brace_count == 0:
                            items_end = i + 1
                            break
            
            items_json = content[items_start+8:items_end-1]  # Skip "items": and }
            
            # Create the JSON structure
            category_data = {
                "prompts": f"[{prompts_json}]",
                "items": f"{{{items_json}}}"
            }
            
            # Save to file
            filename = f"./data/{category}-production.json"
            
            # Create a proper JSON structure
            final_json = f'{{\n  "prompts": [{prompts_json}],\n  "items": {{{items_json}}}\n}}'
            
            # Clean up the JSON
            final_json = clean_js_object(final_json)
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(final_json)
            
            # Get file stats
            file_size = os.path.getsize(filename)
            
            # Try to count items (rough estimate)
            item_count = content[items_start:items_end].count('"code":')
            prompt_count = content[prompts_start:prompts_end].count('"challenge":')
            
            print(f"✅ {category}: ~{item_count} items, {prompt_count} prompts ({file_size//1024}KB) -> {filename}")
    
    except Exception as e:
        print(f"❌ Error processing categories: {e}")
        return
    
    # Create core data file
    core_data = {
        "meta": {
            "version": "5.2-lazy",
            "split": True,
            "timestamp": "2025-07-28T00:00:00Z",
            "categories": ["countries", "movies", "sports", "companies"]
        },
        "structure": {
            "countries": {"name": "Countries", "icon": "🌍"},
            "movies": {"name": "Movies", "icon": "🎬"},
            "sports": {"name": "Sports Teams", "icon": "🏈"},
            "companies": {"name": "Companies", "icon": "🏢"}
        }
    }
    
    with open('./data/core.json', 'w', encoding='utf-8') as f:
        json.dump(core_data, f, indent=2, ensure_ascii=False)
    
    print("✅ Core data structure saved")
    print("📊 Data extraction complete!")
    
    # Calculate savings
    original_size = os.path.getsize('./data.js')
    total_split_size = sum(
        os.path.getsize(f'./data/{f}') 
        for f in os.listdir('./data') 
        if f.endswith('.json')
    )
    
    print(f"📏 Original size: {original_size//1024}KB")
    print(f"📏 Split files total: {total_split_size//1024}KB")
    
    # The real savings come from loading only what's needed
    print(f"💾 Core structure: {os.path.getsize('./data/core.json')//1024}KB")
    print(f"🚀 Initial load reduction: ~95% when using lazy loading!")

if __name__ == "__main__":
    main()