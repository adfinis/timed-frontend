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
        queryset=User.objects.all(),
        allow_null=True,
        required=False
    )

    blocks = ResourceRelatedField(
        read_only=True,
        many=True,
    )

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
    activity = ResourceRelatedField(
        queryset=models.Activity.objects.all()
    )

    class Meta:
        model = models.ActivityBlock


class AttendanceSerializer(ModelSerializer):
    class Meta:
        model = models.Attendance


class ReportSerializer(ModelSerializer):
    task = ResourceRelatedField(
        queryset=models.Task.objects.all()
    )

    user = ResourceRelatedField(
        queryset=User.objects.all()
    )

    class Meta:
        model = models.Report


class CustomerSerializer(ModelSerializer):
    projects = ResourceRelatedField(
        queryset=models.Project.objects.all(),
        required=False,
        many=True
    )

    class Meta:
        model  = models.Customer


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
        queryset=models.Task.objects.all(),
        required=False,
        many=True
    )

    class Meta:
        model  = models.Project


class TaskSerializer(ModelSerializer):
    activities = ResourceRelatedField(
        queryset=models.Activity.objects.all(),
        many=True
    )

    project = ResourceRelatedField(
        queryset=models.Project.objects.all()
    )

    class Meta:
        model  = models.Task


class TaskTemplateSerializer(ModelSerializer):
    class Meta:
        model  = models.TaskTemplate


UserSerializer.included_serializers = {
    'projects': ProjectSerializer
}

ActivitySerializer.included_serializers = {
    'blocks': ActivityBlockSerializer,
    'task':   TaskSerializer,
    'user':   UserSerializer
}

ActivityBlockSerializer.included_serializers = {
    'activity': ActivitySerializer
}

ReportSerializer.included_serializers = {
    'task': TaskSerializer,
    'user': UserSerializer
}

CustomerSerializer.included_serializers = {
    'projects': ProjectSerializer
}

ProjectSerializer.included_serializers = {
    'customer': CustomerSerializer,
    'leaders':  UserSerializer,
    'tasks':    TaskSerializer
}

TaskSerializer.included_serializers = {
    'activities': ActivitySerializer,
    'project':    ProjectSerializer
}
