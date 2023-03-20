import os
import requests
from flask import Flask, request, jsonify, send_from_directory, redirect, Response
from flask_cors import CORS
import sys
from transformers import pipeline

# generator = pipeline("text-generation", model="gpt2-medium", device=-1)
generator = pipeline("text-generation", model="distilgpt2", device=-1)

app = Flask(__name__, static_folder='ui', static_url_path='/ui')
CORS(app)

@app.route('/')
@app.route('/ui')
@app.route('/ui/')
def redirect_to_index():
    return redirect('/ui/index.html')

@app.route('/generate_text', methods=['POST'])
def handle_generate_text():
    prompt = request.json['prompt']
    max_length = 200

    # Generate text
    generated_text = generator(prompt, max_length=max_length)[0]['generated_text']

    # Return the generated text
    return jsonify({'generated_text': generated_text})

if __name__ == "__main__":
    app.run(host='0.0.0.0')
