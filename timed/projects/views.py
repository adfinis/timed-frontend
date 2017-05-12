"""Viewsets for the projects app."""

from rest_framework.viewsets import ReadOnlyModelViewSet

from timed.projects import filters, models, serializers


class CustomerViewSet(ReadOnlyModelViewSet):
    """Customer view set."""

    queryset         = models.Customer.objects.filter(archived=False)
    serializer_class = serializers.CustomerSerializer
    filter_class     = filters.CustomerFilterSet
    search_fields    = ('name',)
    ordering         = 'name'


class ProjectViewSet(ReadOnlyModelViewSet):
    """Project view set."""

    queryset         = models.Project.objects.filter(archived=False)
    serializer_class = serializers.ProjectSerializer
    filter_class     = filters.ProjectFilterSet
    ordering         = 'name'


class TaskViewSet(ReadOnlyModelViewSet):
    """Task view set."""

    queryset         = models.Task.objects.filter(archived=False)
    serializer_class = serializers.TaskSerializer
    filter_class     = filters.TaskFilterSet
    ordering         = 'name'
