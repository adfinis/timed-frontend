"""Serializers for the tracking app."""
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.utils.duration import duration_string
from django.utils.translation import ugettext_lazy as _
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import (CurrentUserDefault,
                                                 DurationField, IntegerField,
                                                 ModelSerializer,
                                                 SerializerMethodField,
                                                 ValidationError)

from timed.employment.models import AbsenceType, Employment, PublicHoliday
from timed.projects.models import Task
from timed.serializers import PkDictSerializer
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
            'date',
            'duration',
            'user',
            'task',
            'blocks',
        ]


class ActivityBlockSerializer(ModelSerializer):
    """Activity block serializer."""

    activity = ResourceRelatedField(queryset=models.Activity.objects.all())

    included_serializers = {
        'activity': 'timed.tracking.serializers.ActivitySerializer',
    }

    def validate(self, data):
        """Validate the activity block.

        Ensure that a user can only have one activity with an active block
        which doesn't end before it started.
        """
        instance = self.instance
        from_time = data.get('from_time', instance and instance.from_time)
        to_time = data.get('to_time', instance and instance.to_time)
        user = instance and instance.activity.user or data.get('activity').user

        # validate that there is only one active activity
        blocks = models.ActivityBlock.objects.filter(activity__user=user)
        if blocks.filter(to_time__isnull=True) and to_time is None:
            raise ValidationError(
                _('A user can only have one active activity')
            )

        # validate that to is not before from
        if to_time is not None and to_time < from_time:
            raise ValidationError(
                _('An activity block may not end before it starts.')
            )

        return data

    class Meta:
        """Meta information for the activity block serializer."""

        model  = models.ActivityBlock
        fields = [
            'activity',
            'from_time',
            'to_time',
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
            'date',
            'from_time',
            'to_time',
            'user',
        ]


class ReportByYearSerializer(PkDictSerializer):
    duration = DurationField(read_only=True)
    year = IntegerField(read_only=True)

    class Meta:
        resource_name = 'report-year'
        pk_key = 'year'


class ReportSerializer(ModelSerializer):
    """Report serializer."""

    task         = ResourceRelatedField(queryset=Task.objects.all())
    activity     = ResourceRelatedField(queryset=models.Activity.objects.all(),
                                        allow_null=True,
                                        required=False)
    user         = ResourceRelatedField(read_only=True,
                                        default=CurrentUserDefault())
    verified_by  = ResourceRelatedField(queryset=get_user_model().objects,
                                        required=False, allow_null=True)

    included_serializers = {
        'task': 'timed.projects.serializers.TaskSerializer',
        'user': 'timed.employment.serializers.UserSerializer',
        'verified_by': 'timed.employment.serializers.UserSerializer'
    }

    def validate_date(self, value):
        """Only owner is allowed to change date."""
        if self.instance is not None:
            user = self.context['request'].user
            owner = self.instance.user
            if self.instance.date != value and user != owner:
                raise ValidationError(_('Only owner may change date'))

        return value

    def validate_verified_by(self, value):
        user = self.context['request'].user
        current_verified_by = self.instance and self.instance.verified_by

        if value == current_verified_by:
            # no validation needed when nothing has changed
            return value

        if value is None and user.is_staff:
            # staff is allowed to reset verified by
            return value

        if value is not None and user.is_staff and value == user:
            # staff user is allowed to set it's own user as verified by
            return value

        raise ValidationError(_('Only staff user may verify reports.'))

    def validate_duration(self, value):
        """Only owner is allowed to change duration."""
        if self.instance is not None:
            user = self.context['request'].user
            owner = self.instance.user
            if self.instance.duration != value and user != owner:
                raise ValidationError(_('Only owner may change duration'))

        return value

    def get_root_meta(self, resource, many):
        """Add total hours over whole result (not just page) to meta."""
        if many:
            view = self.context['view']
            queryset = view.filter_queryset(view.get_queryset())
            data = queryset.aggregate(total_time=Sum('duration'))
            data['total_time'] = duration_string(
                data['total_time'] or timedelta(0)
            )
            return data
        return {}

    class Meta:
        """Meta information for the report serializer."""

        model  = models.Report
        fields = [
            'comment',
            'date',
            'duration',
            'review',
            'not_billable',
            'verified_by',
            'task',
            'activity',
            'user',
        ]


class AbsenceSerializer(ModelSerializer):
    """Absence serializer."""

    duration = SerializerMethodField(source='get_duration')
    type     = ResourceRelatedField(queryset=AbsenceType.objects.all())
    user     = ResourceRelatedField(read_only=True,
                                    default=CurrentUserDefault())

    included_serializers = {
        'user': 'timed.employment.serializers.UserSerializer',
    }

    def get_duration(self, instance):
        try:
            employment = Employment.objects.get_at(
                instance.user, instance.date
            )
        except Employment.DoesNotExist:
            # absence is invalid if no employment exists on absence date
            return duration_string(timedelta())

        return duration_string(instance.calculate_duration(employment))

    def validate(self, data):
        """Validate the absence data.

        An absence should not be created on a public holiday or a weekend.

        :returns: The validated data
        :rtype:   dict
        """
        try:
            location = Employment.objects.get_at(
                data.get('user'),
                data.get('date')
            ).location
        except Employment.DoesNotExist:
            raise ValidationError(
                _('You can\'t create an absence on an unemployed day.')
            )

        if PublicHoliday.objects.filter(
            location_id=location.id,
            date=data.get('date')
        ).exists():
            raise ValidationError(
                _('You can\'t create an absence on a public holiday')
            )

        workdays = [int(day) for day in location.workdays]
        if data.get('date').isoweekday() not in workdays:
            raise ValidationError(
                _('You can\'t create an absence on a weekend')
            )

        return data

    class Meta:
        """Meta information for the absence serializer."""

        model  = models.Absence
        fields = [
            'comment',
            'date',
            'duration',
            'type',
            'user',
        ]
