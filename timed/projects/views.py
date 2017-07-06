"""Viewsets for the projects app."""

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
        ).filter(
            archived=False
        )


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
        ).filter(
            archived=False
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
        ).filter(
            archived=False
        )

    def filter_queryset(self, queryset):
        """Specific filter queryset options."""
        # my most frequent filter uses LIMIT so default ordering
        # needs to be disabled to avoid exception
        if 'my_most_frequent' in self.request.query_params:
            self.ordering = None

        return super().filter_queryset(queryset)
