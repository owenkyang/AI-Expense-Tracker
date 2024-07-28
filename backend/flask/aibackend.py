from flask import Flask, request, jsonify, Blueprint
from openai import OpenAI
import os

main = Blueprint('main', __name__)
openai.api_key = os.getenv("OPENAI_KEY")

@main.route('/get_advice', methods=['POST'])
def get_advice():
    data = request.json
    transactions = data['transactions']
    
    prompt = f"Based on these transactions, provide financial advice: {transactions}"
    
    # Call the OpenAI API
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=150
    )
    
    advice = response.choices[0].text.strip()
    return jsonify({'advice': advice})