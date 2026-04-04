from flask import Blueprint, jsonify, request
import json, os

dataset_bp = Blueprint("dataset", __name__)
BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../data")

def load(file):
    with open(os.path.join(BASE, file)) as f:
        return json.load(f)

@dataset_bp.route("/roads", methods=["GET"])
def get_roads():
    status = request.args.get("status")
    roads = load("roads.json")
    if status:
        roads = [r for r in roads if r["status"] == status]
    return jsonify(roads)

@dataset_bp.route("/construction", methods=["GET"])
def get_construction():
    return jsonify(load("construction.json"))

@dataset_bp.route("/flood-zones", methods=["GET"])
def get_flood_zones():
    return jsonify(load("flood_zones.json"))

@dataset_bp.route("/disaster-score", methods=["GET"])
def get_disaster_score():
    zones = load("flood_zones.json")
    score = round(sum(z["risk_score"] for z in zones) / len(zones), 1)
    return jsonify({"city_disaster_score": score, "zones": zones})

@dataset_bp.route("/live-updates", methods=["GET"])
def live_updates():
    from utils.news_scraper import get_chennai_traffic_updates
    return jsonify(get_chennai_traffic_updates())

@dataset_bp.route("/chat", methods=["POST"])
def chat():
    from utils.smart_chatbot import answer
    data = request.get_json()
    question = data.get("question", "")
    if not question:
        return jsonify({"error": "No question provided"}), 400
    return jsonify({
        "question": question,
        "answer": answer(question),
        "timestamp": __import__("datetime").datetime.now().isoformat()
    })

@dataset_bp.route("/smart-route", methods=["POST"])
def smart_route():
    from utils.routing import get_smart_route
    data = request.get_json()
    result = get_smart_route(
        data["start_lat"], data["start_lng"],
        data["end_lat"], data["end_lng"]
    )
    return jsonify(result)

@dataset_bp.route("/commute-impact", methods=["GET"])
def commute_impact():
    roads = load("roads.json")
    construction = load("construction.json")
    floods = load("flood_zones.json")
    blocked = [r for r in roads if r["status"] in ["blocked", "flooded"]]
    flood_zones = [f for f in floods if f["status"] != "clear"]
    impact = (len(blocked) * 30000) + (len(construction) * 15000) + (len(flood_zones) * 20000)
    return jsonify({
        "estimated_commuters_affected": impact,
        "blocked_roads": len(blocked),
        "active_construction_sites": len(construction),
        "active_flood_zones": len(flood_zones),
        "summary": "Approximately " + str(impact) + " Chennai commuters affected by current conditions."
    })

@dataset_bp.route("/history", methods=["GET"])
def history():
    return jsonify(load("history.json"))
