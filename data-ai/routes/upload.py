from flask import Blueprint, request, jsonify
from utils.cloudinary_helper import upload_image
from utils.smart_chatbot import answer

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload-report", methods=["POST"])
def upload_report():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    file = request.files["image"]
    description = request.form.get("description", "")
    location = request.form.get("location", "Unknown")
    uploaded = upload_image(file)
    tag = answer(description)
    return jsonify({
        "status": "success",
        "image_url": uploaded["url"],
        "location": location,
        "description": description,
        "tag": tag
    })
