"""Serializers for the employment app."""

from datetime import date, datetime, timedelta

from dateutil import rrule
from django.contrib.auth import get_user_model
from django.utils.duration import duration_string
from rest_framework_json_api.relations import (ResourceRelatedField,  # noqa
                                               SerializerMethodResourceRelatedField) # noqa
from rest_framework_json_api.serializers import (ModelSerializer,
                                                 SerializerMethodField)

from timed.employment import models
from timed.tracking.models import Absence, Report


class UserSerializer(ModelSerializer):
    """User serializer."""

    employments      = ResourceRelatedField(many=True, read_only=True)
    worktime_balance = SerializerMethodField()

    user_absence_types = SerializerMethodResourceRelatedField(
        source='get_user_absence_types',
        model=models.UserAbsenceType,
        many=True,
        read_only=True
    )

    def get_user_absence_types(self, instance):
        """Get the user absence types for this user.

        :returns: All absence types for this user
        """
        return models.UserAbsenceType.objects.with_user(instance)

    def get_worktime(self, user, start=None, end=None):
        """Calculate the reported, expected and balance for user.

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

        :param user:       user to get worktime from
        :param start_date: worktime starting on  given day;
                           if not set when employment started resp. begining of
                           the year
        :param end_date:   worktime till day or if not set today
        :returns: tuple of 3 values reported, expected and balance in given
                  time frame
        """
        employment = models.Employment.objects.filter(
            user=user,
            end_date__isnull=True
        ).first()

        # If there is no active employment, set the balance to 0
        if employment is None:
            return timedelta(), timedelta(), timedelta()

        location = employment.location

        if start is None:
            start = max(
                employment.start_date, date(date.today().year, 1, 1)
            )

        end = end or date.today()

        # workdays is in isoweekday, byweekday expects Monday to be zero
        week_workdays = [int(day) - 1 for day in employment.location.workdays]
        workdays = rrule.rrule(
            rrule.DAILY,
            dtstart=start,
            until=end,
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
            date__gte=start,
            date__lte=end,
            date__week_day__in=workdays_db
        ).count()

        expected_worktime = employment.worktime_per_day * (workdays - holidays)

        overtime_credit = sum(
            models.OvertimeCredit.objects.filter(
                user=user,
                date__gte=start,
                date__lte=end
            ).values_list('duration', flat=True),
            timedelta()
        )

        reported_worktime = sum(
            Report.objects.filter(
                user=user,
                date__gte=start,
                date__lte=end
            ).values_list('duration', flat=True),
            timedelta()
        )

        absences = sum(
            Absence.objects.filter(
                user=user,
                date__gte=start,
                date__lte=end
            ).values_list('duration', flat=True),
            timedelta()
        )

        reported = reported_worktime + absences + overtime_credit

        return (reported, expected_worktime, reported - expected_worktime)

    def get_worktime_balance(self, instance):
        """Format the worktime balance.

        :return: The formatted worktime balance.
        :rtype:  str
        """
        request = self.context.get('request')
        until = request.query_params.get('until')
        end_date = until and datetime.strptime(until, '%Y-%m-%d').date()

        _, _, balance = self.get_worktime(instance, None, end_date)
        return duration_string(balance)

    included_serializers = {
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
            'worktime_balance',
            'is_staff',
            'user_absence_types',
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


class UserAbsenceTypeSerializer(ModelSerializer):
    """Absence type serializer for a user.

    This is only a simulated relation to the user to show the absence credits
    and balances.
    """

    credit        = SerializerMethodField()
    used_duration = SerializerMethodField()
    used_days     = SerializerMethodField()
    balance       = SerializerMethodField()

    absence_credits = SerializerMethodResourceRelatedField(
        source='get_absence_credits',
        model=models.AbsenceCredit,
        many=True,
        read_only=True
    )

    user = SerializerMethodResourceRelatedField(
        source='get_user',
        model=get_user_model(),
        read_only=True
    )

    def get_absence_credits(self, instance):
        """Get the absence credits for the user and type."""
        return models.AbsenceCredit.objects.filter(
            absence_type=instance,
            user_id=instance.user_id
        )

    def get_user(self, instance):
        """Get the user of this user absence type."""
        return get_user_model().objects.get(pk=instance.user_id)

    def get_dates(self, instance):
        """Get the start and end time for the credits.

        :returns: A tuple of dates
        """
        request = self.context.get('request')

        end = datetime.strptime(
            request.query_params.get(
                'until',
                date.today().strftime('%Y-%m-%d')
            ),
            '%Y-%m-%d'
        )

        user = get_user_model().objects.get(pk=instance.user_id)

        employment = models.Employment.objects.for_user(user, end)

        start = max(
            employment.start_date, date(date.today().year, 1, 1)
        )

        return (start, end)

    def get_credit(self, instance):
        """Calculate the total credited days.

        :return: The total credited days
        :rtype:  int
        """
        if instance.fill_worktime:
            return None

        start, end = self.get_dates(instance)

        return sum(models.AbsenceCredit.objects.filter(
            user_id=instance.user_id,
            absence_type=instance,
            date__gte=start,
            date__lte=end
        ).values_list('days', flat=True))

    def get_used_days(self, instance):
        """Calculate the total used days.

        :return: The total used days
        :rtype:  int
        """
        if instance.fill_worktime:
            return None

        start, end = self.get_dates(instance)

        return len(Absence.objects.filter(
            user_id=instance.user_id,
            type=instance,
            date__gte=start,
            date__lte=end
        ))

    def get_used_duration(self, instance):
        """Calculate the total used duration.

        This is only calculated for types which fill the worktime such as
        sickness.

        :return: The total used duration
        :rtype:  str
        """
        if not instance.fill_worktime:
            return None

        start, end = self.get_dates(instance)

        return duration_string(sum(Absence.objects.filter(
            user_id=instance.user_id,
            type=instance,
            date__gte=start,
            date__lte=end
        ).values_list('duration', flat=True), timedelta()))

    def get_balance(self, instance):
        """Calculate the balance of credited and used days.

        :return: The balance
        :rtype:  int
        """
        credit = self.get_credit(instance)

        if instance.fill_worktime or credit is None:
            return None

        return credit - self.get_used_days(instance)

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

    absence_type = ResourceRelatedField(read_only=True)
    user         = ResourceRelatedField(read_only=True)

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
