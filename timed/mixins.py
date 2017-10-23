from rest_framework_json_api.relations import ResourceRelatedField


class AggregateQuerysetMixin(object):
    """
    Add support for aggregate queryset in view.

    Wrap queryst dicts into aggregate object to support renderer
    which expect attributes.
    It additional prefetches related instances represented as id in
    aggregate.

    In aggregates only an id of a related field is part of the object.
    Instead of loading each single object row by row this mixin
    prefetches all resources related field in injects
    it before serialization starts.

    Mixin expects the id to be the same key as the resource related
    field defined in the serializer.
    """

    class AggregateObject(dict):
        """
        Wrap dict into an object.

        All values will be accesible through attributes. Note that
        keys must be valid python names for this to work.
        """

        def __init__(self, **kwargs):
            self.__dict__.update(kwargs)
            super().__init__(**kwargs)

    def get_serializer(self, data, *args, **kwargs):
        many = kwargs.get('many')
        if not many:
            data = [data]

        # prefetch data for all related fields
        prefetch_per_field = {}
        serializer_class = self.get_serializer_class()
        for key, value in serializer_class._declared_fields.items():
            if isinstance(value, ResourceRelatedField):
                source = value.source or key
                if many:
                    obj_ids = data.values_list(source, flat=True)
                else:
                    obj_ids = [data[0][source]]
                objects = {
                    obj.id: obj
                    for obj in value.model.objects.filter(
                        id__in=obj_ids
                    ).select_related()
                }
                prefetch_per_field[source] = objects

        # enhance entry dicts with model instances
        data = [
            self.AggregateObject(**{
                **entry,
                **{
                    field: objects[entry[field]]
                    for field, objects in prefetch_per_field.items()
                }
            })
            for entry in data
        ]

        if not many:
            data = data[0]

        return super().get_serializer(data, *args, **kwargs)
