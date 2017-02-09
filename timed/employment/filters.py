"""Filters for filtering the data of the employment app endpoints."""


from django.contrib.auth import get_user_model
from django_filters import FilterSet


class UserFilterSet(FilterSet):
    """Filter set for the users endpoint."""

    class Meta:
        """Meta information for the user filter set."""

        model  = get_user_model()
        fields = []
