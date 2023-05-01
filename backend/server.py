from flask import Flask, request
from flask_cors import CORS

import os
import subprocess
import json
import re
import sys
import openai

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:4200"], expose_headers=["X-Auth-Token"])
app.config["COMPRESS_REGISTER"] = False

@app.route("/")
def root():
  return json.dumps({
    "message": "Hello World!"
  })

@app.route("/chat")
def root():
  prompt = [
    {"role": "system", "content": "You are a helpfull assistant."},
    {"role": "user", "content": "Hello!"}
  ]
  
  completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=prompt, temperature=0.9, top_p= 0.1)
  return json.dumps({
    "message": completion.choices[0].message.content
  })

if __name__ == "__main__":
  # Scaleway's system will inject a PORT environment variable on which your application should start the server.
  port_env =  os.getenv("PORT", "8080")
  openai.api_key = os.getenv("OPENAI_KEY")
  port = int(port_env)
  app.run(debug=False, host="0.0.0.0", port=port)
