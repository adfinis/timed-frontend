"""Serializers for the Timed API."""

from django.contrib.auth.models import User
from rest_framework_json_api import serializers
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import ModelSerializer

from timed_api import models


class UserSerializer(ModelSerializer):
    """User serializer."""

    projects = ResourceRelatedField(
        read_only=True,
        many=True
    )

    attendances = ResourceRelatedField(
        read_only=True,
        many=True
    )

    activities = ResourceRelatedField(
        read_only=True,
        many=True
    )

    reports = ResourceRelatedField(
        read_only=True,
        many=True
    )

    included_serializers = {
        'projects': 'timed_api.serializers.ProjectSerializer'
    }

    class Meta:
        """Meta information for the user serializer."""

        model  = User
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


class ActivitySerializer(ModelSerializer):
    """Activity serializer."""

    duration = serializers.DurationField(read_only=True)

    task = ResourceRelatedField(
        queryset=models.Task.objects.all()
    )

    user = ResourceRelatedField(
        read_only=True
    )

    blocks = ResourceRelatedField(
        read_only=True,
        many=True,
    )

    included_serializers = {
        'blocks': 'timed_api.serializers.ActivityBlockSerializer',
        'task':   'timed_api.serializers.TaskSerializer',
        'user':   'timed_api.serializers.UserSerializer'
    }

    class Meta:
        """Meta information for the activity serializer."""

        model  = models.Activity
        fields = [
            'comment',
            'start_datetime',
            'duration',
            'task',
            'user',
            'blocks',
        ]


class ActivityBlockSerializer(ModelSerializer):
    """Activity block serializer."""

    duration = serializers.DurationField(read_only=True)

    activity = ResourceRelatedField(
        queryset=models.Activity.objects.all()
    )

    included_serializers = {
        'activity': 'timed_api.serializers.ActivitySerializer'
    }

    class Meta:
        """Meta information for the activity block serializer."""

        model  = models.ActivityBlock
        fields = [
            'activity',
            'duration',
            'from_datetime',
            'to_datetime',
        ]


class AttendanceSerializer(ModelSerializer):
    """Attendance serializer."""

    user = ResourceRelatedField(
        read_only=True
    )

    class Meta:
        """Meta information for the attendance serializer."""

        model  = models.Attendance
        fields = [
            'from_datetime',
            'to_datetime',
            'user',
        ]


class ReportSerializer(ModelSerializer):
    """Report serializer."""

    task = ResourceRelatedField(
        queryset=models.Task.objects.all(),
        allow_null=True,
        required=False
    )

    user = ResourceRelatedField(
        read_only=True
    )

    included_serializers = {
        'task': 'timed_api.serializers.TaskSerializer',
        'user': 'timed_api.serializers.UserSerializer'
    }

    class Meta:
        """Meta information for the report serializer."""

        model  = models.Report
        fields = [
            'comment',
            'duration',
            'review',
            'nta',
            'task',
            'user',
        ]


class CustomerSerializer(ModelSerializer):
    """Customer serializer."""

    projects = ResourceRelatedField(
        read_only=True,
        many=True
    )

    included_serializers = {
        'projects': 'timed_api.serializers.ProjectSerializer'
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

    customer = ResourceRelatedField(
        queryset=models.Customer.objects.all()
    )

    leaders = ResourceRelatedField(
        queryset=User.objects.all(),
        required=False,
        many=True
    )

    tasks = ResourceRelatedField(
        read_only=True,
        many=True
    )

    included_serializers = {
        'customer': 'timed_api.serializers.CustomerSerializer',
        'leaders':  'timed_api.serializers.UserSerializer',
        'tasks':    'timed_api.serializers.TaskSerializer'
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

    activities = ResourceRelatedField(
        read_only=True,
        many=True
    )

    project = ResourceRelatedField(
        queryset=models.Project.objects.all()
    )

    included_serializers = {
        'activities': 'timed_api.serializers.ActivitySerializer',
        'project':    'timed_api.serializers.ProjectSerializer'
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


class TaskTemplateSerializer(ModelSerializer):
    """Task template serializer."""

    class Meta:
        """Meta information for the task template serializer."""

        model  = models.TaskTemplate
        fields = [
            'name',
        ]
