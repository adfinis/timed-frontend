from datetime import timedelta

from django.db.models import Sum
from django.utils.duration import duration_string
from rest_framework_json_api.serializers import Serializer


class DictObject(dict):
    """
    Wrap dict into an object.

    All values will be accesible through attributes. Note that
    keys must be valid python names for this to work.
    """

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)
        super().__init__(**kwargs)


class DictObjectSerializer(Serializer):
    """
    Serializer wrapping object into a `DictObject`.

    Adds support to serialize plain dicts with json api renderer
    as such expects values to be attributes.
    Note that dict needs to have a pk key to work as json api resource.

    Example:
    >>> class MySerializer(DictObjectSerializer):
    ...     # add your fields...
    ...
    ...     class Meta:
    ...        resource_name = 'my-resource'
    """

    def __new__(cls, instance, **kwargs):
        if isinstance(instance, dict):
            instance = DictObject(**instance)
        else:
            instance = [DictObject(**entry) for entry in instance]
        return super().__new__(cls, instance, **kwargs)


class TotalTimeRootMetaMixin(object):
    duration_field = 'duration'

    def get_root_meta(self, resource, many):
        """Add total hours over whole result (not just page) to meta."""
        if many:
            view = self.context['view']
            queryset = view.filter_queryset(view.get_queryset())
            data = queryset.aggregate(total_time=Sum(self.duration_field))
            data['total_time'] = duration_string(
                data['total_time'] or timedelta(0)
            )
            return data
        return {}
