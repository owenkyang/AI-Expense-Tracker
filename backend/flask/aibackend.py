from flask import Flask, request, jsonify, session
import requests
from openai import OpenAI
import os
from dotenv import load_dotenv
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
session = requests.Session()

# GraphQL endpoint URL of your Node.js backend
GRAPHQL_URL = "https://ai-expense-tracker.onrender.com/graphql"
load_dotenv()
app.secret_key = os.urandom(24)
# Create a session object
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
history = {}

# @app.route('/user_transactions', methods=['GET'])
# def get_user_transactions(user_id):
#     try:
#         # Define the GraphQL query
#         query = """
#         query GetUserTransactions($userId: ID!) {
#           user(userId: $userId) {
#             _id
#             username
#             transactions {
#               _id
#               amount
#               date
#               description
#               category
#             }
#           }
#         }
#         """

#         # Variables for the query
#         variables = {
#             "userId": user_id
#         }

#         # Make a POST request to the GraphQL server with session cookies
#         response = session.post(
#             GRAPHQL_URL,
#             json={"query": query, "variables": variables},
#             headers={"Content-Type": "application/json"}
#         )

#         # Check for errors
#         if response.status_code != 200:
#             return jsonify({"error": "Failed to fetch transactions"}), response.status_code

#         # Parse the response
#         data = response.json()
#         if "errors" in data:
#             return jsonify({"error": data["errors"]}), 400

#         # Return the transactions
#         transactions = data["data"]["user"]["transactions"]
#         return jsonify({"transactions": transactions})

#     except Exception as e:
#         print("Error fetching user transactions:", str(e))
#         return jsonify({"error": "Internal server error"}), 500

@app.before_request
def init_chat():
    history['messages'] = []

@app.route('/financial_advice', methods=['POST'])
def chat_with_gpt():
    try:
        data = request.json
        user_id = data.get('user_id')
        user_prompt = data.get('prompt')
        if not user_prompt:
            return jsonify({"error": "Promopt is required"}), 400

        # Fetch user transactions
        query = """
        query GetUserTransactions($userId: ID!) {
          user(userId: $userId) {
            transactions {
              amount
              date
              description
              category
            }
          }
        }
        """

        variables = {
            "userId": user_id
        }

        response = session.post(
            GRAPHQL_URL,
            json={"query": query, "variables": variables},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch transactions"}), response.status_code

        data = response.json()
        if "errors" in data:
            return jsonify({"error": data["errors"]}), 400

        transactions = data["data"]["user"]["transactions"]

        transactions_text = "\n".join([
            f"- {t['date']}: {t['description']} ({t['category']}) - ${t['amount']}" for t in transactions
        ])
        prompt = f"User's Transactions:\n{transactions_text}\n\nUser's Question: {user_prompt}"
        history['messages'].append({"role": "user", "content": prompt})
        # Call the OpenAI API
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",  
            messages=history['messages'],
            max_tokens=150,
            temperature=0.7,
        )

        # Get the AI response
        ai_response = completion.choices[0].message.content
        history['messages'].append({"role": "assistant", "content": ai_response})

        print(jsonify({"response": ai_response}))
        return jsonify({"response": ai_response})

    except Exception as e:
        print("Error in chat_with_gpt:", str(e))
        return jsonify({"error": "Internal server error"}), 500
    
@app.route('/clear_session', methods=['POST'])
def clear_session():
    history['messages'] = []
    return jsonify({"message": "Session cleared and conversation reset."})

if __name__ == '__main__':
    app.run(port=5000, debug=True)