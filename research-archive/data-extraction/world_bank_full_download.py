#!/usr/bin/env python3
"""
World Bank Complete Data Downloader
Downloads ALL indicators for ALL countries from the World Bank API

WARNING: This will download a massive amount of data:
- ~300 countries/regions
- ~17,000+ indicators
- Potentially millions of data points
- Will take several hours to complete
"""

import requests
import pandas as pd
import time
import json
import os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

class WorldBankCompleteDownloader:
    def __init__(self):
        self.base_url = "https://api.worldbank.org/v2"
        self.results_dir = "world_bank_complete_data"
        self.progress_file = "complete_download_progress.json"
        self.countries = {}
        self.indicators = {}
        self.data_lock = threading.Lock()
        self.progress_lock = threading.Lock()
        self.create_output_dir()
        self.load_progress()
        
    def create_output_dir(self):
        """Create output directories"""
        dirs = [
            self.results_dir,
            f"{self.results_dir}/by_country",
            f"{self.results_dir}/by_indicator",
            f"{self.results_dir}/by_topic"
        ]
        for dir_path in dirs:
            if not os.path.exists(dir_path):
                os.makedirs(dir_path)
                
    def load_progress(self):
        """Load download progress"""
        if os.path.exists(self.progress_file):
            with open(self.progress_file, 'r') as f:
                self.progress = json.load(f)
        else:
            self.progress = {
                "completed": [],
                "failed": [],
                "countries_fetched": False,
                "indicators_fetched": False,
                "last_update": None
            }
            
    def save_progress(self):
        """Save download progress"""
        with self.progress_lock:
            self.progress["last_update"] = datetime.now().isoformat()
            with open(self.progress_file, 'w') as f:
                json.dump(self.progress, f, indent=2)
                
    def fetch_all_countries(self):
        """Fetch all countries and regions from World Bank"""
        if self.progress["countries_fetched"]:
            # Load from cache
            cache_file = f"{self.results_dir}/countries_metadata.json"
            if os.path.exists(cache_file):
                with open(cache_file, 'r') as f:
                    self.countries = json.load(f)
                print(f"✓ Loaded {len(self.countries)} countries from cache")
                return
                
        print("📍 Fetching all countries...")
        url = f"{self.base_url}/country"
        params = {
            "format": "json",
            "per_page": 500
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if len(data) > 1:
                    for country in data[1]:
                        self.countries[country["id"]] = {
                            "name": country["name"],
                            "iso2Code": country["iso2Code"],
                            "region": country["region"]["value"],
                            "incomeLevel": country["incomeLevel"]["value"],
                            "capitalCity": country["capitalCity"],
                            "longitude": country["longitude"],
                            "latitude": country["latitude"]
                        }
                        
            # Save countries metadata
            with open(f"{self.results_dir}/countries_metadata.json", 'w') as f:
                json.dump(self.countries, f, indent=2)
                
            self.progress["countries_fetched"] = True
            self.save_progress()
            
            print(f"✓ Found {len(self.countries)} countries/regions")
            
        except Exception as e:
            print(f"❌ Error fetching countries: {e}")
            
    def fetch_all_indicators(self):
        """Fetch all indicators from World Bank"""
        if self.progress["indicators_fetched"]:
            # Load from cache
            cache_file = f"{self.results_dir}/indicators_metadata.json"
            if os.path.exists(cache_file):
                with open(cache_file, 'r') as f:
                    self.indicators = json.load(f)
                print(f"✓ Loaded {len(self.indicators)} indicators from cache")
                return
                
        print("📊 Fetching all indicators...")
        
        # First get the total count
        url = f"{self.base_url}/indicator"
        params = {
            "format": "json",
            "per_page": 1
        }
        
        try:
            response = requests.get(url, params=params, timeout=30)
            if response.status_code == 200:
                data = response.json()
                total_indicators = data[0]["total"]
                print(f"   Total indicators available: {total_indicators}")
                
                # Now fetch all indicators in pages
                per_page = 1000
                total_pages = (total_indicators // per_page) + 1
                
                for page in range(1, total_pages + 1):
                    print(f"   Fetching page {page}/{total_pages}...")
                    params = {
                        "format": "json",
                        "per_page": per_page,
                        "page": page
                    }
                    
                    response = requests.get(url, params=params, timeout=30)
                    if response.status_code == 200:
                        data = response.json()
                        if len(data) > 1:
                            for indicator in data[1]:
                                self.indicators[indicator["id"]] = {
                                    "name": indicator["name"],
                                    "unit": indicator.get("unit", ""),
                                    "source": indicator["source"]["value"],
                                    "sourceNote": indicator.get("sourceNote", ""),
                                    "topics": [t["value"] for t in indicator.get("topics", [])]
                                }
                    
                    time.sleep(0.5)  # Rate limiting
                    
            # Save indicators metadata
            with open(f"{self.results_dir}/indicators_metadata.json", 'w') as f:
                json.dump(self.indicators, f, indent=2)
                
            # Create topic-based indicator lists
            self.organize_indicators_by_topic()
                
            self.progress["indicators_fetched"] = True
            self.save_progress()
            
            print(f"✓ Found {len(self.indicators)} indicators")
            
        except Exception as e:
            print(f"❌ Error fetching indicators: {e}")
            
    def organize_indicators_by_topic(self):
        """Organize indicators by their topics"""
        topics = {}
        
        for ind_id, ind_data in self.indicators.items():
            for topic in ind_data.get("topics", ["Uncategorized"]):
                if topic not in topics:
                    topics[topic] = []
                topics[topic].append({
                    "id": ind_id,
                    "name": ind_data["name"]
                })
                
        # Save topic organization
        with open(f"{self.results_dir}/indicators_by_topic.json", 'w') as f:
            json.dump(topics, f, indent=2)
            
        print(f"✓ Organized indicators into {len(topics)} topics")
        
    def get_indicator_data(self, country_code, indicator_code, start_year=2010, end_year=2024):
        """Fetch data for a specific indicator and country"""
        url = f"{self.base_url}/country/{country_code}/indicator/{indicator_code}"
        params = {
            "format": "json",
            "date": f"{start_year}:{end_year}",
            "per_page": 100
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if len(data) > 1 and data[1]:
                    # Extract time series data
                    time_series = {}
                    for entry in data[1]:
                        if entry["value"] is not None:
                            time_series[entry["date"]] = entry["value"]
                    return time_series
            elif response.status_code == 429:
                # Rate limit hit
                time.sleep(5)
                return None
                
        except Exception as e:
            print(f"Error fetching {indicator_code} for {country_code}: {e}")
            
        return None
        
    def download_country_data(self, country_code, country_info):
        """Download all indicators for a single country"""
        country_data = {
            "country_code": country_code,
            "country_name": country_info["name"],
            "metadata": country_info,
            "indicators": {}
        }
        
        successful = 0
        failed = 0
        
        for ind_code, ind_info in self.indicators.items():
            progress_key = f"{country_code}_{ind_code}"
            
            # Skip if already completed
            if progress_key in self.progress["completed"]:
                continue
                
            # Skip if previously failed (can be removed to retry)
            if progress_key in self.progress["failed"]:
                continue
                
            # Fetch data
            data = self.get_indicator_data(country_code, ind_code)
            
            if data:
                country_data["indicators"][ind_code] = {
                    "name": ind_info["name"],
                    "unit": ind_info.get("unit", ""),
                    "data": data
                }
                successful += 1
                
                with self.progress_lock:
                    self.progress["completed"].append(progress_key)
            else:
                failed += 1
                with self.progress_lock:
                    self.progress["failed"].append(progress_key)
                    
            # Save progress periodically
            if (successful + failed) % 100 == 0:
                self.save_progress()
                print(f"   {country_info['name']}: {successful} successful, {failed} failed")
                
            # Rate limiting
            time.sleep(0.1)
            
        # Save country data
        if country_data["indicators"]:
            filename = f"{self.results_dir}/by_country/{country_code}_data.json"
            with open(filename, 'w') as f:
                json.dump(country_data, f, indent=2)
                
            # Also save as CSV for easier analysis
            self.save_country_csv(country_code, country_data)
            
        return successful, failed
        
    def save_country_csv(self, country_code, country_data):
        """Save country data as CSV"""
        rows = []
        
        for ind_code, ind_data in country_data["indicators"].items():
            for year, value in ind_data["data"].items():
                rows.append({
                    "indicator_code": ind_code,
                    "indicator_name": ind_data["name"],
                    "year": year,
                    "value": value,
                    "unit": ind_data["unit"]
                })
                
        if rows:
            df = pd.DataFrame(rows)
            filename = f"{self.results_dir}/by_country/{country_code}_data.csv"
            df.to_csv(filename, index=False)
            
    def download_all_parallel(self, max_workers=5):
        """Download all data using parallel processing"""
        print("\n🌍 Starting parallel download of all World Bank data")
        print(f"   Countries: {len(self.countries)}")
        print(f"   Indicators: {len(self.indicators)}")
        print(f"   Max parallel downloads: {max_workers}")
        print("\n⚠️  This will take several hours to complete!")
        
        start_time = datetime.now()
        total_successful = 0
        total_failed = 0
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all country downloads
            future_to_country = {
                executor.submit(self.download_country_data, code, info): (code, info)
                for code, info in self.countries.items()
            }
            
            completed_countries = 0
            
            for future in as_completed(future_to_country):
                code, info = future_to_country[future]
                completed_countries += 1
                
                try:
                    successful, failed = future.result()
                    total_successful += successful
                    total_failed += failed
                    
                    print(f"\n✓ Completed {info['name']} ({code})")
                    print(f"  Progress: {completed_countries}/{len(self.countries)} countries")
                    print(f"  Total data points: {total_successful:,} successful, {total_failed:,} failed")
                    
                except Exception as e:
                    print(f"\n❌ Error processing {info['name']}: {e}")
                    
        # Create summary statistics
        self.create_summary_statistics()
        
        end_time = datetime.now()
        duration = end_time - start_time
        
        print(f"\n🎉 Download complete!")
        print(f"⏱️  Duration: {duration}")
        print(f"📊 Total data points: {total_successful:,} successful, {total_failed:,} failed")
        print(f"📁 Data saved in: {self.results_dir}/")
        
    def create_summary_statistics(self):
        """Create summary statistics of the download"""
        summary = {
            "download_date": datetime.now().isoformat(),
            "total_countries": len(self.countries),
            "total_indicators": len(self.indicators),
            "completed_combinations": len(self.progress["completed"]),
            "failed_combinations": len(self.progress["failed"]),
            "success_rate": len(self.progress["completed"]) / 
                           (len(self.progress["completed"]) + len(self.progress["failed"]) + 0.001)
        }
        
        # Count indicators by topic
        with open(f"{self.results_dir}/indicators_by_topic.json", 'r') as f:
            topics = json.load(f)
            summary["indicators_by_topic"] = {topic: len(inds) for topic, inds in topics.items()}
            
        # Save summary
        with open(f"{self.results_dir}/download_summary.json", 'w') as f:
            json.dump(summary, f, indent=2)
            
    def download_specific_topic(self, topic_name):
        """Download data for all indicators in a specific topic"""
        print(f"\n📊 Downloading all indicators for topic: {topic_name}")
        
        # Load topics
        with open(f"{self.results_dir}/indicators_by_topic.json", 'r') as f:
            topics = json.load(f)
            
        if topic_name not in topics:
            print(f"❌ Topic '{topic_name}' not found")
            print(f"Available topics: {list(topics.keys())}")
            return
            
        topic_indicators = {ind["id"]: ind["name"] for ind in topics[topic_name]}
        print(f"Found {len(topic_indicators)} indicators in this topic")
        
        # Download data for each indicator across all countries
        for ind_id, ind_name in topic_indicators.items():
            print(f"\nDownloading: {ind_name}")
            self.download_indicator_all_countries(ind_id)
            
    def download_indicator_all_countries(self, indicator_code):
        """Download a single indicator for all countries"""
        indicator_data = {
            "indicator_code": indicator_code,
            "indicator_info": self.indicators.get(indicator_code, {}),
            "country_data": {}
        }
        
        for country_code, country_info in self.countries.items():
            data = self.get_indicator_data(country_code, indicator_code)
            if data:
                indicator_data["country_data"][country_code] = {
                    "country_name": country_info["name"],
                    "data": data
                }
            time.sleep(0.1)  # Rate limiting
            
        # Save indicator data
        if indicator_data["country_data"]:
            filename = f"{self.results_dir}/by_indicator/{indicator_code}_all_countries.json"
            with open(filename, 'w') as f:
                json.dump(indicator_data, f, indent=2)
                
            # Also save as CSV
            self.save_indicator_csv(indicator_code, indicator_data)
            
    def save_indicator_csv(self, indicator_code, indicator_data):
        """Save indicator data as CSV"""
        rows = []
        
        for country_code, country_data in indicator_data["country_data"].items():
            for year, value in country_data["data"].items():
                rows.append({
                    "country_code": country_code,
                    "country_name": country_data["country_name"],
                    "year": year,
                    "value": value
                })
                
        if rows:
            df = pd.DataFrame(rows)
            filename = f"{self.results_dir}/by_indicator/{indicator_code}_all_countries.csv"
            df.to_csv(filename, index=False)

def main():
    """Main function with menu options"""
    downloader = WorldBankCompleteDownloader()
    
    print("🌍 World Bank Complete Data Downloader")
    print("=" * 50)
    
    # Fetch metadata first
    downloader.fetch_all_countries()
    downloader.fetch_all_indicators()
    
    print("\nOptions:")
    print("1. Download EVERYTHING (warning: several hours)")
    print("2. Download specific topic")
    print("3. Download specific indicator for all countries")
    print("4. Show download statistics")
    print("5. Exit")
    
    choice = input("\nEnter your choice (1-5): ")
    
    if choice == "1":
        confirm = input("\n⚠️  This will download ~5 million data points. Continue? (yes/no): ")
        if confirm.lower() == "yes":
            downloader.download_all_parallel(max_workers=5)
    
    elif choice == "2":
        with open(f"{downloader.results_dir}/indicators_by_topic.json", 'r') as f:
            topics = json.load(f)
        
        print("\nAvailable topics:")
        for i, topic in enumerate(topics.keys(), 1):
            print(f"{i}. {topic} ({len(topics[topic])} indicators)")
            
        topic_num = int(input("\nEnter topic number: ")) - 1
        topic_name = list(topics.keys())[topic_num]
        downloader.download_specific_topic(topic_name)
    
    elif choice == "3":
        indicator_code = input("\nEnter indicator code (e.g., NY.GDP.PCAP.CD): ")
        downloader.download_indicator_all_countries(indicator_code)
    
    elif choice == "4":
        if os.path.exists(f"{downloader.results_dir}/download_summary.json"):
            with open(f"{downloader.results_dir}/download_summary.json", 'r') as f:
                summary = json.load(f)
            print("\nDownload Statistics:")
            print(json.dumps(summary, indent=2))
        else:
            print("\nNo download statistics available yet")
    
    elif choice == "5":
        print("\nExiting...")
    
    else:
        print("\nInvalid choice")

if __name__ == "__main__":
    main()