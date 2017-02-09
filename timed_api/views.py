"""View sets for the Timed API."""

from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from timed_api import filters, models, serializers


class UserViewSet(ReadOnlyModelViewSet):
    """User view set."""

    queryset         = User.objects.all()
    serializer_class = serializers.UserSerializer
    filter_class     = filters.UserFilterSet


class ActivityViewSet(ModelViewSet):
    """Activity view set."""

    serializer_class = serializers.ActivitySerializer
    filter_class     = filters.ActivityFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered activities
        :rtype:  QuerySet
        """
        return models.Activity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user of the request as user on creation.

        :param ActivitySerializer seralizer: The serializer
        """
        serializer.save(user=self.request.user)


class ActivityBlockViewSet(ModelViewSet):
    """Activity view set."""

    serializer_class = serializers.ActivityBlockSerializer
    filter_class     = filters.ActivityBlockFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered activity blocks
        :rtype:  QuerySet
        """
        return models.ActivityBlock.objects.filter(
            activity__user=self.request.user
        )


class AttendanceViewSet(ModelViewSet):
    """Attendance view set."""

    serializer_class = serializers.AttendanceSerializer
    filter_class     = filters.AttendanceFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered attendances
        :rtype:  QuerySet
        """
        return models.Attendance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user of the request as user on creation.

        :param AttendanceSerializer seralizer: The serializer
        """
        serializer.save(user=self.request.user)


class ReportViewSet(ModelViewSet):
    """Report view set."""

    serializer_class = serializers.ReportSerializer
    filter_class     = filters.ReportFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered reports
        :rtype:  QuerySet
        """
        return models.Report.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Set the user of the request as user on creation.

        :param ReportSerializer seralizer: The serializer
        """
        serializer.save(user=self.request.user)


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


class TaskTemplateViewSet(ModelViewSet):
    """Task template view set."""

    queryset         = models.TaskTemplate.objects.all()
    serializer_class = serializers.TaskTemplateSerializer
    filter_class     = filters.TaskTemplateFilterSet
