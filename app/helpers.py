import app
import os
import json

import app
from flask import url_for, current_app

def get_react_url():
    env = os.environ.get("FLASK_ENV")

    if env == "production":
        return url_for('static', filename='js/main.js')
    elif env == "development":
        return "http://localhost:8080/static/main.js"

def app_config(*args):
    CONFIG_FILE = "config.json"
    with open(os.path.join(current_app.config["APP_BASEDIR"], CONFIG_FILE)) as file:
        config = json.load(file)
        if len(args) == 1:
            return config.get(args[0])
        else:
            return {arg: config.get(arg) for arg in args}

