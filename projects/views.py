"""Viewsets for the projects app."""

from rest_framework.viewsets import ModelViewSet

from projects import filters, models, serializers


class CustomerViewSet(ModelViewSet):
    """Customer view set."""

    queryset         = models.Customer.objects.filter(archived=False)
    serializer_class = serializers.CustomerSerializer
    filter_class     = filters.CustomerFilterSet
    search_fields    = ('name',)
    ordering         = 'name'


class ProjectViewSet(ModelViewSet):
    """Project view set."""

    queryset         = models.Project.objects.filter(archived=False)
    serializer_class = serializers.ProjectSerializer
    filter_class     = filters.ProjectFilterSet
    search_fields    = ('name', 'customer__name',)
    ordering         = ('customer__name', 'name')


class TaskViewSet(ModelViewSet):
    """Task view set."""

    queryset         = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer
    filter_class     = filters.TaskFilterSet
