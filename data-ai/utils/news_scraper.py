from datetime import datetime

def get_chennai_traffic_updates():
    return get_fallback_updates()

def get_fallback_updates():
    return [
        {"source": "Chennai Traffic Police", "text": "OMR near Perungudi - heavy congestion due to metro work. Use service road.", "timestamp": datetime.now().isoformat(), "type": "traffic"},
        {"source": "GCC", "text": "Velachery Main Road waterlogged. Avoid until further notice.", "timestamp": datetime.now().isoformat(), "type": "flood"},
        {"source": "TNSDMA", "text": "Adyar river water level being monitored. Residents near banks stay alert.", "timestamp": datetime.now().isoformat(), "type": "disaster"}
    ]
