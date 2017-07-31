from django import template

register = template.Library()


@register.filter
def float_hours(duration):
    """Convert timedelta to floating hours."""
    return duration.total_seconds() / 3600
