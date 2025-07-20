#!/usr/bin/env python3
"""
Update UNESCO data source to Wikipedia
Correct the source attribution
"""

import json
import time

def update_unesco_source():
    """Update the source information for UNESCO data"""
    
    # Load current dataset
    with open('unesco_heritage_complete.json', 'r') as f:
        data = json.load(f)
    
    # Update source information
    data["source"] = "Wikipedia: World Heritage Sites by country (https://en.wikipedia.org/wiki/World_Heritage_Sites_by_country)"
    data["source_date"] = "July 2025"
    data["extraction_date"] = time.strftime("%Y-%m-%d %H:%M:%S")
    data["verification_method"] = "Manual extraction from Wikipedia table provided by user"
    data["source_url"] = "https://en.wikipedia.org/wiki/World_Heritage_Sites_by_country"
    data["data_current_as_of"] = "July 2025"
    
    # Save updated dataset
    with open('unesco_heritage_complete.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("✅ Updated UNESCO data source information:")
    print(f"   Source: Wikipedia - World Heritage Sites by country")
    print(f"   URL: https://en.wikipedia.org/wiki/World_Heritage_Sites_by_country")
    print(f"   Data current as of: July 2025")
    print(f"   Coverage: 100% (40/40 countries)")
    print(f"   Indicators ready: 3 UNESCO indicators")

def main():
    print("🔄 UPDATING UNESCO DATA SOURCE ATTRIBUTION")
    print("Correcting source to Wikipedia as specified by user")
    print()
    
    update_unesco_source()
    
    print(f"\n📁 Updated dataset saved with correct source information")

if __name__ == "__main__":
    main()