# In a new file: utils/real_data_fetcher.py
import requests
from bs4 import BeautifulSoup

def get_traffic_updates():
    # Scrape Chennai Traffic Police updates
    url = "https://twitter.com/chennaicitypoI"
    # Use nitter (free Twitter scraper) instead
    url = "https://nitter.net/chennaicitypoI"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    tweets = soup.find_all("div", class_="tweet-content")
    return [t.text.strip() for t in tweets[:10]]

def get_flood_data():
    # IMD Chennai rainfall data
    url = "https://mausam.imd.gov.in/chennai"
    response = requests.get(url)
    # Parse and return rainfall + flood risk
    return response.json()

def fetch_chennai_flood_data():
    try:
        url = "https://api.data.gov.in/resource/YOUR_RESOURCE_ID_HERE"
        params = {"api-key": DATAGOV_KEY, "format": "json", "limit": 10}
        r = requests.get(url, params=params, timeout=5)
        data = r.json()
        records = data.get("records", [])
        if records:
            return records
    except Exception:
        pass
    return None  # caller handles fallback
