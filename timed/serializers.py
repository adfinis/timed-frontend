from rest_framework_json_api.serializers import Serializer


class PkDict(dict):
    """Dictionary with additional pk attribute."""

    def __init__(self, pk, data):
        super().__init__(**data)
        self.pk = pk


class PkDictList(list):
    """List of pk dicts with additional pk attribute."""

    def __init__(self, serializer, data):
        super().__init__([
            PkDict(serializer.get_pk(val), val)
            for val in data
        ])


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
        if isinstance(instance, dict):
            instance = PkDict(cls.get_pk(instance), instance)
        else:
            instance = PkDictList(cls, instance)
        return super().__new__(cls, instance, **kwargs)

    @classmethod
    def get_pk(cls, item):
        """
        Get primary key of given item.

        Takes dict value of configured pk_key.
        """
        return item[cls.Meta.pk_key]
