"""URL to view mapping for the employment app."""

from django.conf import settings
from rest_framework.routers import DefaultRouter

from employment import views

r = DefaultRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'users', views.UserViewSet,  'user')

urlpatterns = r.urls
