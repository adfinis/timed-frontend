"""URL to view mapping for the projects app."""

from django.conf import settings
from rest_framework.routers import DefaultRouter

from timed.projects import views

r = DefaultRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'projects',  views.ProjectViewSet,  'project')
r.register(r'customers', views.CustomerViewSet, 'customer')
r.register(r'tasks',     views.TaskViewSet,     'task')
r.register(r'billing-types', views.BillingTypeViewSet, 'billing-type')
r.register(r'cost-centers', views.CostCenterViewSet, 'cost-center')

urlpatterns = r.urls
