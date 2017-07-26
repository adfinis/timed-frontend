from datetime import date
from io import BytesIO

import ezodf
from django.http import HttpResponse, HttpResponseBadRequest
from pkg_resources import resource_string
from rest_framework.viewsets import GenericViewSet

from timed.projects.models import Customer, Project
from timed.tracking.filters import ReportFilterSet
from timed.tracking.models import Report


class WorkReport(GenericViewSet):
    """
    Build a ods work report of reports with given filters.

    Work report is Adfinis specific and is used for Administration
    to send invoice to customer.
    """

    filter_class = ReportFilterSet
    ordering = ('-date', )

    def get_queryset(self):
        return Report.objects.select_related(
            'user',
        )

    def _parse_query_params(self, queryset, request):
        """Parse query params by using filter_class."""
        fltr = self.filter_class(
            request.query_params,
            queryset=queryset,
            request=request)
        form = fltr.form
        form.is_valid()
        return form.cleaned_data

    def _format_user_name(self, user):
        # in the long run this function should move onto User in timed
        first_name = user.first_name or ''
        last_name = user.last_name or ''

        return '{0} {1}'.format(first_name, last_name).strip()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        count = queryset.count()
        if count == 0:
            return HttpResponseBadRequest()
        params = self._parse_query_params(queryset, request)

        customer = Customer.objects.filter(id=params.get('customer')).first()
        project = Project.objects.filter(id=params.get('project')).first()
        from_date = params.get('from_date')
        to_date = params.get('to_date')

        tmpl = resource_string('timed_adfinis.reporting', 'workreport.ots')
        doc = ezodf.opendoc(BytesIO(tmpl))
        table = doc.sheets[0]
        date_style = table['B5'].style_name
        # in template cell C3 is empty but styled as needed for float
        float_style = table['C3'].style_name

        def _set_value(cell, value, style_name=None, value_type=None):
            if value is not None:
                table[cell].set_value(value, value_type=value_type)
                if style_name is not None:
                    table[cell].style_name = date_style

        # header values
        _set_value('B3', customer and customer.name)
        _set_value('B4', project and project.name)
        _set_value('B5', from_date, date_style, 'date')
        _set_value('B6', to_date, date_style, 'date')
        _set_value('B8', date.today(), date_style, 'date')
        _set_value('B9', self._format_user_name(request.user))

        # for simplicity insert reports in reverse order
        for report in queryset:
            table.insert_rows(12, 1)
            _set_value('A13', report.date, date_style, 'date')

            hours = report.duration.total_seconds() / 60 / 60
            _set_value('B13', hours, float_style)

            _set_value('C13', self._format_user_name(report.user))
            _set_value('D13', report.comment)

        # calculate location of total hours as insert rows moved it
        table[13 + count, 2].formula = 'of:=SUM(B13:B{0})'.format(
            str(13 + count - 1))

        response = HttpResponse(
            doc.tobytes(),
            content_type='application/vnd.oasis.opendocument.spreadsheet')
        response['Content-Disposition'] = 'attachment; filename=workreport.ods'
        return response
