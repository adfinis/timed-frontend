"""URL to view mapping for the projects app."""

from django.conf import settings
from rest_framework.routers import SimpleRouter

from timed.projects import views

r = SimpleRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r"projects", views.ProjectViewSet, "project")
r.register(r"customers", views.CustomerViewSet, "customer")
r.register(r"tasks", views.TaskViewSet, "task")
r.register(r"billing-types", views.BillingTypeViewSet, "billing-type")
r.register(r"cost-centers", views.CostCenterViewSet, "cost-center")
r.register(r"task-assignees", views.TaskAsssigneeViewSet, "task-assignee")
r.register(r"project-assignees", views.ProjectAsssigneeViewSet, "project-assignee")
r.register(r"customer-assignees", views.CustomerAsssigneeViewSet, "customer-assignee")

urlpatterns = r.urls
