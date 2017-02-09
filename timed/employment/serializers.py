"""Serializers for the employment app."""

from django.contrib.auth import get_user_model
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import ModelSerializer


class UserSerializer(ModelSerializer):
    """User serializer."""

    projects    = ResourceRelatedField(read_only=True,
                                       many=True)
    attendances = ResourceRelatedField(read_only=True,
                                       many=True)
    activities  = ResourceRelatedField(read_only=True,
                                       many=True)
    reports     = ResourceRelatedField(read_only=True,
                                       many=True)

    included_serializers = {
        'projects': 'timed.projects.serializers.ProjectSerializer'
    }

    class Meta:
        """Meta information for the user serializer."""

        model  = get_user_model()
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'projects',
            'attendances',
            'activities',
            'reports',
        ]
