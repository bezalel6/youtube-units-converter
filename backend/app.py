# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app)

@app.route('/transcript/<videoId>', methods=['GET'])
def get_transcript(videoId):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(videoId)
        return jsonify(transcript)
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(port=3000)
