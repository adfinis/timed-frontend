"""URL to view mapping for the projects app."""

from django.conf import settings
from rest_framework.routers import DefaultRouter

from projects import views

r = DefaultRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'projects',  views.ProjectViewSet,  'project')
r.register(r'customers', views.CustomerViewSet, 'customer')
r.register(r'tasks',     views.TaskViewSet,     'task')

urlpatterns = r.urls
