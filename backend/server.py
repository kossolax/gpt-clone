from flask import Flask, request
from flask_cors import CORS
from flask_queue_sse import ServerSentEvents

import os
import subprocess
import json
import re
import sys
import openai

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:4200"], expose_headers=["X-Auth-Token"])
app.register_blueprint(sse, url_prefix='/stream')


@app.route("/")
def root():
  return json.dumps({
    "message": "Hello World!"
  })

@app.route("/chat")
def chat():
  prompt = [
    {"role": "system", "content": "You are a helpfull assistant."},
    {"role": "user", "content": "Hello!"}
  ]
  
  sse = ServerSentEvents()
  yield sse.response()

  responses = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=prompt, temperature=0.9, top_p= 0.1, stream=True)
  for response in responses:
    if len(response.choices) > 0:
      if response.choices[0].delta and response.choices[0].delta.content:
        sse.send({"message": response.choices[0].delta.content})
      if response.choices[0].finish_reason == "stop":
        break
  sse.send(event="end")
  return ""

if __name__ == "__main__":
  # Scaleway's system will inject a PORT environment variable on which your application should start the server.
  port_env =  os.getenv("PORT", "8080")
  openai.api_key = os.getenv("OPENAI_KEY")
  port = int(port_env)
  app.run(debug=False, host="0.0.0.0", port=port)
