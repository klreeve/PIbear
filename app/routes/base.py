from datetime import datetime, timezone
from time import time_ns
from dateutil import tz
import csv
import os

from flask import (
    helpers,
    render_template,
    request,
    Blueprint,
    send_file,
    jsonify,
    current_app,
)

from app import db
from app.forms import SelectLocationForm
from app.models import Item, Location
from app.helpers import get_react_url, app_config


base = Blueprint("base", __name__)

HOME_PAGE = "item_form.html"

# Home Page
@base.route("/", methods=["GET", "POST"])
def index():
    form = (
        SelectLocationForm(location=l)
        if (l := request.cookies.get("location"))
        else SelectLocationForm()
    )
    form.populate_locations(list(Location.query.order_by("name")))

    return render_template(
        HOME_PAGE,
        title="Home",
        form=form,
        high_contrast=request.cookies.get("highContrast") == "true",
    )


@base.route("/download/<mode>/", methods=["GET", "POST"])
def download(mode):
    locations = list(Location.query.order_by("name"))
    location = l if (l := request.cookies.get("location")) else locations[0].code

    filename = f"{location}_{datetime.now().strftime('%m%d_%H%M')}.csv"

    TEMP_FILE = os.path.join("/var/tmp/", filename)
    PI_DOWNLOAD_LOCATION = os.path.join(
        current_app.config["APP_BASEDIR"], "docs", filename
    )

    with open(TEMP_FILE, "w") as temp:
        writer = csv.writer(temp)
        items = []
        items_query = (
            Item.query.filter_by(is_downloaded=False)
            if mode == "recent"
            else Item.query.all()
        )

        for item in items_query:
            if mode == "recent":
                item.is_downloaded = True

            item_time = datetime.fromtimestamp(item.datetime / 1000).astimezone(
                tz.tzlocal()
            )

            items.append(
                [
                    item.item_code,
                    item.type,
                    item_time.strftime("%H:%M:%S"),
                    item_time.strftime("%d/%m"),
                    item.location,
                    item.comments,
                ]
            )

        db.session.commit()

        titles = {
            key: value.upper()
            for (key, value) in app_config("itemName", "buttonsName").items()
        }

        writer.writerow(
            [
                titles["itemName"],
                titles["buttonsName"],
                "TIME",
                "DATE",
                "LOCATION",
                "COMMENTS",
            ]
        )
        writer.writerows(items)

    if request.method == "GET":
        return send_file(TEMP_FILE, as_attachment=True, mimetype="text/csv")
    else:

        with open(TEMP_FILE) as temp, open(PI_DOWNLOAD_LOCATION, "w") as output:
            for line in temp:
                output.write(line)

        return jsonify(success=True)
