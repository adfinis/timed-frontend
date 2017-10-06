from collections import OrderedDict

from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.utils import get_resource_type_from_model


class IdResourceRelatedField(ResourceRelatedField):
    """
    Resource related field whereas resource is represented by id only.

    As value doesn't represent what model it is from `model` needs to
    be defined as kwarg.
    """

    def to_representation(self, value):
        # TODO wrap value into a object with value as pk
        # and add model class to meta on the fly
        # This way it would be possible to call super to_representation
        # with all its functionality.
        resource_type = get_resource_type_from_model(self.model)
        return OrderedDict([('type', resource_type), ('id', str(value))])
