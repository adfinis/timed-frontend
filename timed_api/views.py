import requests

from timed_api                  import serializers, models, filters
from rest_framework.viewsets    import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.views       import APIView
from rest_framework.response    import Response
from django.contrib.auth.models import User
from django.conf                import settings
from base64                     import b64encode


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
    queryset         = models.Attendance.objects.all()
    serializer_class = serializers.ActivitySerializer
    filter_class     = filters.AttendanceFilterSet


class ReportViewSet(ModelViewSet):
    queryset         = models.Report.objects.all()
    serializer_class = serializers.ReportSerializer
    filter_class     = filters.ReportFilterSet


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


class ProjectIssuesView(APIView):

    def get_github_issues(self, project):
        url = settings.GITHUB_API_URL.format(project.tracker_name)

        response = requests.get(url, headers={
            'Authorization': 'token {}'.format(project.tracker_api_key)
        })

        issues = [
            {
                'type':    'issues',
                'id':      issue['id'],
                'attributes': {
                    'type':  'Github',
                    'title': issue['title'],
                    'url':   settings.GITHUB_ISSUE_URL.format(
                        project.tracker_name,
                        issue['id']
                    ),
                    'state': issue['state'].capitalize()
                }
            }
            for issue
            in response.json()
        ]

        return Response(issues)

    def get_remine_issues(self, project):
        url = settings.REDMINE_API_URL.format(project.tracker_name)

        headers = {
            'X-Redmine-API-Key': project.tracker_api_key
        }

        if (settings.REDMINE_BASIC_AUTH):
            headers['Authorization'] = 'Basic {}'.format(
                b64encode('{}:{}'.format(
                    settings.REDMINE_BASIC_AUTH_USER,
                    settings.REDMINE_BASIC_AUTH_PASSWORD
                ))
            )

        response = requests.get(url, headers={
            'Authorization':     'Basic YWQtc3k6dnVzbGVnaW8=',
        })

        issues = [
            {
                'type':    'issues',
                'id':      issue['id'],
                'attributes': {
                    'type':  'Redmine',
                    'title': issue['subject'],
                    'url':   settings.REDMINE_ISSUE_URL.format(issue['id']),
                    'state': issue['status']['name'].capitalize()
                }
            }
            for issue
            in response.json()['issues']
        ]

        return Response(issues)

    def get(self, request, pk, format=None):
        project = models.Project.objects.get(pk=pk)

        if project.tracker_type == 'GH':
            return self.get_github_issues(project)
        elif project.tracker_type == 'RM':
            return self.get_remine_issues(project)
        else:
            return Response([])
