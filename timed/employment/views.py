"""Viewsets for the employment app."""

from django.contrib.auth import get_user_model
from rest_framework.viewsets import ReadOnlyModelViewSet

from timed.employment import filters, models, serializers


class UserViewSet(ReadOnlyModelViewSet):
    """User view set."""

    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered users
        :rtype:  QuerySet
        """
        return get_user_model().objects.filter(pk=self.request.user.pk)


class EmploymentViewSet(ReadOnlyModelViewSet):
    """Employment view set."""

    serializer_class = serializers.EmploymentSerializer
    ordering         = ('-start_date',)

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered employments
        :rtype:  QuerySet
        """
        return models.Employment.objects.filter(user=self.request.user)


class LocationViewSet(ReadOnlyModelViewSet):
    """Location viewset set."""

    queryset         = models.Location.objects.all()
    serializer_class = serializers.LocationSerializer
    ordering         = ('name',)


class PublicHolidayViewSet(ReadOnlyModelViewSet):
    """Public holiday view set."""

    queryset         = models.PublicHoliday.objects.all()
    serializer_class = serializers.PublicHolidaySerializer
    filter_class     = filters.PublicHolidayFilterSet
    ordering         = ('date',)
