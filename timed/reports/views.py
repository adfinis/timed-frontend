import re
from collections import defaultdict
from datetime import date
from io import BytesIO
from zipfile import ZipFile

from django.http import HttpResponse, HttpResponseBadRequest
from ezodf import Cell, opendoc
from pkg_resources import resource_string
from rest_framework.viewsets import GenericViewSet

from timed.tracking.filters import ReportFilterSet
from timed.tracking.models import Report
from timed.tracking.views import ReportViewSet


class WorkReportViewSet(GenericViewSet):
    """
    Build a ods work report of reports with given filters.

    It creates one work report per project. If given filters results
    in several projects work reports will be returned as zip.

    Work report is Adfinis specific and is used for Administration
    to send invoice to customer.
    """

    filter_class = ReportFilterSet
    ordering = ReportViewSet.ordering
    ordering_fields = ReportViewSet.ordering_fields

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

    def _clean_filename(self, name):
        """
        Clean name so it can be used in file paths.

        To accomplish this it will remove all special chars and
        replace spaces with underscores
        """
        escaped = re.sub('[^\w\s-]', '', name)
        return re.sub('\s+', '_', escaped)

    def _generate_workreport_name(self, from_date, today, project):
        """
        Generate workreport name.

        Name is in format: YYMM-YYYYMMDD-$Customer-$Project.ods
        whereas YYMM is year and month of from_date and YYYYMMDD
        is date when work reports gets created.
        """
        return '{0}-{1}-{2}-{3}.ods'.format(
            from_date.strftime('%y%m'),
            today.strftime('%Y%m%d'),
            self._clean_filename(project.customer.name),
            self._clean_filename(project.name)
        )

    def _create_workreport(self, from_date, to_date, today, project, reports,
                           user):
        """
        Create ods workreport.

        :rtype: tuple
        :return: tuple where as first value is name and second ezodf document
        """
        customer = project.customer

        tmpl = resource_string('timed_adfinis.reporting', 'workreport.ots')
        doc = opendoc(BytesIO(tmpl))
        table = doc.sheets[0]
        date_style = table['C5'].style_name
        # in template cell D3 is empty but styled for float and borders
        float_style = table['D3'].style_name
        # in template cell D4 is empty but styled for text wrap and borders
        text_style = table['D4'].style_name
        # in template cell D8 is empty but styled for date with borders
        date_style_report = table['D8'].style_name

        # for simplicity insert reports in reverse order
        for report in reports:
            table.insert_rows(12, 1)
            table['A13'] = Cell(report.date,
                                style_name=date_style_report,
                                value_type='date')

            hours = report.duration.total_seconds() / 60 / 60
            table['B13'] = Cell(hours, style_name=float_style)

            table['C13'] = Cell(report.user.get_full_name(),
                                style_name=text_style)
            table['D13'] = Cell(report.comment, style_name=text_style)

            # when from and to date are None find lowest and biggest date
            from_date = min(report.date, from_date or date.max)
            to_date = max(report.date, to_date or date.min)

        # header values
        table['C3'] = Cell(customer and customer.name)
        table['C4'] = Cell(project and project.name)
        table['C5'] = Cell(from_date, style_name=date_style, value_type='date')
        table['C6'] = Cell(to_date, style_name=date_style, value_type='date')
        table['C8'] = Cell(today, style_name=date_style, value_type='date')
        table['C9'] = Cell(user.get_full_name())

        # reset temporary styles (mainly because of borders)
        table['D3'].style_name = ''
        table['D4'].style_name = ''
        table['D8'].style_name = ''

        # calculate location of total hours as insert rows moved it
        table[13 + len(reports), 2].formula = 'of:=SUM(B13:B{0})'.format(
            str(13 + len(reports) - 1))

        name = self._generate_workreport_name(from_date, today, project)
        return (name, doc)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        # needed as we add items in reverse order to work report
        queryset = queryset.reverse()
        count = queryset.count()
        if count == 0:
            return HttpResponseBadRequest()
        params = self._parse_query_params(queryset, request)

        from_date = params.get('from_date')
        to_date = params.get('to_date')
        today = date.today()

        reports_by_project = defaultdict(list)
        for report in queryset:
            reports_by_project[report.task.project].append(report)

        docs = [
            self._create_workreport(
                from_date, to_date, today, project, reports, request.user
            )
            for project, reports in reports_by_project.items()
        ]

        if len(docs) == 1:
            name, doc = docs[0]
            response = HttpResponse(
                doc.tobytes(),
                content_type='application/vnd.oasis.opendocument.spreadsheet')
            response['Content-Disposition'] = (
                'attachment; filename=%s' % name
            )
            return response

        # zip multiple work reports
        buf = BytesIO()
        with ZipFile(buf, 'w') as zf:
            for name, doc in docs:
                zf.writestr(name, doc.tobytes())
        response = HttpResponse(buf.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = (
            'attachment; filename=%s-WorkReports.zip' % (
                today.strftime('%Y%m%d')
            )
        )
        return response
