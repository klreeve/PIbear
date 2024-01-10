import json, re
from operator import length_hint

from typing import List, Text

from flask import request
from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    SubmitField,
    SelectField,
    FileField,
    BooleanField,
)
from wtforms.fields.simple import HiddenField
from wtforms.validators import InputRequired, Length, Regexp, ValidationError

from app.models import Location

ALPHA_REGEX = "^[a-zA-Z]+$"

class SelectLocationForm(FlaskForm):
    location = SelectField(
        label="Locations",
        validators=[InputRequired(message="Locations field cannot be empty.")],
    )

    def populate_locations(self, locations: List[Location]) -> None:
        self.location.choices = [(l.code, l.name) for l in locations]

class AddLocationForm(FlaskForm):
    code = StringField(
        label="Code",
        validators=[
            InputRequired(message="Please enter a valid code."),
            Length(min=2, max=2, message="Location codes must be %(max)d characters."),
            Regexp(
                ALPHA_REGEX, message="Location codes only use the characters A-Z."
            ),
        ],
    )

    name = StringField(
        label="Name",
        validators=[
            InputRequired(message="Please enter a name."),
            Length(
                max=64, message="Location name must be less than %(max)d characters."
            ),
        ],
    )
    submit_add = SubmitField("ADD LOCATION")


class FromJSONForm(FlaskForm):
    file = FileField(label="SELECT FILE")

    confirm = BooleanField(
        label="I understand that this will overwrite all existing locations.",
        validators=[InputRequired(message="Confirmation is required.")],
    )

    submit_upload = SubmitField(label="UPLOAD")

    def validate_file(self, file):

        if not file.data.filename.endswith(".json"):
            raise ValidationError("File must be a JSON.")

        try:
            data: str = str(file.data.read())
            data = data.replace("\\n", "").replace(" ", "").lstrip("b\\'").rstrip("\\'")
            data = json.loads(data)
            file.data.seek(0)
        except:
            raise ValidationError("JSON file has invalid syntax.")


        if not isinstance(data, dict):
            raise ValidationError("Schema does not contain a dictionary.")

        if len(data.values()) != len(set(data.values())):
            raise ValidationError("Data contains duplicate locations.")

        for code, name in data.items():
            if not isinstance(code, str) or not isinstance(name, str):
                raise ValidationError("Some location data includes non-string data types.")

            if len(code) != 2 or re.compile(ALPHA_REGEX).match(code) is None:
                raise ValidationError("Some location codes are not 2 chars A-Z or a-z long.")
