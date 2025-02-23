from flask import Flask, request, jsonify
from flask_cors import CORS
from main import summarize_pdfs  # Import your summarize function

app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app)

latest_summary = None  # Store the latest summary JSON

@app.route("/summarize", methods=["POST"])
def summarize():
    global latest_summary
    try:
        data = request.get_json()
        pdf_urls = data.get("pdf_urls", [])

        if not pdf_urls:
            return jsonify({"error": "No PDF URLs provided"}), 400

        # Call the summarizer function from main.py
        json_data = summarize_pdfs(pdf_urls)

        if "error" not in json_data:
            latest_summary = json_data
            return jsonify(json_data)
        else:
            return jsonify(json_data), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/summary", methods=["GET"])
def get_summary():
    if latest_summary:
        return jsonify(latest_summary)
    return jsonify({"error": "No summary available"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=3000)