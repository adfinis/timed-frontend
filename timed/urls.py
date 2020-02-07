"""Root URL mapping."""

from django.conf.urls import include, url
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    url(r"^admin/", admin.site.urls),
    url(r"^api/v1/auth/login", TokenObtainPairView.as_view(), name="login"),
    url(r"^api/v1/auth/refresh", TokenRefreshView.as_view(), name="refresh"),
    url(r"^api/v1/", include("timed.employment.urls")),
    url(r"^api/v1/", include("timed.projects.urls")),
    url(r"^api/v1/", include("timed.tracking.urls")),
    url(r"^api/v1/", include("timed.reports.urls")),
    url(r"^api/v1/", include("timed.subscription.urls")),
]
