from django.http import HttpResponse
from rest_framework.viewsets import GenericViewSet

from timed.tracking.filters import ReportFilterSet
from timed.tracking.models import Report


class WorkReport(GenericViewSet):
    """
    Build a ods work report of reports with given filters.

    Work report is Adfinis specific and is used for Administration
    to send invoice to customer.
    """

    filter_class = ReportFilterSet
    ordering_fields = ('-date', )

    def get_queryset(self):
        return Report.objects.select_related(
            'task',
            'user',
            'activity'
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        return HttpResponse(queryset.count())
