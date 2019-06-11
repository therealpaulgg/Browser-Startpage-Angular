import json
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_httpauth import HTTPTokenAuth
from werkzeug.http import HTTP_STATUS_CODES

token_auth = HTTPTokenAuth()

def error_response(status_code, message=None):
    payload = {'error': HTTP_STATUS_CODES.get(status_code, 'Unknown error')}
    if message:
        payload['message'] = message
    response = jsonify(payload)
    response.status_code = status_code
    return response

app = Flask(__name__)
CORS(app)

API_KEY = "inVymaz66A7HdkIiuBm0VUtU2mYZdzWCfLv8xqSUF6jc3iutdcXVevMXRvV6q8lZPDSCcIxTUoyp0ozLydMI9p55i_Ee99KyLO3VwAU21nAzQl_gP35Fgo26cJfnW3Yx"
BASE_URL = "https://api.yelp.com/v3"

@token_auth.verify_token
def verify_token(token):
  return token == API_KEY

@token_auth.error_handler
def token_auth_error():
  return error_response(401)

@app.route("/getBusinessInformation")
@token_auth.login_required
def getBusinessId():
  name = request.args.get("name")
  address1 = request.args.get("address1")
  city = request.args.get("city")
  state = request.args.get("state")
  country = "US"
  limit = 1
  match_url = "{}{}".format(BASE_URL, "/businesses/matches")
  match_url_params = {
    "name": name,
    "address1": address1,
    "city": city,
    "state": state,
    "country": "US",
    "limit": 1
  }
  headers = {
    "Authorization": "Bearer %s" % API_KEY
  }
  match_request = requests.request("GET", match_url, headers=headers, params=match_url_params)
  if match_request.json()["businesses"]:
    business_id = match_request.json()["businesses"][0]["id"]

    detail_url = "{}{}{}".format(BASE_URL, "/businesses/", business_id)
    detail_request = requests.request("GET", detail_url, headers=headers)
    return jsonify(detail_request.json())
  else:
      return jsonify({
        "failure": True,
        "message": "There is no valid business ID."
      })

if __name__ == "__main__":
  app.run()
