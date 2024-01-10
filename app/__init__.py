from app.routes.errors import page_not_found
import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_assets import Environment, Bundle
from flask_fontawesome import FontAwesome

from config import Config

db = SQLAlchemy()
migrate = Migrate()

from app.models import Item, Location
from app.routes.base import base
from app.routes.locations import locations
from app.routes.api import api

from app.helpers import get_react_url


def create_app():
    # App init
    app = Flask(__name__)
    app.config.from_object(Config)
    fa = FontAwesome(app)

    # Extension Setup
    db.init_app(app)
    migrate.init_app(app, db)

    # Asset Setup
    app.register_blueprint(base)
    app.register_blueprint(api, url_prefix="/api")
    app.register_blueprint(locations, url_prefix="/locations")
    app.register_error_handler(404, page_not_found)

    assets = Environment(app)
    assets.url = app.static_url_path

    js_bundle = Bundle("ts/clock.ts", "ts/locationTabs.ts", output="gen/mini.js", filters=["typescript", "rjsmin"])
    assets.register("js_bundle", js_bundle)

    scss_bundle = Bundle("scss/main.scss", output="gen/mini.css", depends=["scss/*.scss", "scss/**/*.scss"], filters=["scss", "cssmin"])
    assets.register("scss_bundle", scss_bundle)

    # Contexts
    @app.shell_context_processor
    def make_shell_context():
        return {"db": db, "Item": Item, "Location": Location}

    @app.context_processor
    def inject_react_url():
        with app.app_context(), app.test_request_context():
            return dict(react_url=get_react_url())

    return app
