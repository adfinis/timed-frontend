from timed_api                  import serializers, models, filters
from rest_framework.viewsets    import ModelViewSet, ReadOnlyModelViewSet
from django.contrib.auth.models import User


class UserViewSet(ReadOnlyModelViewSet):
    queryset         = User.objects.all()
    serializer_class = serializers.UserSerializer
    filter_class     = filters.UserFilterSet


class ActivityViewSet(ModelViewSet):
    serializer_class = serializers.ActivitySerializer
    filter_class     = filters.ActivityFilterSet

    def get_queryset(self):
        return models.Activity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ActivityBlockViewSet(ModelViewSet):
    serializer_class = serializers.ActivityBlockSerializer
    filter_class     = filters.ActivityBlockFilterSet

    def get_queryset(self):
        return models.ActivityBlock.objects.filter(
            activity__user=self.request.user
        )


class AttendanceViewSet(ModelViewSet):
    serializer_class = serializers.AttendanceSerializer
    filter_class     = filters.AttendanceFilterSet

    def get_queryset(self):
        return models.Attendance.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReportViewSet(ModelViewSet):
    serializer_class = serializers.ReportSerializer
    filter_class     = filters.ReportFilterSet

    def get_queryset(self):
        return models.Report.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CustomerViewSet(ModelViewSet):
    queryset         = models.Customer.objects.filter(archived=False)
    serializer_class = serializers.CustomerSerializer
    filter_class     = filters.CustomerFilterSet
    search_fields    = ('name',)
    ordering         = 'name'


class ProjectViewSet(ModelViewSet):
    queryset         = models.Project.objects.filter(archived=False)
    serializer_class = serializers.ProjectSerializer
    filter_class     = filters.ProjectFilterSet
    search_fields    = ('name', 'customer__name',)
    ordering         = ('customer__name', 'name')


class TaskViewSet(ModelViewSet):
    queryset         = models.Task.objects.all()
    serializer_class = serializers.TaskSerializer
    filter_class     = filters.TaskFilterSet


class TaskTemplateViewSet(ModelViewSet):
    queryset         = models.TaskTemplate.objects.all()
    serializer_class = serializers.TaskTemplateSerializer
    filter_class     = filters.TaskTemplateFilterSet
