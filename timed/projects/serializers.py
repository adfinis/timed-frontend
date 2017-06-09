"""Serializers for the projects app."""

from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import ModelSerializer

from timed.projects import models


class CustomerSerializer(ModelSerializer):
    """Customer serializer."""

    class Meta:
        """Meta information for the customer serializer."""

        model  = models.Customer
        fields = [
            'name',
            'email',
            'website',
            'comment',
            'archived',
        ]


class ProjectSerializer(ModelSerializer):
    """Project serializer."""

    customer = ResourceRelatedField(queryset=models.Customer.objects.all())

    included_serializers = {
        'customer': 'timed.projects.serializers.CustomerSerializer'
    }

    class Meta:
        """Meta information for the project serializer."""

        model  = models.Project
        fields = [
            'name',
            'comment',
            'estimated_hours',
            'archived',
            'customer',
        ]


class TaskSerializer(ModelSerializer):
    """Task serializer."""

    project = ResourceRelatedField(queryset=models.Project.objects.all())

    included_serializers = {
        'activities': 'timed.tracking.serializers.ActivitySerializer',
        'project':    'timed.projects.serializers.ProjectSerializer'
    }

    class Meta:
        """Meta information for the task serializer."""

        model  = models.Task
        fields = [
            'name',
            'estimated_hours',
            'archived',
            'project',
        ]
