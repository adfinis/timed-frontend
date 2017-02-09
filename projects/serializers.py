"""Serializers for the projects app."""

from django.contrib.auth.models import User
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import ModelSerializer

from projects import models


class CustomerSerializer(ModelSerializer):
    """Customer serializer."""

    projects = ResourceRelatedField(read_only=True,
                                    many=True)

    included_serializers = {
        'projects': 'projects.serializers.ProjectSerializer'
    }

    class Meta:
        """Meta information for the customer serializer."""

        model  = models.Customer
        fields = [
            'name',
            'email',
            'website',
            'comment',
            'archived',
            'projects',
        ]


class ProjectSerializer(ModelSerializer):
    """Project serializer."""

    customer = ResourceRelatedField(queryset=models.Customer.objects.all())
    leaders  = ResourceRelatedField(queryset=User.objects.all(),
                                    required=False,
                                    many=True)
    tasks    = ResourceRelatedField(read_only=True,
                                    many=True)

    included_serializers = {
        'customer': 'projects.serializers.CustomerSerializer',
        'leaders':  'employment.serializers.UserSerializer',
        'tasks':    'projects.serializers.TaskSerializer'
    }

    class Meta:
        """Meta information for the project serializer."""

        model  = models.Project
        fields = [
            'name',
            'comment',
            'archived',
            'tracker_type',
            'tracker_name',
            'tracker_api_key',
            'customer',
            'leaders',
            'tasks',
        ]


class TaskSerializer(ModelSerializer):
    """Task serializer."""

    activities = ResourceRelatedField(read_only=True,
                                      many=True)
    project    = ResourceRelatedField(queryset=models.Project.objects.all())

    included_serializers = {
        'activities': 'tracking.serializers.ActivitySerializer',
        'project':    'projects.serializers.ProjectSerializer'
    }

    class Meta:
        """Meta information for the task serializer."""

        model  = models.Task
        fields = [
            'name',
            'estimated_hours',
            'archived',
            'project',
            'activities',
        ]
