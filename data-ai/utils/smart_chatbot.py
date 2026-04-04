import json, os
from datetime import datetime

def load_data():
<<<<<<< HEAD
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../data")
    with open(os.path.join(base, "roads.json")) as f: roads = json.load(f)
    with open(os.path.join(base, "flood_zones.json")) as f: floods = json.load(f)
    with open(os.path.join(base, "construction.json")) as f: construction = json.load(f)
=======
    base = os.path.join(os.path.dirname(__file__), "../data")
    with open(f"{base}/roads.json") as f: roads = json.load(f)
    with open(f"{base}/flood_zones.json") as f: floods = json.load(f)
    with open(f"{base}/construction.json") as f: construction = json.load(f)
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79
    return roads, floods, construction

def get_disaster_score(floods):
    scores = [f["risk_score"] for f in floods]
    return round(sum(scores) / len(scores), 1)

def answer(question: str):
    q = question.lower()
    roads, floods, construction = load_data()

    if any(w in q for w in ["flood", "water", "waterlog", "rain", "submerge"]):
        active = [f for f in floods if f["status"] in ["flooded", "waterlogged"]]
        if active:
            areas = ", ".join([f["area"] for f in active])
<<<<<<< HEAD
            return "Currently flooded or waterlogged in Chennai: " + areas + ". Avoid these areas."
        return "No active flood alerts in Chennai right now."
=======
            return "Currently flooded or waterlogged in Chennai: " + areas + ". Avoid these areas and use alternate routes."
        return "No active flood alerts in Chennai right now. Stay updated as weather changes."
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79

    if any(w in q for w in ["block", "close", "construction", "avoid", "road", "route", "traffic"]):
        blocked = [r for r in roads if r["status"] in ["blocked", "flooded"]]
        if blocked:
            details = " | ".join([r["name"] + " (" + r.get("reason", "blocked") + ")" for r in blocked])
            return "Blocked roads right now: " + details + ". Plan your route accordingly."
        return "All major roads are clear right now."

    if any(w in q for w in ["safe", "disaster", "risk", "score", "danger"]):
        score = get_disaster_score(floods)
        level = "HIGH" if score > 70 else "MODERATE" if score > 40 else "LOW"
<<<<<<< HEAD
        return "Chennai disaster risk score is " + str(score) + "/100 - " + level + "."
=======
        return "Chennai's current disaster risk score is " + str(score) + "/100 - " + level + ". Check the map for zone-wise details."
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79

    for flood in floods:
        if flood["area"].lower() in q:
            return flood["area"] + ": Risk score " + str(flood["risk_score"]) + "/100. Status - " + flood["status"].upper() + ". Reason: " + flood.get("reason", "N/A") + "."

    for road in roads:
        if road["name"].lower() in q:
            status = "BLOCKED" if road["status"] in ["blocked", "flooded"] else "CLEAR"
            return road["name"] + " is currently " + status + ". " + road.get("reason", "")

<<<<<<< HEAD
    if any(w in q for w in ["construct", "metro", "repair", "work"]):
        details = " | ".join([c["location"] + " - " + c["description"] for c in construction])
        return "Active construction in Chennai: " + details + "."

    return "I can answer questions about Chennai road conditions, flood zones, and disaster risk. Try: Is Velachery flooded?"
=======
    if any(w in q for w in ["construct", "metro", "repair", "work", "gcc", "cmrl"]):
        details = " | ".join([
            c["location"] + " - " + c["description"] + " (clears " + c["expected_clear"] + ")"
            for c in construction
        ])
        return "Active construction in Chennai: " + details + "."

    if "time" in q or "when" in q:
        return "Current time: " + datetime.now().strftime("%I:%M %p") + " IST."

    return "I can answer questions about Chennai road conditions, flood zones, construction, and disaster risk. Try: Is Velachery flooded? or Which roads are blocked?"
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79
