"""Serializers for the tracking app."""
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import BooleanField, Case, When
from django.utils.duration import duration_string
from django.utils.translation import ugettext_lazy as _
from rest_framework_json_api import relations
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import (CurrentUserDefault,
                                                 DurationField,
                                                 ModelSerializer, Serializer,
                                                 SerializerMethodField,
                                                 ValidationError)

from timed.employment.models import AbsenceType, Employment, PublicHoliday
from timed.projects.models import Customer, Project, Task
from timed.serializers import TotalTimeRootMetaMixin
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


class ReportSerializer(TotalTimeRootMetaMixin, ModelSerializer):
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


class ReportIntersectionSerializer(Serializer):
    """
    Serializer of report intersections.

    Serializes a representation of all fields which are the same
    in given Report objects. If values of one field are not the same
    in all objects it will be represented as None.

    Serializer expect instance to have a queryset value.
    """

    customer = relations.SerializerMethodResourceRelatedField(
        source='get_customer',
        model=Customer,
        read_only=True
    )
    project = relations.SerializerMethodResourceRelatedField(
        source='get_project',
        model=Project,
        read_only=True
    )
    task = relations.SerializerMethodResourceRelatedField(
        source='get_task',
        model=Task,
        read_only=True
    )
    comment = SerializerMethodField()
    review = SerializerMethodField()
    not_billable = SerializerMethodField()
    not_verified = SerializerMethodField()

    def _intersection(self, instance, field, model=None):
        """Get intersection of given field.

        :return: Returns value of field if objects have same value;
                 otherwise None
        """
        value = None
        queryset = instance['queryset']
        values = queryset.values(field).distinct()
        if values.count() == 1:
            value = values.first()[field]
            if model:
                value = model.objects.get(pk=value)

        return value

    def get_customer(self, instance):
        return self._intersection(
            instance, 'task__project__customer', Customer
        )

    def get_project(self, instance):
        return self._intersection(instance, 'task__project', Project)

    def get_task(self, instance):
        return self._intersection(instance, 'task', Task)

    def get_comment(self, instance):
        return self._intersection(instance, 'comment')

    def get_review(self, instance):
        return self._intersection(instance, 'review')

    def get_not_billable(self, instance):
        return self._intersection(instance, 'not_billable')

    def get_not_verified(self, instance):
        queryset = instance['queryset']
        queryset = queryset.annotate(
            not_verified=Case(
                When(verified_by_id__isnull=True, then=True),
                default=False,
                output_field=BooleanField()
            )
        )
        instance['queryset'] = queryset
        return self._intersection(instance, 'not_verified')

    included_serializers = {
        'customer': 'timed.projects.serializers.CustomerSerializer',
        'project': 'timed.projects.serializers.ProjectSerializer',
        'task': 'timed.projects.serializers.TaskSerializer',
    }

    class Meta:
        resource_name = 'report-intersections'


class AbsenceSerializer(ModelSerializer):
    """Absence serializer."""

    duration = SerializerMethodField(source='get_duration')
    type     = ResourceRelatedField(queryset=AbsenceType.objects.all())
    user     = ResourceRelatedField(read_only=True,
                                    default=CurrentUserDefault())

    included_serializers = {
        'user': 'timed.employment.serializers.UserSerializer',
        'type': 'timed.employment.serializers.AbsenceTypeSerializer',
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

    def validate_date(self, value):
        """Only owner is allowed to change date."""
        if self.instance is not None:
            user = self.context['request'].user
            owner = self.instance.user
            if self.instance.date != value and user != owner:
                raise ValidationError(_('Only owner may change date'))

        return value

    def validate_type(self, value):
        """Only owner is allowed to change type."""
        if self.instance is not None:
            user = self.context['request'].user
            owner = self.instance.user
            if self.instance.date != value and user != owner:
                raise ValidationError(_('Only owner may change absence type'))

        return value

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
