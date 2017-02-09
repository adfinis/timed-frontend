"""Tests for the reports endpoint."""

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.projects.factories import TaskFactory
from timed.tracking.factories import ReportFactory


class ReportTests(JSONAPITestCase):
    """Tests for the reports endpoint."""

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        other_user = User.objects.create_user(
            username='test',
            password='123qweasd'
        )

        self.reports = ReportFactory.create_batch(10, user=self.user)

        ReportFactory.create_batch(10, user=other_user)

    def test_report_list(self):
        """Should respond with a list of reports filtered by user."""
        url = reverse('report-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == len(self.reports)

    def test_report_detail(self):
        """Should respond with a single report."""
        report = self.reports[0]

        url = reverse('report-detail', args=[
            report.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

    def test_report_create(self):
        """Should create a new report and automatically set the user."""
        task = TaskFactory.create()

        data = {
            'data': {
                'type': 'reports',
                'id': None,
                'attributes': {
                    'comment':  'foo',
                    'duration': '00:50:00'
                },
                'relationships': {
                    'task': {
                        'data': {
                            'type': 'tasks',
                            'id': task.id
                        }
                    },
                }
            }
        }

        url = reverse('report-list')

        noauth_res = self.noauth_client.post(url, data)
        user_res   = self.client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_201_CREATED

        result = self.result(user_res)

        assert (
            int(result['data']['relationships']['user']['data']['id']) ==
            int(self.user.id)
        )

        assert (
            int(result['data']['relationships']['task']['data']['id']) ==
            int(data['data']['relationships']['task']['data']['id'])
        )

    def test_report_update(self):
        """Should update an existing report."""
        report = self.reports[0]

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foobar',
                    'duration': '01:00:00'
                },
                'relationships': {
                    'task': {
                        'data': None
                    }
                }
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        user_res   = self.client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert (
            result['data']['attributes']['comment'] ==
            data['data']['attributes']['comment']
        )

        assert (
            result['data']['attributes']['duration'] ==
            data['data']['attributes']['duration']
        )

        assert result['data']['relationships']['task']['data'] is None

    def test_report_delete(self):
        """Should delete a report."""
        report = self.reports[0]

        url = reverse('report-detail', args=[
            report.id
        ])

        noauth_res = self.noauth_client.delete(url)
        user_res   = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_204_NO_CONTENT
