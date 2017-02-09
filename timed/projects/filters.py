"""Filters for filtering the data of the projects app endpoints."""

from django_filters import FilterSet

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


class TaskFilterSet(FilterSet):
    """Filter set for the tasks endpoint."""

    class Meta:
        """Meta information for the task filter set."""

        model  = models.Task
        fields = ['archived', 'project']
