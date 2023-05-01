from flask import Flask, request
from flask_cors import CORS

import os
import subprocess
import json
import xmltodict
import re
import sys

DEFAULT_PORT = "8080"


app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:4200"], expose_headers=["X-Auth-Token"])
app.config["COMPRESS_REGISTER"] = False

@app.route("/")
def root():
  return json.dumps({
    "message": "Hello World!"
  })


if __name__ == "__main__":
  # Scaleway's system will inject a PORT environment variable on which your application should start the server.
  port_env =  os.getenv("PORT", DEFAULT_PORT)
  port = int(port_env)
  app.run(debug=False, host="0.0.0.0", port=port)
