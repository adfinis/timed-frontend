"""Filters for filtering the data of the projects app endpoints."""
from datetime import date, timedelta

from django.db.models import Count
from django_filters import Filter, FilterSet

from timed.projects import models


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


class MyMostFrequentTaskFilter(Filter):
    """Filter most frequently used tasks."""

    def filter(self, qs, value):
        """Filter for given most frequently used tasks.

        Most frequently used tasks are only counted within last
        few months as older tasks are not relevant anymore
        for today's usage.

        :param QuerySet qs: The queryset to filter
        :param int   value: number of frequest items
        :return:            The filtered queryset
        :rtype:             QuerySet
        """
        user = self.parent.request.user
        from_date = date.today() - timedelta(days=60)

        qs = qs.filter(reports__user=user, reports__date__gt=from_date)
        qs = qs.annotate(frequency=Count('reports')).order_by('-frequency')
        qs = qs[:int(value)]

        return qs


class TaskFilterSet(FilterSet):
    """Filter set for the tasks endpoint."""

    my_most_frequent = MyMostFrequentTaskFilter()

    class Meta:
        """Meta information for the task filter set."""

        model  = models.Task
        fields = ['archived', 'project', 'my_most_frequent']
