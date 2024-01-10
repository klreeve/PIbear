from operator import itemgetter

from flask import request, Blueprint, jsonify

from sqlalchemy import or_

from app import db
from app.models import Item, Location
from app.helpers import app_config

api = Blueprint("api", __name__)

# GET REQUESTS

@api.route("/items/<order>/<int:page>", methods=["GET"])
def get_items(order, page):

    parsedOrder = Item.get_sort_order(*order.split(":"))
    pagination = Item.query.order_by(parsedOrder).paginate(page, app_config("itemsPerPage"), False)

    return {
        "items": [
            {
                "id": item.id,
                "is_downloaded": item.is_downloaded,
                "location": item.location,
                "item_code": item.item_code,
                "type": item.type,
                "datetime": item.datetime,
                "comments": item.comments
            } for item in pagination.items ],
        "pageInfo": {
            "totalPages": pagination.pages,
            "totalItems": pagination.total
        }
    }

@api.route("/items/all", methods=["GET"])
def get_all_items():
    items = Item.query.all()

    return jsonify([{
                "id": item.id,
                "is_downloaded": item.is_downloaded,
                "location": item.location,
                "item_code": item.item_code,
                "type": item.type,
                "datetime": item.datetime,
                "comments": item.comments
            } for item in items ])


@api.route("/search/<match>/<order>/<int:page>", methods=["GET"])
def search(match, order, page):

    parsedOrder = Item.get_sort_order(*order.split(":"))

    condition = or_(*[getattr(Item, col).ilike(f'{match}%') for col in ["item_code", "comments"]])

    pagination = Item.query.filter(condition).order_by(parsedOrder).paginate(page, app_config("itemsPerPage"), False)

    return {
        "items": [
            {
                "id": item.id,
                "is_downloaded": item.is_downloaded,
                "location": item.location,
                "item_code": item.item_code,
                "type": item.type,
                "datetime": item.datetime,
                "comments": item.comments
            } for item in pagination.items ],
        "pageInfo": {
            "totalPages": pagination.pages,
            "totalItems": pagination.total
        }
    }

@api.route("/locations", methods=["GET"])
def get_locations():
    locations = list(Location.query.order_by("name"))
    return jsonify([
            {
                "code": l.code,
                "name": l.name
            } for l in locations
        ])

# DELETE REQUESTS

@api.route("/delete/<item_id>", methods=["DELETE"])
def delete(item_id):

    if item_id == "all":
        Item.query.delete()
        db.session.commit()
    else:
        item = Item.query.get(item_id)
        db.session.delete(item)
        db.session.commit()

    return {"success": True}

# POST REQUESTS

@api.route("/add/", methods=["POST"])
def add():
    code, type, time_added, comments, location = itemgetter('code', 'type', 'time_added', 'comments', 'location')(request.json)

    try:
        item = Item(
            is_downloaded = False,
            item_code = code,
            type = type,
            datetime = time_added,
            location = location,
            comments = comments
        )
    except AssertionError as exception_message:
        return str(exception_message), 422

    db.session.add(item)
    db.session.commit()


    return {
        "id": item.id,
        "is_downloaded": item.is_downloaded,
        "location": item.location,
        "item_code": item.item_code,
        "type": item.type,
        "datetime": item.datetime,
        "comments": item.comments
    }

# PUT REQUESTS

@api.route("/edit/<id>", methods=["PUT"])
def edit(id):
    edited_item = Item.query.get(id)
    code, type, comments, location = itemgetter('code', 'type', 'comments', 'location')(request.json)

    try:
        edited_item.item_code = code
        edited_item.type = type
        edited_item.comments = comments
        edited_item.location = location
        edited_item.is_downloaded = False

    except AssertionError as exception_message:
        return str(exception_message), 422

    db.session.commit()

    return jsonify(success=True)


