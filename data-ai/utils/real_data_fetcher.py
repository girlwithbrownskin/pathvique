<<<<<<< HEAD
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
=======
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
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79
    return response.json()