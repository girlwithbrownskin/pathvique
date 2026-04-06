import requests
from bs4 import BeautifulSoup
from datetime import datetime

def get_chennai_traffic_updates():
    updates = []

    # Try 1 — Nitter (Twitter scraper, no API key needed)
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get("https://nitter.poast.org/chennaicitypoI", headers=headers, timeout=5)
        soup = BeautifulSoup(r.text, "lxml")
        tweets = soup.find_all("div", class_="tweet-content")[:5]
        for tweet in tweets:
            text = tweet.get_text(strip=True)
            if text:
                updates.append({
                    "source": "Chennai Traffic Police",
                    "text": text,
                    "timestamp": datetime.now().isoformat(),
                    "type": "traffic",
                    "is_live": True
                })
    except Exception:
        pass

    # Try 2 — GCC Chennai website
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get("https://www.chennaicorporation.gov.in/", headers=headers, timeout=5)
        soup = BeautifulSoup(r.text, "lxml")
        notices = soup.find_all("div", class_="notice")[:3]
        for notice in notices:
            text = notice.get_text(strip=True)
            if text:
                updates.append({
                    "source": "GCC Chennai",
                    "text": text,
                    "timestamp": datetime.now().isoformat(),
                    "type": "infrastructure",
                    "is_live": True
                })
    except Exception:
        pass

    # If both fail, use OpenWeatherMap for real weather-based updates
    try:
        import os
        key = os.getenv("OPENWEATHER_KEY")
        if key:
            r = requests.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={"q": "Chennai,IN", "appid": key, "units": "metric"},
                timeout=5
            )
            data = r.json()
            rain = data.get("rain", {}).get("1h", 0)
            temp = data["main"]["temp"]
            desc = data["weather"][0]["description"]

            updates.append({
                "source": "IMD via OpenWeatherMap",
                "text": "Chennai weather: " + desc + ". Temp: " + str(temp) + "C. Rainfall last hour: " + str(rain) + "mm.",
                "timestamp": datetime.now().isoformat(),
                "type": "weather",
                "is_live": True,
                "rain_mm": rain
            })

            if rain > 10:
                updates.append({
                    "source": "PathVique Alert",
                    "text": "Heavy rainfall detected in Chennai (" + str(rain) + "mm/hr). Velachery, Adyar zones at high flood risk. Avoid low-lying areas.",
                    "timestamp": datetime.now().isoformat(),
                    "type": "flood_alert",
                    "is_live": True
                })
    except Exception:
        pass

    if updates:
        return updates

    return get_fallback_updates()

def get_fallback_updates():
    return [
        {"source": "Chennai Traffic Police", "text": "OMR near Perungudi - heavy congestion due to metro work.", "timestamp": datetime.now().isoformat(), "type": "traffic", "is_live": False},
        {"source": "GCC", "text": "Velachery Main Road waterlogged. Avoid until further notice.", "timestamp": datetime.now().isoformat(), "type": "flood", "is_live": False},
        {"source": "TNSDMA", "text": "Adyar river water level being monitored.", "timestamp": datetime.now().isoformat(), "type": "disaster", "is_live": False}
    ]
