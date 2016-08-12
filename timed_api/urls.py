from timed_api              import views
from rest_framework.routers import SimpleRouter
from django.conf            import settings
from django.conf.urls       import url

r = SimpleRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'users',           views.UserViewSet,          'user')
r.register(r'activities',      views.ActivityViewSet,      'activity')
r.register(r'activity-blocks', views.ActivityBlockViewSet, 'activity-block')
r.register(r'attendances',     views.AttendanceViewSet,    'attendance')
r.register(r'reports',         views.ReportViewSet,        'report')
r.register(r'projects',        views.ProjectViewSet,       'project')
r.register(r'customers',       views.CustomerViewSet,      'customer')
r.register(r'tasks',           views.TaskViewSet,          'task')
r.register(r'task-templates',  views.TaskTemplateViewSet,  'task-template')

urlpatterns = [
    url(r'projects/(?P<pk>[0-9]+)/issues', views.ProjectIssuesView.as_view())
]

urlpatterns.extend(r.urls)
