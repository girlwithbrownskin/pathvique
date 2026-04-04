from flask import Blueprint, request, jsonify
from utils.smart_chatbot import answer

tagging_bp = Blueprint("tagging", __name__)

@tagging_bp.route("/tag", methods=["POST"])
def tag():
    data = request.get_json()
    description = data.get("description", "")
    if not description:
        return jsonify({"error": "No description provided"}), 400
    return jsonify({"tag": answer(description)})
