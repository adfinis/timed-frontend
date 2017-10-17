"""Viewsets for the employment app."""

from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_condition import C
from rest_framework import mixins, viewsets
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from timed.employment import filters, models, serializers
from timed.permissions import IsAuthenticated, IsReadOnly, IsSuperUser


class UserViewSet(mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.ListModelMixin,
                  viewsets.GenericViewSet):
    """
    Expose user actions.

    Users are managed in admin therefore this end point
    only allows retrieving and updating.
    """

    serializer_class = serializers.UserSerializer
    filter_class = filters.UserFilterSet
    search_fields = ('username', 'first_name', 'last_name')

    def get_queryset(self):
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


class OvertimeCreditViewSet(ModelViewSet):
    """Absence type view set."""

    filter_class = filters.OvertimeCreditFilterSet
    serializer_class = serializers.OvertimeCreditSerializer
    permission_classes = [
        # super user can add/read overtime credits
        C(IsAuthenticated) & C(IsSuperUser) |
        # user may only read filtered results
        C(IsAuthenticated) & C(IsReadOnly)
    ]

    def get_queryset(self):
        """
        Get queryset of overtime credits.

        Following rules apply:
        1. super user may see all
        2. user may see credits of all its supervisors and self
        3. user may only see its own credit
        """
        user = self.request.user

        queryset = models.OvertimeCredit.objects.select_related('user')

        if not user.is_superuser:
            queryset = queryset.filter(
                Q(user=user) | Q(user__supervisors=user)
            )

        return queryset
