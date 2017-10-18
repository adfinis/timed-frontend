"""URL to view mapping for the employment app."""

from django.conf import settings
from rest_framework.routers import DefaultRouter

from timed.employment import views

r = DefaultRouter(trailing_slash=settings.APPEND_SLASH)

r.register(r'users',            views.UserViewSet,           'user')
r.register(r'employments',      views.EmploymentViewSet,     'employment')
r.register(r'locations',        views.LocationViewSet,       'location')
r.register(r'public-holidays',  views.PublicHolidayViewSet,  'public-holiday')
r.register(r'absence-types',    views.AbsenceTypeViewSet,    'absence-type')
r.register(r'overtime-credits', views.OvertimeCreditViewSet, 'overtime-credit')
r.register(r'absence-credits',  views.AbsenceCreditViewSet,  'absence-credit')

urlpatterns = r.urls
