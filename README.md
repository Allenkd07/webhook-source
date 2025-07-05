# GitFlow - GitHub Webhook Viewer

This project consists of two main parts:

1. **Backend** (Flask + MongoDB): Receives GitHub webhook events for `push`, `pull_request`, and `merge` actions, stores them in MongoDB.
2. **Frontend** (React + Tailwind CSS): Polls the backend every 15 seconds to display the latest GitHub activity in a clean, readable format.

---

## 📁 Project Structure

```

.
├── app/                    # Flask application
│   ├── utils/             # Contains parser logic for GitHub events
│   ├── webhooks/          # Webhook route handler
│   ├── extensions.py      # MongoDB configuration
│   └── **init**.py        # Flask app factory
├── run.py                 # Entry point to run the backend server
├── requirements.txt       # Python dependencies
│
├── frontend/              # React + Tailwind CSS frontend
│   ├── src/components     # Event list UI
│   ├── index.html         # Root HTML
│   └── tailwind.config.js # Tailwind setup
│
├── README.md              # This file
└── .gitignore             # Git & IDE exclusions

````

---

## ✅ Features

- Receives GitHub webhook events (`push`, `pull_request`, `merge`)
- Stores event data in MongoDB using a specific schema
- Frontend polls backend every 15 seconds to show latest events
- Neatly formatted messages based on event type

---

## ⚙️ Backend Setup

### 1. Clone the repo & create a virtual environment:
```bash
git clone <your-repo-url>
cd webhook-source
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
````

### 2. Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Start MongoDB (locally or via Docker):

Ensure MongoDB is running on default port (`mongodb://localhost:27017`).

You can use Docker:

```bash
docker run -d -p 27017:27017 --name webhook-mongo mongo
```

### 4. Run the backend:

```bash
python run.py
```

It should start on: `http://localhost:5000`

---

## 🧪 Setting up the GitHub Webhook

1. Go to your `action-repo` on GitHub
2. Settings → Webhooks → Add webhook
3. **Payload URL**: Use a tunnel service like `ngrok` or `localtunnel`:

   ```
   https://your-tunnel-url/webhook/receiver
   ```
4. **Content type**: `application/json`
5. **Events to trigger**:

   * ✅ Pushes
   * ✅ Pull requests
6. Click **"Add webhook"**

---

## 🎨 Frontend Setup

### 1. Navigate to the frontend folder:

```bash
cd frontend
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Fix PostCSS config (if needed):

Rename `postcss.config.js` → `postcss.config.cjs`:

```bash
mv postcss.config.js postcss.config.cjs
```

### 4. Run the React dev server:

```bash
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

Make sure your backend is running on `http://localhost:5000`
You can update the API URL inside `App.jsx` if needed.

---

## 🧩 MongoDB Schema

| Field         | Type       | Description                        |
| ------------- | ---------- | ---------------------------------- |
| `_id`         | ObjectId   | MongoDB default ID                 |
| `request_id`  | string     | Commit hash or PR ID               |
| `author`      | string     | GitHub username                    |
| `action`      | enum       | `PUSH`, `PULL_REQUEST`, `MERGE`    |
| `from_branch` | string     | Source branch name (if applicable) |
| `to_branch`   | string     | Target branch name                 |
| `timestamp`   | ISO string | Event time in UTC                  |

---

## 📦 Technologies Used

* **Backend**: Python, Flask, MongoDB, Flask-PyMongo
* **Frontend**: React, Tailwind CSS, Vite
* **Integration**: GitHub Webhooks, LocalTunnel/Ngrok for development

---

Certainly! Here's the updated **📌 Notes** section with the exact commands for using `ngrok` and `localtunnel` to expose your backend:

---

Got it! Since your backend now **gracefully ignores** unhandled events and returns a `200 OK` with `"message": "Event ignored"` (instead of an error), here's the **updated 📌 Notes** section for your `README.md`:

---

## 📌 Notes

* This is a **local-first** project. To expose the backend for GitHub Webhooks (so GitHub can reach your `/webhook/receiver` endpoint), use one of the following tunneling tools:

---

### ▶️ Option 1: Using [ngrok](https://ngrok.com/)

```bash
# Install ngrok globally
npm install -g ngrok

# Start the Flask server
python run.py

# Expose Flask on port 5000
ngrok http 5000
```

Then copy the generated URL (e.g. `https://abcd1234.ngrok.io`) and use:

```
https://abcd1234.ngrok.io/webhook/receiver
```

as the **Payload URL** when creating the GitHub webhook.

---

### ▶️ Option 2: Using [localtunnel](https://www.npmjs.com/package/localtunnel)

```bash
# Optionally install globally
npm install -g localtunnel

# Or use npx directly
npx localtunnel --port 5000
```

You’ll get an output like:

```
your url is: https://cool-subdomain.loca.lt
```

Use:

```
https://cool-subdomain.loca.lt/webhook/receiver
```

as the webhook Payload URL on GitHub.

---

### ℹ️ Note on Ignored Events

If the webhook receives an event other than the 3 handled (`push`, `pull_request`, `merge`), the server will simply ignore it and respond with:

```json
{
  "message": "Event ignored"
}
```

* This is normal and means your webhook is working.
* Only the 3 relevant events are stored in MongoDB.
* `push`
* `pull_request`
* `merge`
* Only these will be processed and stored in MongoDB.

---

## 👨‍💻 Author

Karthik Dileep
LinkedIn: [linkedin.com/in/karthikdileep](https://www.linkedin.com/in/karthikdileep-kd21/)

