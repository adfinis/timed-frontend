from datetime import date
from io import BytesIO

from django.http import HttpResponse, HttpResponseBadRequest
from ezodf import Cell, opendoc
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
        today = date.today()

        tmpl = resource_string('timed_adfinis.reporting', 'workreport.ots')
        doc = opendoc(BytesIO(tmpl))
        table = doc.sheets[0]
        date_style = table['B5'].style_name
        # in template cell C3 is empty but styled as needed for float
        float_style = table['C3'].style_name
        # in template cell C4 is empty but styled as needed for text with wrap
        text_style = table['C4'].style_name

        # header values
        table['B3'] = Cell(customer and customer.name)
        table['B3'] = Cell(customer and customer.name)
        table['B4'] = Cell(project and project.name)
        table['B5'] = Cell(from_date, style_name=date_style, value_type='date')
        table['B6'] = Cell(to_date, style_name=date_style, value_type='date')
        table['B8'] = Cell(today, style_name=date_style, value_type='date')
        table['B9'] = Cell(request.user.get_full_name())

        # for simplicity insert reports in reverse order
        for report in queryset:
            table.insert_rows(12, 1)
            table['A13'] = Cell(report.date, style_name=date_style,
                                value_type='date')

            hours = report.duration.total_seconds() / 60 / 60
            table['B13'] = Cell(hours, style_name=float_style)

            table['C13'] = Cell(report.user.get_full_name())
            table['D13'] = Cell(report.comment, style_name=text_style)

        # calculate location of total hours as insert rows moved it
        table[13 + count, 2].formula = 'of:=SUM(B13:B{0})'.format(
            str(13 + count - 1))

        response = HttpResponse(
            doc.tobytes(),
            content_type='application/vnd.oasis.opendocument.spreadsheet')
        response['Content-Disposition'] = 'attachment; filename=workreport.ods'
        return response
