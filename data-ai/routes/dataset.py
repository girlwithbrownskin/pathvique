from flask import Blueprint, jsonify, request
import json, os

dataset_bp = Blueprint("dataset", __name__)
BASE = os.path.join(os.path.dirname(__file__), "../data")

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


    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Translate if needed then answer
    answer_text = ai_answer(question)

    if lang != "en":
        answer_text = translate_text(answer_text, lang)

    return jsonify({
        "question": question,
        "answer": answer_text,
        "language": lang,
        "ai_powered": bool(os.getenv("HUGGINGFACE_KEY")),
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

@dataset_bp.route("/zone-advice/<area>", methods=["GET"])
def zone_advice(area):
    zones = load("flood_zones.json")
    roads = load("roads.json")

    zone_data = next((z for z in zones if z["area"].lower() == area.lower()), None)
    if not zone_data:
        return jsonify({"error": "Area not found"}), 404

    score = zone_data["risk_score"]

    if score > 70:
        advice = "Avoid this area. Use alternate routes via GST Road or Anna Salai."
        color = "red"
    elif score > 40:
        advice = "Proceed with caution. Monitor updates before travelling."
        color = "orange"
    else:
        advice = "Area is safe. Normal travel conditions."
        color = "green"

    return jsonify({
        "area": area,
        "risk_score": score,
        "status": zone_data["status"],
        "advice": advice,
        "color": color,
        "last_updated": zone_data["last_updated"]
    })

@dataset_bp.route("/commute-impact", methods=["GET"])
def commute_impact():
    roads = load("roads.json")
    construction = load("construction.json")
    floods = load("flood_zones.json")

    blocked = [r for r in roads if r["status"] in ["blocked", "flooded"]]
    active_construction = len(construction)
    flood_zones = [f for f in floods if f["status"] != "clear"]

    # Calculate how many people are impacted
    impact_score = (len(blocked) * 30000) + (active_construction * 15000) + (len(flood_zones) * 20000)

    return jsonify({
        "estimated_commuters_affected": impact_score,
        "blocked_roads": len(blocked),
        "active_construction_sites": active_construction,
        "active_flood_zones": len(flood_zones),
        "summary": f"Approximately {impact_score:,} Chennai commuters are affected by current infrastructure conditions.",
        "timestamp": __import__("datetime").datetime.now().isoformat()
    })

@dataset_bp.route("/history", methods=["GET"])
def history():
    return jsonify(load("history.json"))

@dataset_bp.route("/chat", methods=["POST"])
def chat():
    from utils.ai_chatbot import ai_answer
    from utils.translator import translate_text
    import os

    data = request.get_json()
    question = data.get("question", "")
    lang = data.get("language", "en")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    answer_text = ai_answer(question)

    if lang != "en":
        answer_text = translate_text(answer_text, lang)

    return jsonify({
        "question": question,
        "answer": answer_text,
        "language": lang,
        "ai_powered": bool(os.getenv("HUGGINGFACE_KEY")),
        "timestamp": __import__("datetime").datetime.now().isoformat()
    })


@dataset_bp.route("/ai-analytics", methods=["GET"])
def ai_analytics():
    from utils.ai_analytics import generate_city_report
    roads = load("roads.json")
    floods = load("flood_zones.json")
    construction = load("construction.json")
    return jsonify(generate_city_report(roads, floods, construction))
    
