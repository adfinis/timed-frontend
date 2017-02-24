"""Serializers for the employment app."""

from django.contrib.auth import get_user_model
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import ModelSerializer

from timed.employment import models


class UserSerializer(ModelSerializer):
    """User serializer."""

    employments = ResourceRelatedField(many=True, read_only=True)

    included_serializers = {
        'employments': 'timed.employment.serializers.EmploymentSerializer'
    }

    class Meta:
        """Meta information for the user serializer."""

        model  = get_user_model()
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'employments',
        ]


class EmploymentSerializer(ModelSerializer):
    """Employment serializer."""

    user     = ResourceRelatedField(read_only=True)
    location = ResourceRelatedField(read_only=True)

    included_serializers = {
        'user': 'timed.employment.serializers.UserSerializer',
        'location': 'timed.employment.serializers.LocationSerializer'
    }

    class Meta:
        """Meta information for the employment serializer."""

        model = models.Employment
        fields = [
            'user',
            'location',
            'percentage',
            'worktime_per_day',
            'start_date',
            'end_date',
        ]


class LocationSerializer(ModelSerializer):
    """Location serializer."""

    class Meta:
        """Meta information for the location serializer."""

        model  = models.Location
        fields = ['name']


class PublicHolidaySerializer(ModelSerializer):
    """Public holiday serializer."""

    location = ResourceRelatedField(read_only=True)

    included_serializers = {
        'location': 'timed.employment.serializers.LocationSerializer'
    }

    class Meta:
        """Meta information for the public holiday serializer."""

        model  = models.PublicHoliday
        fields = [
            'name',
            'date',
            'location',
        ]
