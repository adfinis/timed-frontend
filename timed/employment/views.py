"""Viewsets for the employment app."""

from django.contrib.auth import get_user_model
from rest_framework.viewsets import ReadOnlyModelViewSet

from timed.employment import filters, serializers


class UserViewSet(ReadOnlyModelViewSet):
    """User view set."""

    queryset         = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer
    filter_class     = filters.UserFilterSet
