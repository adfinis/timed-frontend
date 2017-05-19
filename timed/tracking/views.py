"""Viewsets for the tracking app."""

from rest_framework.viewsets import ModelViewSet

from timed.tracking import filters, models, serializers


class ActivityViewSet(ModelViewSet):
    """Activity view set."""

    serializer_class = serializers.ActivitySerializer
    filter_class     = filters.ActivityFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered activities
        :rtype:  QuerySet
        """
        return models.Activity.objects.prefetch_related(
            'blocks'
        ).select_related(
            'task',
            'user',
            'task__project',
            'task__project__customer'
        ).filter(
            user=self.request.user
        )


class ActivityBlockViewSet(ModelViewSet):
    """Activity view set."""

    serializer_class = serializers.ActivityBlockSerializer
    filter_class     = filters.ActivityBlockFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered activity blocks
        :rtype:  QuerySet
        """
        return models.ActivityBlock.objects.select_related(
            'activity'
        ).filter(
            activity__user=self.request.user
        )


class AttendanceViewSet(ModelViewSet):
    """Attendance view set."""

    serializer_class = serializers.AttendanceSerializer
    filter_class     = filters.AttendanceFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered attendances
        :rtype:  QuerySet
        """
        return models.Attendance.objects.select_related(
            'user'
        ).filter(
            user=self.request.user
        )


class ReportViewSet(ModelViewSet):
    """Report view set."""

    serializer_class = serializers.ReportSerializer
    filter_class     = filters.ReportFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered reports
        :rtype:  QuerySet
        """
        return models.Report.objects.select_related(
            'task',
            'user',
            'activity'
        ).filter(
            user=self.request.user
        )


class AbsenceViewSet(ModelViewSet):
    """Absence view set."""

    serializer_class = serializers.AbsenceSerializer
    filter_class     = filters.AbsenceFilterSet

    def get_queryset(self):
        """Filter the queryset by the user of the request.

        :return: The filtered absences
        :rtype:  QuerySet
        """
        return models.Absence.objects.select_related(
            'type',
            'user'
        ).filter(
            user=self.request.user
        )
