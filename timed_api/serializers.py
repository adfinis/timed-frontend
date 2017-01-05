from timed_api                           import models
from django.contrib.auth.models          import User
from rest_framework_json_api             import serializers
from rest_framework_json_api.relations   import ResourceRelatedField
from rest_framework_json_api.serializers import ModelSerializer


class UserSerializer(ModelSerializer):
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
    duration = serializers.DurationField(read_only=True)

    activity = ResourceRelatedField(
        queryset=models.Activity.objects.all()
    )

    included_serializers = {
        'activity': 'timed_api.serializers.ActivitySerializer'
    }

    class Meta:
        model  = models.ActivityBlock
        fields = [
            'activity',
            'duration',
            'from_datetime',
            'to_datetime',
        ]


class AttendanceSerializer(ModelSerializer):
    user = ResourceRelatedField(
        read_only=True
    )

    class Meta:
        model  = models.Attendance
        fields = [
            'from_datetime',
            'to_datetime',
            'user',
        ]


class ReportSerializer(ModelSerializer):
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
    projects = ResourceRelatedField(
        read_only=True,
        many=True
    )

    included_serializers = {
        'projects': 'timed_api.serializers.ProjectSerializer'
    }

    class Meta:
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
        model  = models.Task
        fields = [
            'name',
            'estimated_hours',
            'archived',
            'project',
            'activities',
        ]


class TaskTemplateSerializer(ModelSerializer):
    class Meta:
        model  = models.TaskTemplate
        fields = [
            'name',
        ]
