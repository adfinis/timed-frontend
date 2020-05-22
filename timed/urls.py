"""Root URL mapping."""

from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^api/v1/", include("timed.employment.urls")),
    url(r"^api/v1/", include("timed.projects.urls")),
    url(r"^api/v1/", include("timed.tracking.urls")),
    url(r"^api/v1/", include("timed.reports.urls")),
    url(r"^api/v1/", include("timed.subscription.urls")),
]
