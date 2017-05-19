"""Viewsets for the employment app."""

from datetime import date, datetime

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
        return get_user_model().objects.prefetch_related(
            'employments',
            'absence_credits'
        ).filter(
            pk=self.request.user.pk
        )


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
        ).all()


class AbsenceTypeViewSet(ReadOnlyModelViewSet):
    """Absence type view set."""

    queryset         = models.AbsenceType.objects.all()
    serializer_class = serializers.AbsenceTypeSerializer
    ordering         = ('name',)


class AbsenceCreditViewSet(ReadOnlyModelViewSet):
    """Absence type view set."""

    serializer_class = serializers.AbsenceCreditSerializer

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered absence credits
        :rtype:  QuerySet
        """
        requested_end_date = self.request.query_params.get('until')

        end_date = (
            datetime.strptime(requested_end_date, '%Y-%m-%d').date()
            if requested_end_date
            else date.today()
        )

        return models.AbsenceCredit.objects.select_related(
            'user',
            'absence_type'
        ).filter(
            user=self.request.user,
            date__lte=end_date
        )


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
