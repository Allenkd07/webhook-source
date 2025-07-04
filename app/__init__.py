from flask import Flask
from flask_cors import CORS
from app.extensions import mongo
from app.webhooks.routes import webhook

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["MONGO_URI"] = "mongodb://localhost:27017/github_hooks"
    mongo.init_app(app)

    app.register_blueprint(webhook)

    return app
