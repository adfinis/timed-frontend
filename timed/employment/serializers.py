"""Serializers for the employment app."""

from datetime import date, datetime, timedelta

from django.contrib.auth import get_user_model
from django.utils.duration import duration_string
from rest_framework.exceptions import PermissionDenied
from rest_framework_json_api import relations, serializers
from rest_framework_json_api.serializers import (IntegerField, ModelSerializer,
                                                 Serializer,
                                                 SerializerMethodField)

from timed.employment import models
from timed.tracking.models import Absence


class UserSerializer(ModelSerializer):
    """User serializer."""

    employments        = relations.ResourceRelatedField(many=True,
                                                        read_only=True)
    user_absence_types = relations.SerializerMethodResourceRelatedField(
        source='get_user_absence_types',
        model=models.UserAbsenceType,
        many=True,
        read_only=True
    )

    def get_user_absence_types(self, instance):
        """Get the user absence types for this user.

        :returns: All absence types for this user
        """
        request = self.context.get('request')
        until = request and request.query_params.get('until')

        end = datetime.strptime(
            until or date.today().strftime('%Y-%m-%d'),
            '%Y-%m-%d'
        ).date()
        start = date(end.year, 1, 1)

        return models.UserAbsenceType.objects.with_user(instance,
                                                        start,
                                                        end)

    def validate(self, data):
        user = self.context['request'].user

        # users may only change their own profile
        if self.instance.id != user.id:
            raise PermissionDenied()

        return data

    included_serializers = {
        'supervisors':
            'timed.employment.serializers.UserSerializer',
        'supervisees':
            'timed.employment.serializers.UserSerializer',
        'employments':
            'timed.employment.serializers.EmploymentSerializer',
        'user_absence_types':
            'timed.employment.serializers.UserAbsenceTypeSerializer'
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
            'is_staff',
            'is_superuser',
            'is_active',
            'user_absence_types',
            'tour_done',
            'supervisors',
            'supervisees'
        ]
        read_only_fields = [
            'username',
            'first_name',
            'last_name',
            'is_staff',
            'is_active',
            'supervisors',
            'supervisees'
        ]


class WorktimeBalanceSerializer(Serializer):
    date    = serializers.DateField()
    balance = SerializerMethodField()
    user    = relations.ResourceRelatedField(
        model=get_user_model(), read_only=True, source='id'
    )

    def get_balance(self, instance):
        start = date(instance.date.year, 1, 1)

        # id is mapped to user instance
        _, _, balance = instance.id.calculate_worktime(start, instance.date)
        return duration_string(balance)

    class Meta:
        resource_name = 'worktime-balances'


class EmploymentSerializer(ModelSerializer):
    """Employment serializer."""

    user     = relations.ResourceRelatedField(read_only=True)
    location = relations.ResourceRelatedField(read_only=True)

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
        fields = ['name', 'workdays']


class PublicHolidaySerializer(ModelSerializer):
    """Public holiday serializer."""

    location = relations.ResourceRelatedField(read_only=True)

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


class UserAbsenceTypeSerializer(ModelSerializer):
    """Absence type serializer for a user.

    This is only a simulated relation to the user to show the absence credits
    and balances.
    """

    credit          = IntegerField()
    used_days       = IntegerField()
    used_duration   = SerializerMethodField(source='get_used_duration')
    balance         = IntegerField()

    user            = relations.SerializerMethodResourceRelatedField(
        source='get_user',
        model=get_user_model(),
        read_only=True
    )

    absence_credits = relations.SerializerMethodResourceRelatedField(
        source='get_absence_credits',
        model=models.AbsenceCredit,
        many=True,
        read_only=True
    )

    def get_user(self, instance):
        return get_user_model().objects.get(pk=instance.user_id)

    def get_used_duration(self, instance):
        # only calculate worktime if it fills up day
        if not instance.fill_worktime:
            return None

        absences = sum([
            absence.calculate_duration(
                models.Employment.objects.get_at(
                    instance.user_id, absence.date
                )
            )
            for absence in Absence.objects.filter(
                user=instance.user_id,
                date__gte=instance.start_date,
                date__lte=instance.end_date,
                type_id=instance.id
            )
        ], timedelta())
        return duration_string(absences)

    def get_absence_credits(self, instance):
        """Get the absence credits for the user and type."""
        return models.AbsenceCredit.objects.filter(
            absence_type=instance,
            user__id=instance.user_id,
            date__gte=instance.start_date,
            date__lte=instance.end_date
        )

    included_serializers = {
        'absence_credits':
            'timed.employment.serializers.AbsenceCreditSerializer',
    }

    class Meta:
        """Meta information for the absence type serializer."""

        model  = models.UserAbsenceType
        fields = [
            'name',
            'fill_worktime',
            'credit',
            'used_duration',
            'used_days',
            'balance',
            'absence_credits',
            'user',
        ]


class AbsenceTypeSerializer(ModelSerializer):
    """Absence type serializer."""

    class Meta:
        """Meta information for the absence type serializer."""

        model  = models.AbsenceType
        fields = [
            'name',
            'fill_worktime',
        ]


class AbsenceCreditSerializer(ModelSerializer):
    """Absence credit serializer."""

    included_serializers = {
        'absence_type': 'timed.employment.serializers.AbsenceTypeSerializer'
    }

    class Meta:
        """Meta information for the absence credit serializer."""

        model  = models.AbsenceCredit
        fields = [
            'user',
            'absence_type',
            'date',
            'days',
            'comment',
        ]


class OvertimeCreditSerializer(ModelSerializer):
    class Meta:
        model  = models.OvertimeCredit
        fields = [
            'user',
            'date',
            'duration'
        ]
