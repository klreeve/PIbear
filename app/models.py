import re
from typing import Callable

from sqlalchemy.orm import validates

from app import db
from app.helpers import app_config

class Location(db.Model):  # type: ignore
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)
    code = db.Column(db.String(32), index=True, unique=True)

    def __repr__(self) -> str:
        return f"<Location {self.code}>"

class Item(db.Model):  # type: ignore
    id = db.Column(db.Integer, primary_key=True)
    is_downloaded = db.Column(db.Boolean)
    location = db.Column(db.String(), index=True)
    item_code = db.Column(db.String(32), index=True)
    type = db.Column(db.String(32), index=True)
    datetime = db.Column(db.Integer, index=True)
    comments = db.Column(db.String(256))

    @validates('location')
    def validate_location(self, key, location):
        if location not in [l.code for l in Location.query.order_by("code")]:
            raise AssertionError("LOCATION CANNOT BE FOUND IN THE DATABASE")
        return location

    @validates('item_code')
    def validate_code(self, key, item_code):
        if not bool(re.match(f"^[A-Za-z0-9]{{1,{app_config('itemCodeLength')}}}$", item_code)):
            raise AssertionError("INVALID ITEM CODE")
        return item_code

    @validates('type')
    def validate_type(self, key, type):
        if len(type) != 1:
            raise AssertionError("TYPE MUST HAVE A LENGTH OF 1")
        return type

    @validates('datetime')
    def validate_datetime(self, key, datetime):
        if not isinstance(datetime, int):
            raise AssertionError("DATETIME IS NOT A UTC INTEGER")
        return datetime

    @validates('comments')
    def validate_comments(self, key, comments):
        if len(comments) > 256:
            raise AssertionError("INVALID COMMENTS")
        return comments

    def __repr__(self) -> str:
        return f"<Item {self.item_code}>"

    def get_sort_order(sort_by: str, mod: str) -> Callable:
        orders = {
            "time": {
                "asc": Item.datetime.asc(),
                "desc": Item.datetime.desc()
            },
            "type": {
                "asc": Item.type.asc(),
                "desc": Item.type.desc()
            },
            "comments": {
                "asc": Item.comments.asc(),
                "desc": Item.comments.desc()
            },
            "item_code": {
                "asc": Item.item_code.asc(),
                "desc": Item.item_code.desc()
            },
            "location": {
                "asc": Item.location.asc(),
                "desc": Item.location.desc()
            }
        }

        return orders[sort_by][mod]