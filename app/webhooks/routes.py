from flask import Blueprint, request, jsonify
from app.extensions import mongo
from app.utils.parser import parse_github_event

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

@webhook.route('/receiver', methods=["POST"])
def receiver():
    data = request.json
    event_type = request.headers.get("X-GitHub-Event")

    parsed = parse_github_event(event_type, data)
    if parsed:
        mongo.db.events.insert_one(parsed) # type: ignore
        return jsonify({"status": "stored"}), 201
    else:
        return jsonify({"message": "Event ignored"}), 200

@webhook.route('/events', methods=["GET"])
def get_events():
    latest_events = mongo.db.events.find().sort("timestamp", -1).limit(10) # type: ignore
    result = []
    for e in latest_events:
        e["_id"] = str(e["_id"])
        result.append(e)
    return jsonify(result), 200
