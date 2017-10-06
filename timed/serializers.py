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
    as such expects a values to be attributes.
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
