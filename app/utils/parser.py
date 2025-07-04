from datetime import datetime

def parse_github_event(event_type, payload):
    if event_type == "push":
        return {
            "request_id": payload.get("after"),
            "author": payload["pusher"]["name"],
            "action": "PUSH",
            "from_branch": "",
            "to_branch": payload["ref"].split("/")[-1],
            "timestamp": datetime.utcnow().isoformat()
        }

    elif event_type == "pull_request":
        pr = payload["pull_request"]
        author = pr["user"]["login"]
        from_branch = pr["head"]["ref"]
        to_branch = pr["base"]["ref"]
        pr_id = str(pr["id"])

        if payload["action"] == "opened":
            return {
                "request_id": pr_id,
                "author": author,
                "action": "PULL_REQUEST",
                "from_branch": from_branch,
                "to_branch": to_branch,
                "timestamp": datetime.utcnow().isoformat()
            }
        elif payload["action"] == "closed" and pr.get("merged"):
            return {
                "request_id": pr_id,
                "author": author,
                "action": "MERGE",
                "from_branch": from_branch,
                "to_branch": to_branch,
                "timestamp": datetime.utcnow().isoformat()
            }

    return None
