from django.core.urlresolvers import reverse
from rest_framework.status import HTTP_200_OK

from timed.tracking.factories import ReportFactory


def test_work_report(auth_client):
    ReportFactory.create_batch(10)

    url = reverse('work-reports-list')
    res = auth_client.get(url)
    assert res.status_code == HTTP_200_OK
