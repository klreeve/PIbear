# Entry Point
# Used by UWSGI
import sys

sys.path.insert(0, "/home/pi/piserver")

from app import create_app

application = create_app()
