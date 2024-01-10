import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    # SERVER_NAME = "127.0.0.1:5000" if os.environ.get("FLASK_ENV") == "development" else "10.0.0.154"
    SECRET_KEY = os.environ.get("SECRET_KEY") or "1aa658fa74eb265829a9293f7a5eddababa44ccf"
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TYPESCRIPT_BIN = os.path.join(basedir, "node_modules/typescript/bin/tsc")
    SASS_BIN = os.path.join(basedir, "node_modules/sass/sass.js")

    APP_BASEDIR = basedir
    SEND_FILE_MAX_AGE_DEFAULT = 0

