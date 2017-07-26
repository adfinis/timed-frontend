import io

import ezodf
from django.core.urlresolvers import reverse
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from timed.tracking.factories import ReportFactory


def test_work_report(auth_client):
    user = auth_client.user
    ReportFactory.create_batch(10, user=user)

    url = reverse('work-reports-list')
    res = auth_client.get(url, data={
        'user': auth_client.user.id
    })
    assert res.status_code == HTTP_200_OK

    content = io.BytesIO(res.content)
    doc = ezodf.opendoc(content)
    table = doc.sheets[0]
    assert table['B9'].value == 'Test User'


def test_work_report_empty(auth_client):
    url = reverse('work-reports-list')
    res = auth_client.get(url, data={
        'user': auth_client.user.id
    })
    assert res.status_code == HTTP_400_BAD_REQUEST
