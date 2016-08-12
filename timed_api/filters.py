import datetime

from functools                  import wraps
from timed_api                  import models
from django_filters             import FilterSet, Filter
from django.contrib.auth.models import User


def boolean_filter(func):
    @wraps(func)
    def wrapper(self, qs, value):
        if value.lower() not in ( '1', 'true', 'yes' ):
            return qs

        return func(self, qs, value)

    return wrapper


class TodayFilter(Filter):
    @boolean_filter
    def filter(self, qs, value):
        return qs.filter(**{
            '%s__date' % self.name: datetime.date.today()
        })


class ActivityActiveFilter(Filter):
    @boolean_filter
    def filter(self, qs, value):
        return qs.filter(blocks__to_datetime__exact=None)


class UserFilterSet(FilterSet):
    class Meta:
        model  = User


class ActivityFilterSet(FilterSet):
    active = ActivityActiveFilter()
    today  = TodayFilter(name='start_datetime')

    class Meta:
        model  = models.Activity


class ActivityBlockFilterSet(FilterSet):
    class Meta:
        model  = models.ActivityBlock


class AttendanceFilterSet(FilterSet):
    class Meta:
        model  = models.Attendance


class ReportFilterSet(FilterSet):
    class Meta:
        model  = models.Report


class CustomerFilterSet(FilterSet):
    class Meta:
        model  = models.Customer


class ProjectFilterSet(FilterSet):
    class Meta:
        model  = models.Project


class TaskFilterSet(FilterSet):
    class Meta:
        model  = models.Task


class TaskTemplateFilterSet(FilterSet):
    class Meta:
        model  = models.TaskTemplate
