import json

from flask import render_template, redirect, Blueprint, url_for, request

from app import db
from app.forms import AddLocationForm, FromJSONForm
from app.models import Location

locations = Blueprint("locations", __name__)

EDIT_LOCATIONS = "edit_locations.html"
LOCATIONS_INDEX = "locations.index"

@locations.route("/", methods=["GET"])
def index():
    form = AddLocationForm()
    json_form = FromJSONForm()
    locations = Location.query.order_by("code")

    return render_template(
        EDIT_LOCATIONS,
        title="Locations",
        form=form,
        json_form=json_form,
        locations=locations,
        high_contrast=request.cookies.get("highContrast") == "true"
    )


@locations.route("/add", methods=["POST"])
def add_location():
    form = AddLocationForm()
    json_form = FromJSONForm()
    locations = Location.query.order_by("code")

    if form.validate_on_submit():
        location = Location(code=form.code.data, name=form.name.data)
        db.session.add(location)
        db.session.commit()

        return redirect(url_for(LOCATIONS_INDEX))

    return render_template(
        EDIT_LOCATIONS,
        title="Locations",
        form=form,
        json_form=json_form,
        locations=locations,
        high_contrast=request.cookies.get("highContrast") == "true"
    )


@locations.route("/upload", methods=["POST"])
def upload_locations():
    form = AddLocationForm()
    json_form = FromJSONForm()
    locations = Location.query.order_by("code")

    if json_form.validate_on_submit():
        data = str(json_form.file.data.read())
        data = data.replace("\\n", "").lstrip("b\\'").rstrip("\\'")
        data = json.loads(data)

        Location.query.delete()

        for code, name in data.items():
            db.session.add(Location(code=code, name=name))

        db.session.commit()
        return redirect(url_for(LOCATIONS_INDEX))

    print(json_form.file.errors)

    return render_template(
        EDIT_LOCATIONS,
        title="Locations",
        form=form,
        json_form=json_form,
        locations=locations,
        high_contrast=request.cookies.get("highContrast") == "true"
    )


enctype = "multipart/form-data"


@locations.route("/delete/<location_id>")
def delete(location_id):
    location = Location.query.get(location_id)
    db.session.delete(location)
    db.session.commit()
    return redirect(url_for(LOCATIONS_INDEX))

