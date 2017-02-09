"""Serializers for the tracking app."""

from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import DurationField, ModelSerializer

from timed.projects.models import Task
from timed.tracking import models


class ActivitySerializer(ModelSerializer):
    """Activity serializer."""

    duration = DurationField(read_only=True)
    task     = ResourceRelatedField(queryset=Task.objects.all())
    user     = ResourceRelatedField(read_only=True)
    blocks   = ResourceRelatedField(read_only=True,
                                    many=True,)

    included_serializers = {
        'blocks': 'timed.tracking.serializers.ActivityBlockSerializer',
        'task':   'timed.projects.serializers.TaskSerializer',
        'user':   'timed.employment.serializers.UserSerializer'
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

    duration = DurationField(read_only=True)
    activity = ResourceRelatedField(queryset=models.Activity.objects.all())

    included_serializers = {
        'timed.activity': 'timed.tracking.serializers.ActivitySerializer'
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

    user = ResourceRelatedField(read_only=True)

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

    task = ResourceRelatedField(queryset=Task.objects.all(),
                                allow_null=True,
                                required=False)
    user = ResourceRelatedField(read_only=True)

    included_serializers = {
        'task': 'timed.projects.serializers.TaskSerializer',
        'user': 'timed.employment.serializers.UserSerializer'
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
