"""Serializers for the tracking app."""

from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import (CurrentUserDefault,
                                                 DurationField,
                                                 ModelSerializer,
                                                 ValidationError)

from timed.employment.models import AbsenceType, Employment, PublicHoliday
from timed.projects.models import Task
from timed.tracking import models


class ActivitySerializer(ModelSerializer):
    """Activity serializer."""

    duration = DurationField(read_only=True)
    user     = ResourceRelatedField(read_only=True,
                                    default=CurrentUserDefault())
    task     = ResourceRelatedField(queryset=Task.objects.all(),
                                    allow_null=True,
                                    required=False)
    blocks   = ResourceRelatedField(read_only=True, many=True)

    included_serializers = {
        'blocks': 'timed.tracking.serializers.ActivityBlockSerializer',
        'task':   'timed.projects.serializers.TaskSerializer',
        'user': 'timed.employment.serializers.UserSerializer',
    }

    class Meta:
        """Meta information for the activity serializer."""

        model  = models.Activity
        fields = [
            'comment',
            'start_datetime',
            'duration',
            'user',
            'task',
            'blocks',
        ]


class ActivityBlockSerializer(ModelSerializer):
    """Activity block serializer."""

    duration = DurationField(read_only=True)
    activity = ResourceRelatedField(queryset=models.Activity.objects.all())

    included_serializers = {
        'activity': 'timed.tracking.serializers.ActivitySerializer',
    }

    def validate(self, data):
        """Validate the activity block.

        Ensure that a user can only have one activity with an active block.
        """
        if self.instance:
            user = self.instance.activity.user
            to_datetime = data.get('to_datetime', self.instance.to_datetime)
        else:
            user = data.get('activity').user
            to_datetime = data.get('to_datetime', None)

        blocks = models.ActivityBlock.objects.filter(activity__user=user)

        if (
            blocks.filter(to_datetime__isnull=True) and
            to_datetime is None
        ):
            raise ValidationError('A user can only have one active activity')

        return data

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

    user = ResourceRelatedField(read_only=True, default=CurrentUserDefault())

    included_serializers = {
        'user': 'timed.employment.serializers.UserSerializer',
    }

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

    task         = ResourceRelatedField(queryset=Task.objects.all())
    activity     = ResourceRelatedField(queryset=models.Activity.objects.all(),
                                        allow_null=True,
                                        required=False)
    user         = ResourceRelatedField(read_only=True,
                                        default=CurrentUserDefault())

    included_serializers = {
        'task': 'timed.projects.serializers.TaskSerializer',
        'user': 'timed.employment.serializers.UserSerializer'
    }

    class Meta:
        """Meta information for the report serializer."""

        model  = models.Report
        fields = [
            'comment',
            'date',
            'duration',
            'review',
            'not_billable',
            'task',
            'activity',
            'user',
        ]


class AbsenceSerializer(ModelSerializer):
    """Absence serializer."""

    duration = DurationField(read_only=True)
    type     = ResourceRelatedField(queryset=AbsenceType.objects.all())
    user     = ResourceRelatedField(read_only=True,
                                    default=CurrentUserDefault())

    included_serializers = {
        'user': 'timed.employment.serializers.UserSerializer',
    }

    def validate(self, data):
        """Validate the absence data.

        An absence should not be created on a public holiday or a weekend.

        :returns: The validated data
        :rtype:   dict
        """
        location = Employment.objects.for_user(
            data.get('user'),
            data.get('date')
        ).location

        if PublicHoliday.objects.filter(
            location_id=location.id,
            date=data.get('date')
        ).exists():
            raise ValidationError(
                'You can\'t create an absence on a public holiday'
            )

        workdays = [int(day) for day in location.workdays]
        if data.get('date').isoweekday() not in workdays:
            raise ValidationError('You can\'t create an absence on a weekend')

        return data

    class Meta:
        """Meta information for the absence serializer."""

        model  = models.Absence
        fields = [
            'date',
            'duration',
            'type',
            'user',
        ]
