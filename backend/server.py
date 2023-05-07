from flask import Flask, request, stream_with_context
from flask_cors import CORS

import os
import subprocess
import json
import re
import sys
import openai

app = Flask(__name__)
cors = CORS(app, origins=["http://localhost:4200"], expose_headers=["X-Auth-Token"])
models = os.getenv("MODELS", "gpt-3.5-turbo").split(",")

@app.route("/")
def root():
  return json.dumps({
    "message": "Hello World!"
  })

@app.route("/keepalive")
def keepalive():
  return "Ok"

@app.route("/models")
def get_models():
  return json.dumps(models)

@app.route("/chat", methods = ['POST', 'GET'])
def chat():
  prompt = [
    {"role": "system", "content": "You are a helpfull assistant."},
    {"role": "user", "content": "Hello!"}
  ]

  try:
    prompt = request.get_json()
  except:
    return "Error"

  def generate():
    responses = openai.ChatCompletion.create(model=models[0], messages=prompt, temperature=0.9, top_p= 0.1, stream=True)
    for response in responses:
      if len(response.choices) > 0:
        try:
          if response.choices[0].delta and response.choices[0].delta.content:
            yield response.choices[0].delta.content
        except AttributeError:
          pass

        try:
          if response.choices[0].finish_reason == "stop":
            break
        except AttributeError:
          pass

  return app.response_class(stream_with_context(generate()))

if __name__ == "__main__":
  # Scaleway's system will inject a PORT environment variable on which your application should start the server.
  port_env =  os.getenv("PORT", "8080")
  openai.api_key = os.getenv("OPENAI_KEY")
  port = int(port_env)
  app.run(debug=False, host="0.0.0.0", port=port)
