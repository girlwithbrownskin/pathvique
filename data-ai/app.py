from flask import Flask
from flask_cors import CORS
from routes.dataset import dataset_bp
from routes.upload import upload_bp
from routes.tagging import tagging_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(dataset_bp, url_prefix="/api")
app.register_blueprint(upload_bp, url_prefix="/api")
app.register_blueprint(tagging_bp, url_prefix="/api")

@app.route("/")
def health():
    return {"status": "पथVique data-ai running"}

if __name__ == "__main__":
    app.run(debug=True, port=5000)