from datetime import timedelta

from django import forms


class DurationInHoursField(forms.fields.FloatField):
    """Field representing duration as float hours."""

    def prepare_value(self, value):
        if isinstance(value, timedelta):
            return value.total_seconds() / 3600
        return value

    def to_python(self, value):
        value = super().to_python(value)
        if value is None:
            return value

        return timedelta(seconds=value * 3600)
