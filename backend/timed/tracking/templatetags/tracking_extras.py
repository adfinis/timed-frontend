from django import template

register = template.Library()


@register.filter
def duration(timedelta):
    total_seconds = int(timedelta.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60

    return f"{hours}:{minutes:02} (h:mm)"
