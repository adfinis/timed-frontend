"""Viewsets for the employment app."""

from django.contrib.auth.models import User
from rest_framework.viewsets import ReadOnlyModelViewSet

from employment import filters, serializers


class UserViewSet(ReadOnlyModelViewSet):
    """User view set."""

    queryset         = User.objects.all()
    serializer_class = serializers.UserSerializer
    filter_class     = filters.UserFilterSet
