"""Filters for filtering the data of the tracking app endpoints."""

from functools import wraps

from django_filters import DateFilter, Filter, FilterSet, NumberFilter

from timed.tracking import models


def boolean_filter(func):
    """Cast the passed query parameter into a boolean.

    :param function func: The function to decorate
    :return:              The function called with a boolean
    :rtype:               function
    """
    @wraps(func)
    def wrapper(self, qs, value):
        """Wrap the initial function.

        :param QuerySet qs: The queryset to filter
        :param str   value: The value to cast
        :return:            The original function
        :rtype:             function
        """
        value = value.lower() not in ('1', 'true', 'yes')

        return func(self, qs, value)

    return wrapper


class ActivityActiveFilter(Filter):
    """Filter to filter activities by being currently active or not.

    An activity is active, as soon as they have at least on activity
    block which does not have to_datetime.
    """

    @boolean_filter
    def filter(self, qs, value):
        """Filter the queryset.

        :param QuerySet qs: The queryset to filter
        :param bool  value: Whether the activities should be active
        :return:            The filtered queryset
        :rtype:             QuerySet
        """
        return qs.filter(
            blocks__isnull=False,
            blocks__to_datetime__exact=None
        ).distinct()


class ActivityFilterSet(FilterSet):
    """Filter set for the activities endpoint."""

    active = ActivityActiveFilter()
    day    = DateFilter(name='date')

    class Meta:
        """Meta information for the activity filter set."""

        model  = models.Activity
        fields = ['active', 'day']


class ActivityBlockFilterSet(FilterSet):
    """Filter set for the activity blocks endpoint."""

    class Meta:
        """Meta information for the activity block filter set."""

        model  = models.ActivityBlock
        fields = ['activity']


class AttendanceFilterSet(FilterSet):
    """Filter set for the attendance endpoint."""

    class Meta:
        """Meta information for the attendance filter set."""

        model  = models.Attendance
        fields = ['date']


class ReportFilterSet(FilterSet):
    """Filter set for the reports endpoint."""

    from_date    = DateFilter(name='date', lookup_expr='gte')
    to_date      = DateFilter(name='date', lookup_expr='lte')
    project      = NumberFilter(name='task__project')
    customer     = NumberFilter(name='task__project__customer')
    review       = NumberFilter(name='review')
    not_billable = NumberFilter(name='not_billable')
    not_verified = NumberFilter(name='verified_by', lookup_expr='isnull')
    reviewer     = NumberFilter(name='task__project__reviewers')
    billing_type = NumberFilter(name='task__project__billing_type')

    class Meta:
        """Meta information for the report filter set."""

        model  = models.Report
        fields = (
            'date',
            'from_date',
            'to_date',
            'user',
            'task',
            'project',
            'not_verified',
            'not_billable',
            'review',
            'reviewer',
            'billing_type'
        )


class AbsenceFilterSet(FilterSet):
    """Filter set for the absences endpoint."""

    from_date = DateFilter(name='date', lookup_expr='gte')
    to_date   = DateFilter(name='date', lookup_expr='lte')

    class Meta:
        """Meta information for the absence filter set."""

        model  = models.Absence
        fields = ['date', 'from_date', 'to_date']
