from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

# GraphQL endpoint URL of your Node.js backend
GRAPHQL_URL = "https://ai-expense-tracker.onrender.com/graphql"

# Create a session object
session = requests.Session()

@app.route('/user_transactions/<user_id>', methods=['GET'])
def get_user_transactions(user_id):
    try:
        # Define the GraphQL query
        query = """
        query GetUserTransactions($userId: ID!) {
          user(userId: $userId) {
            _id
            username
            transactions {
              _id
              amount
              date
              description
              category
            }
          }
        }
        """

        # Variables for the query
        variables = {
            "userId": user_id
        }

        # Make a POST request to the GraphQL server with session cookies
        response = session.post(
            GRAPHQL_URL,
            json={"query": query, "variables": variables},
            headers={"Content-Type": "application/json"}
        )

        # Check for errors
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch transactions"}), response.status_code

        # Parse the response
        data = response.json()
        if "errors" in data:
            return jsonify({"error": data["errors"]}), 400

        # Return the transactions
        transactions = data["data"]["user"]["transactions"]
        return jsonify({"transactions": transactions})

    except Exception as e:
        print("Error fetching user transactions:", str(e))
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)