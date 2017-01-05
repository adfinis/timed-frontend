"""Filters for filtering Timed API endpoint data."""

import datetime
from functools import wraps

from django.contrib.auth.models import User
from django_filters import Filter, FilterSet

from timed_api import models


def boolean_filter(func):
    """Decorator for casting the passed query parameter into a boolean.

    :param function func: The function to decorate
    :return:              The function called with a boolean
    :rtype:               function
    """
    @wraps(func)
    def wrapper(self, qs, value):
        """The wrapper.

        :param QuerySet qs: The queryset to filter
        :param str   value: The value to cast
        :return:            The original function
        :rtype:             function
        """
        value = value.lower() not in ('1', 'true', 'yes')

        return func(self, qs, value)

    return wrapper


class DayFilter(Filter):
    """Filter to filter a queryset by day."""

    def filter(self, qs, value):
        """Filter the queryset.

        :param QuerySet qs: The queryset to filter
        :param str   value: The day to filter to
        :return:            The filtered queryset
        :rtype:             QuerySet
        """
        date = datetime.datetime.strptime(value, '%Y-%m-%d').date()

        return qs.filter(**{
            '%s__date' % self.name: date
        })


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


class UserFilterSet(FilterSet):
    """Filter set for the users endpoint."""

    class Meta:
        """Meta information for the user filter set."""

        model = User
        fields = []


class ActivityFilterSet(FilterSet):
    """Filter set for the activities endpoint."""

    active = ActivityActiveFilter()
    day    = DayFilter(name='start_datetime')

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

    day = DayFilter(name='from_datetime')

    class Meta:
        """Meta information for the attendance filter set."""

        model  = models.Attendance
        fields = ['day', 'user']


class ReportFilterSet(FilterSet):
    """Filter set for the reports endpoint."""

    class Meta:
        """Meta information for the report filter set."""

        model  = models.Report
        fields = ['user']


class CustomerFilterSet(FilterSet):
    """Filter set for the customers endpoint."""

    class Meta:
        """Meta information for the customer filter set."""

        model  = models.Customer
        fields = ['archived']


class ProjectFilterSet(FilterSet):
    """Filter set for the projects endpoint."""

    class Meta:
        """Meta information for the project filter set."""

        model  = models.Project
        fields = ['archived', 'customer']


class TaskFilterSet(FilterSet):
    """Filter set for the tasks endpoint."""

    class Meta:
        """Meta information for the task filter set."""

        model  = models.Task
        fields = ['archived', 'project']


class TaskTemplateFilterSet(FilterSet):
    """Filter set for the task templates endpoint."""

    class Meta:
        """Meta information for the task template filter set."""

        model  = models.TaskTemplate
        fields = []
