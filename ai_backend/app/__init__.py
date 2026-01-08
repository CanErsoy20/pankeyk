from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Allow Frontend to talk to us
    CORS(app) 

    # Register the routes
    from app.routes.translation import translation_bp
    app.register_blueprint(translation_bp)

    return app