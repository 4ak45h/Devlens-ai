import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables
load_dotenv(override=True)

from app import create_app

# Create Flask app
app = create_app()

# Enable CORS for all routes
CORS(app)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)