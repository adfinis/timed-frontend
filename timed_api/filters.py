import datetime

from functools                  import wraps
from timed_api                  import models
from django_filters             import FilterSet, Filter
from django.contrib.auth.models import User


def boolean_filter(func):
    @wraps(func)
    def wrapper(self, qs, value):
        value = value.lower() not in ( '1', 'true', 'yes' )

        return func(self, qs, value)

    return wrapper


class DayFilter(Filter):
    def filter(self, qs, value):
        date = datetime.datetime.strptime(value, '%Y-%m-%d').date()

        return qs.filter(**{
            '%s__date' % self.name: date
        })


class ActivityActiveFilter(Filter):
    @boolean_filter
    def filter(self, qs, value):
        return qs.filter(
            blocks__isnull=False,
            blocks__to_datetime__exact=None
        ).distinct()


class UserFilterSet(FilterSet):
    class Meta:
        model = User
        fields = []


class ActivityFilterSet(FilterSet):
    active = ActivityActiveFilter()
    day    = DayFilter(name='start_datetime')

    class Meta:
        model  = models.Activity
        fields = ['active', 'day']


class ActivityBlockFilterSet(FilterSet):
    class Meta:
        model  = models.ActivityBlock
        fields = ['activity']


class AttendanceFilterSet(FilterSet):
    day = DayFilter(name='from_datetime')

    class Meta:
        model  = models.Attendance
        fields = ['day', 'user']


class ReportFilterSet(FilterSet):
    class Meta:
        model  = models.Report
        fields = ['user']


class CustomerFilterSet(FilterSet):
    class Meta:
        model  = models.Customer
        fields = ['archived']


class ProjectFilterSet(FilterSet):
    class Meta:
        model  = models.Project
        fields = ['archived', 'customer']


class TaskFilterSet(FilterSet):
    class Meta:
        model  = models.Task
        fields = ['archived', 'project']


class TaskTemplateFilterSet(FilterSet):
    class Meta:
        model  = models.TaskTemplate
        fields = []
