from flask import Blueprint, request, jsonify
from app.extensions import mongo
from app.utils.parser import parse_github_event
from pymongo.errors import PyMongoError
from math import ceil

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

@webhook.route('/receiver', methods=["POST"])
def receiver():
    try:
        data = request.json
        event_type = request.headers.get("X-GitHub-Event")

        parsed = parse_github_event(event_type, data)
        if parsed:
            mongo.db.events.insert_one(parsed)  # type: ignore
            return jsonify({"status": "stored"}), 201
        else:
            return jsonify({"message": "Event ignored"}), 200

    except PyMongoError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@webhook.route('/events', methods=["GET"])
def get_events():
    try:
        # Get pagination params from query string
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        # Count total events
        total_count = mongo.db.events.count_documents({})  # type: ignore
        total_pages = ceil(total_count / limit)

        # Fetch paginated events
        events_cursor = mongo.db.events.find().sort("timestamp", -1).skip(skip).limit(limit)  # type: ignore

        result = []
        for e in events_cursor:
            e["_id"] = str(e["_id"])
            result.append(e)

        return jsonify({
            "page": page,
            "limit": limit,
            "total_count": total_count,
            "total_pages": total_pages,
            "results": result
        }), 200

    except PyMongoError as e:
        return jsonify({"error": "Database error", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500