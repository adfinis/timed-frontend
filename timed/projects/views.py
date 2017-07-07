"""Viewsets for the projects app."""

from django.db.models import Sum
from rest_framework.viewsets import ReadOnlyModelViewSet

from timed.projects import filters, models, serializers


class CustomerViewSet(ReadOnlyModelViewSet):
    """Customer view set."""

    serializer_class = serializers.CustomerSerializer
    filter_class     = filters.CustomerFilterSet
    ordering         = 'name'

    def get_queryset(self):
        """Prefetch related data.

        :return: The customers
        :rtype:  QuerySet
        """
        return models.Customer.objects.prefetch_related(
            'projects'
        )


class BillingTypeViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.BillingTypeSerializer
    ordering         = 'name'

    def get_queryset(self):
        return models.BillingType.objects.all()


class ProjectViewSet(ReadOnlyModelViewSet):
    """Project view set."""

    serializer_class = serializers.ProjectSerializer
    filter_class     = filters.ProjectFilterSet
    ordering         = 'name'

    def get_queryset(self):
        """Prefetch related data.

        :return: The projects
        :rtype:  QuerySet
        """
        return models.Project.objects.select_related(
            'customer'
        ).annotate(
            spent_hours=Sum('customer__projects__tasks__reports__duration')
        )


class TaskViewSet(ReadOnlyModelViewSet):
    """Task view set."""

    serializer_class = serializers.TaskSerializer
    filter_class     = filters.TaskFilterSet
    ordering         = 'name'

    def get_queryset(self):
        """Prefetch related data.

        :return: The tasks
        :rtype:  QuerySet
        """
        return models.Task.objects.select_related(
            'project'
        )

    def filter_queryset(self, queryset):
        """Specific filter queryset options."""
        # my most frequent filter uses LIMIT so default ordering
        # needs to be disabled to avoid exception
        # see TODO filters.MyMostFrequentTaskFilter to avoid this
        if 'my_most_frequent' in self.request.query_params:
            self.ordering = None

        return super().filter_queryset(queryset)
