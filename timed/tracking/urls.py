"""URL to view mapping for the tracking app."""

from django.conf import settings
from rest_framework.routers import DefaultRouter

from timed.tracking import views

r = DefaultRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'activities',      views.ActivityViewSet,      'activity')
r.register(r'activity-blocks', views.ActivityBlockViewSet, 'activity-block')
r.register(r'attendances',     views.AttendanceViewSet,    'attendance')
r.register(r'reports',         views.ReportViewSet,        'report')

urlpatterns = r.urls
