"""Serializers for the employment app."""

from datetime import date, datetime, timedelta

from dateutil import rrule
from django.contrib.auth import get_user_model
from django.utils.duration import duration_string
from rest_framework_json_api.relations import ResourceRelatedField
from rest_framework_json_api.serializers import (ModelSerializer,
                                                 SerializerMethodField)

from timed.employment import models
from timed.tracking.models import Absence, Report


class UserSerializer(ModelSerializer):
    """User serializer."""

    employments      = ResourceRelatedField(many=True, read_only=True)
    absence_credits  = ResourceRelatedField(many=True, read_only=True)
    worktime_balance = SerializerMethodField()

    def get_worktime_balance_raw(self, instance):
        """Calculate the worktime balance for the user.

        1.  Determine the current employment of the user
        2.  Take the latest of those two as start date:
             * The start of the year
             * The start of the current employment
        3.  Take the delivered date if given or the current date as end date
        4.  Determine the count of workdays within start and end date
        5.  Determine the count of public holidays within start and end date
        6.  The expected worktime consists of following elements:
             * Workdays
             * Subtracted by holidays
             * Multiplicated with the worktime per day of the employment
        7.  Determine the overtime credit duration within start and end date
        8.  The reported worktime is the sum of the durations of all reports
            for this user within start and end date
        9.  The absences are all absences for this user between the start and
            end time
        10. The balance is the reported time plus the absences plus the
            overtime credit minus the expected worktime

        :returns: The worktime balance of the user
        :rtype:   datetime.timedelta
        """
        employment = models.Employment.objects.get(
            user=instance,
            end_date__isnull=True
        )
        location = employment.location

        request            = self.context.get('request')
        requested_end_date = request.query_params.get('until')

        start_date = max(employment.start_date, date(date.today().year, 1, 1))
        end_date   = (
            datetime.strptime(requested_end_date, '%Y-%m-%d').date()
            if requested_end_date
            else date.today()
        )

        # workdays is in isoweekday, byweekday expects Monday to be zero
        week_workdays = [int(day) - 1 for day in employment.location.workdays]
        workdays = rrule.rrule(
            rrule.DAILY,
            dtstart=start_date,
            until=end_date,
            byweekday=week_workdays
        ).count()

        # converting workdays as db expects 1 (Sunday) to 7 (Saturday)
        workdays_db = [
            # special case for Sunday
            int(day) == 7 and 1 or int(day) + 1
            for day in location.workdays
        ]
        holidays = models.PublicHoliday.objects.filter(
            location=location,
            date__gte=start_date,
            date__lte=end_date,
            date__week_day__in=workdays_db
        ).count()

        expected_worktime = employment.worktime_per_day * (workdays - holidays)

        overtime_credit = sum(
            models.OvertimeCredit.objects.filter(
                user=instance,
                date__gte=start_date,
                date__lte=end_date
            ).values_list('duration', flat=True),
            timedelta()
        )

        reported_worktime = sum(
            Report.objects.filter(
                user=instance,
                date__gte=start_date,
                date__lte=end_date
            ).values_list('duration', flat=True),
            timedelta()
        )

        absences = sum(
            Absence.objects.filter(
                user=instance,
                date__gte=start_date,
                date__lte=end_date
            ).values_list('duration', flat=True),
            timedelta()
        )

        return (
            reported_worktime +
            absences +
            overtime_credit -
            expected_worktime
        )

    def get_worktime_balance(self, instance):
        """Format the worktime balance.

        :return: The formatted worktime balance.
        :rtype:  str
        """
        worktime_balance = self.get_worktime_balance_raw(instance)

        return duration_string(worktime_balance)

    included_serializers = {
        'employments':
            'timed.employment.serializers.EmploymentSerializer',
        'absence_credits':
            'timed.employment.serializers.AbsenceCreditSerializer'
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
            'absence_credits',
            'worktime_balance',
        ]


class EmploymentSerializer(ModelSerializer):
    """Employment serializer."""

    user     = ResourceRelatedField(read_only=True)
    location = ResourceRelatedField(read_only=True)

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

    location = ResourceRelatedField(read_only=True)

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


class AbsenceTypeSerializer(ModelSerializer):
    """Absence type serializer."""

    class Meta:
        """Meta information for the absence type serializer."""

        model  = models.AbsenceType
        fields = ['name', 'fill_worktime']


class AbsenceCreditSerializer(ModelSerializer):
    """Absence credit serializer."""

    absence_type = ResourceRelatedField(read_only=True)
    user         = ResourceRelatedField(read_only=True)
    used         = SerializerMethodField()
    balance      = SerializerMethodField()

    def get_used_raw(self, instance):
        """Calculate the total of used time since the date of the requested credit.

        This is the sum of all durations of reports, which are assigned to the
        credits user, absence type and were created at or after the date of
        this credit.

        :return: The total of used time
        :rtype:  datetime.timedelta
        """
        request            = self.context.get('request')
        requested_end_date = request.query_params.get('until')

        end_date = (
            datetime.strptime(requested_end_date, '%Y-%m-%d').date()
            if requested_end_date
            else date.today()
        )

        reports = Absence.objects.filter(
            user=instance.user,
            type=instance.absence_type,
            date__gte=instance.date,
            date__lte=end_date
        ).values_list('duration', flat=True)

        return sum(reports, timedelta())

    def get_balance_raw(self, instance):
        """Calculate the balance of the requested credit.

        This is the difference between the credits duration and the total used
        time.

        :return: The balance
        :rtype:  datetime.timedelta
        """
        return (
            instance.duration - self.get_used_raw(instance)
            if instance.duration
            else None
        )

    def get_used(self, instance):
        """Format the total of used time.

        :return: The formatted total of used time
        :rtype:  str
        """
        used = self.get_used_raw(instance)

        return duration_string(used)

    def get_balance(self, instance):
        """Format the balance.

        This is None if we don't have a duration.

        :return: The formatted balance
        :rtype:  str or None
        """
        balance = self.get_balance_raw(instance)

        return duration_string(balance) if balance else None

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
            'duration',
            'used',
            'balance',
        ]


class OvertimeCreditSerializer(ModelSerializer):
    """Overtime credit serializer."""

    user = ResourceRelatedField(read_only=True)

    class Meta:
        """Meta information for the overtime credit serializer."""

        model  = models.OvertimeCredit
        fields = [
            'user',
            'date',
            'duration'
        ]
