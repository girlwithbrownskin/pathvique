from flask import Blueprint, request, jsonify
from utils.smart_chatbot import answer

tagging_bp = Blueprint("tagging", __name__)

@tagging_bp.route("/tag", methods=["POST"])
def tag():
    data = request.get_json()
    description = data.get("description", "")
    if not description:
        return jsonify({"error": "No description provided"}), 400
<<<<<<< HEAD
    return jsonify({"tag": answer(description)})
=======
    return jsonify({"tag": answer(description)})
>>>>>>> b5969d478d9be1b63c90fb9d8edca3f246b56a79
