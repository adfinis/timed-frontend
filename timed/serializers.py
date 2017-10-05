from rest_framework_json_api.serializers import Serializer


class PkDict(dict):
    """Dictionary with additional pk attribute."""

    def __init__(self, pk, data):
        super().__init__(**data)
        self.pk = pk


class PkDictList(list):
    """List of pk dicts with additional pk attribute."""

    def __init__(self, pk_key, data):
        super().__init__([PkDict(val[pk_key], val) for val in data])


class PkDictSerializer(Serializer):
    """
    Serializer wrapping dict adding pk attribute.

    Adds support to serialize plain dicts with json api renderer
    as such expects a pk on each instance.
    However using this serializer will also work with other renderers.

    Pk is determined by using `pk_key` configured on serializers
    meta class. Additionally, `resource_name` needs to be assigned
    to meta as well.

    Example:
    >>> class MySerializer(PkDictSerializer):
    ...     # add your fields...
    ...
    ...     class Meta:
    ...        pk_key = 'id'
    ...        resource_name = 'my-resource'
    """

    def __new__(cls, instance, **kwargs):
        pk_key = cls.Meta.pk_key
        if isinstance(instance, dict):
            instance = PkDict(instance[pk_key], instance)
        else:
            instance = PkDictList(pk_key, instance)
        return super().__new__(cls, instance, **kwargs)
