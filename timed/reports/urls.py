from django.conf import settings
from rest_framework.routers import DefaultRouter

from timed_adfinis.reporting import views

r = DefaultRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'work-report', views.WorkReport, 'work-reports')

urlpatterns = r.urls
