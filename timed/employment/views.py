"""Viewsets for the employment app."""

from django.contrib.auth import get_user_model
from rest_framework.viewsets import ReadOnlyModelViewSet

from timed.employment import filters, models, serializers


class UserViewSet(ReadOnlyModelViewSet):
    """User view set."""

    serializer_class = serializers.UserSerializer
    filter_class = filters.UserFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered users
        :rtype:  QuerySet
        """
        return get_user_model().objects.prefetch_related('employments')


class EmploymentViewSet(ReadOnlyModelViewSet):
    """Employment view set."""

    serializer_class = serializers.EmploymentSerializer
    ordering         = ('-end_date',)

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered employments
        :rtype:  QuerySet
        """
        return models.Employment.objects.select_related(
            'user',
            'location'
        ).filter(
            user=self.request.user
        )


class LocationViewSet(ReadOnlyModelViewSet):
    """Location viewset set."""

    queryset         = models.Location.objects.all()
    serializer_class = serializers.LocationSerializer
    ordering         = ('name',)


class PublicHolidayViewSet(ReadOnlyModelViewSet):
    """Public holiday view set."""

    serializer_class = serializers.PublicHolidaySerializer
    filter_class     = filters.PublicHolidayFilterSet
    ordering         = ('date',)

    def get_queryset(self):
        """Prefetch the related data.

        :return: The public holidays
        :rtype:  QuerySet
        """
        return models.PublicHoliday.objects.select_related(
            'location'
        )


class AbsenceTypeViewSet(ReadOnlyModelViewSet):
    """Absence type view set."""

    queryset         = models.AbsenceType.objects.all()
    serializer_class = serializers.AbsenceTypeSerializer
    ordering         = ('name',)


class OvertimeCreditViewSet(ReadOnlyModelViewSet):
    """Absence type view set."""

    serializer_class = serializers.OvertimeCreditSerializer

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered overtime credits
        :rtype:  QuerySet
        """
        return models.OvertimeCredit.objects.select_related(
            'user'
        ).filter(
            user=self.request.user
        )
