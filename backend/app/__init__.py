from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv(override=True)

def create_app():
    app = Flask(__name__)
    # Allow all origins for development - the frontend runs on different ports
    CORS(app)

    from app.routes.analyze import analyze_bp
    app.register_blueprint(analyze_bp, url_prefix="/api")

    return app
