"""Tests for the reports endpoint."""

from datetime import date, timedelta

import pyexcel
from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from django.utils.duration import duration_string
from hypothesis import HealthCheck, given, settings
from hypothesis.extra.django import TestCase
from hypothesis.extra.django.models import models
from hypothesis.strategies import (builds, characters, dates, lists,
                                   sampled_from, timedeltas)
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST,
                                   HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN)

from timed.employment.factories import (AbsenceTypeFactory, EmploymentFactory,
                                        UserFactory)
from timed.jsonapi_test_case import JSONAPIClient, JSONAPITestCase
from timed.projects.factories import TaskFactory
from timed.tracking.factories import AbsenceFactory, ReportFactory
from timed.tracking.models import Absence, Report


class ReportTests(JSONAPITestCase):
    """Tests for the reports endpoint."""

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        other_user = get_user_model().objects.create_user(
            username='test',
            password='123qweasd'
        )

        self.reports = ReportFactory.create_batch(10, user=self.user)
        self.other_reports = ReportFactory.create_batch(10, user=other_user)

    def test_report_list(self):
        """Should respond with a list of filtered reports."""
        url = reverse('report-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url, data={
            'date': self.reports[0].date,
            'user': self.user.id,
            'task': self.reports[0].task.id,
            'project': self.reports[0].task.project.id,
            'customer': self.reports[0].task.project.customer.id,
            'include': 'user,task,task.project,task.project.customer'
        })

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == 1
        assert result['data'][0]['id'] == str(self.reports[0].id)

    def test_report_list_verify(self):
        url_list = reverse('report-list')
        res = self.client.get(url_list, data={'not_verified': True})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 20

        url_verify = reverse('report-verify')
        res = self.client.post(url_verify, QUERY_STRING='user=%s' %
                               self.user.id)
        assert res.status_code == HTTP_200_OK

        res = self.client.get(url_list, data={'not_verified': False})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 10

    def test_report_list_verify_page(self):
        url_verify = reverse('report-verify')
        res = self.client.post(url_verify, QUERY_STRING='user=%s&page_size=5' %
                               self.user.id)
        assert res.status_code == HTTP_200_OK

        url_list = reverse('report-list')
        res = self.client.get(url_list, data={'not_verified': False})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 5

    def test_report_detail_verify(self):
        report = self.reports[0]
        url = reverse('report-verify', args=[report.id])
        res = self.client.post(url)

        assert res.status_code == HTTP_200_OK
        reports = Report.objects.filter(verified_by=self.user)
        assert reports.count() == 1
        assert reports.first().id == report.id

    def test_report_export_missing_type(self):
        """Should respond with a list of filtered reports."""
        url = reverse('report-export')

        user_res   = self.client.get(url, data={
            'user': self.user.id,
        })

        assert user_res.status_code == HTTP_400_BAD_REQUEST

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
                    'duration': '00:50:00',
                    'date': '2017-02-01'
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

    def test_report_update_owner(self):
        """Should update an existing report."""
        report = self.reports[0]

        task = TaskFactory.create()

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foobar',
                    'duration': '01:00:00',
                    'date': '2017-02-04'
                },
                'relationships': {
                    'task': {
                        'data': {
                            'type': 'tasks',
                            'id': task.id
                        }
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

        assert (
            result['data']['attributes']['date'] ==
            data['data']['attributes']['date']
        )

        assert (
            int(result['data']['relationships']['task']['data']['id']) ==
            int(data['data']['relationships']['task']['data']['id'])
        )

    def test_report_update_date_staff(self):
        report = self.other_reports[0]

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'date': '2017-02-04'
                },
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        res = self.client.patch(url, data)
        assert res.status_code == HTTP_400_BAD_REQUEST

    def test_report_update_duration_staff(self):
        report = self.other_reports[0]
        report.duration = timedelta(hours=2)
        report.save()

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'duration': '01:00:00',
                },
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        res = self.client.patch(url, data)
        assert res.status_code == HTTP_400_BAD_REQUEST

    def test_report_update_not_staff_user(self):
        """Updating of report belonging to different user is not allowed."""
        report = self.reports[0]
        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foobar',
                },
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        client = JSONAPIClient()
        client.login('test', '123qweasd')
        res = client.patch(url, data)
        assert res.status_code == HTTP_403_FORBIDDEN

    def test_report_update_staff_user(self):
        report = self.reports[0]
        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foobar',
                },
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        res = self.client.patch(url, data)
        assert res.status_code == HTTP_200_OK

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

    def test_report_round_duration(self):
        """Should round the duration of a report to 15 minutes."""
        report = self.reports[0]

        report.duration = timedelta(hours=1, minutes=7)
        report.save()

        assert duration_string(report.duration) == '01:00:00'

        report.duration = timedelta(hours=1, minutes=8)
        report.save()

        assert duration_string(report.duration) == '01:15:00'

        report.duration = timedelta(hours=1, minutes=53)
        report.save()

        assert duration_string(report.duration) == '02:00:00'

    def test_absence_update_on_create_report(self):
        """Should update the absence after creating a new report."""
        task = TaskFactory.create()
        type = AbsenceTypeFactory.create(fill_worktime=True)
        day  = date(2017, 5, 3)

        employment = EmploymentFactory.create(user=self.user, start_date=day)

        absence = AbsenceFactory.create(user=self.user, date=day, type=type)

        Report.objects.create(
            user=self.user,
            date=day,
            task=task,
            duration=timedelta(hours=1)
        )

        assert (
            Absence.objects.get(pk=absence.pk).duration ==
            employment.worktime_per_day - timedelta(hours=1)
        )


class TestReportHypo(TestCase):
    @given(
        sampled_from(['csv', 'xlsx', 'ods']),
        lists(
            models(
                Report,
                comment=characters(blacklist_categories=['Cc', 'Cs']),
                task=builds(TaskFactory.create),
                user=builds(UserFactory.create),
                date=dates(
                    min_date=date(2000, 1, 1),
                    max_date=date(2100, 1, 1),
                ),
                duration=timedeltas(
                    min_delta=timedelta(0),
                    max_delta=timedelta(days=1)
                )
            ),
            min_size=1,
            max_size=5,
        )
    )
    @settings(timeout=5, suppress_health_check=[HealthCheck.too_slow])
    def test_report_export(self, file_type, reports):
        get_user_model().objects.create_user(username='test',
                                             password='1234qwer')
        client = JSONAPIClient()
        client.login('test', '1234qwer')
        url = reverse('report-export')

        with self.assertNumQueries(4):
            user_res = client.get(url, data={
                'file_type': file_type
            })

        assert user_res.status_code == HTTP_200_OK
        book = pyexcel.get_book(
            file_content=user_res.content, file_type=file_type
        )
        # bookdict is a dict of tuples(name, content)
        sheet = book.bookdict.popitem()[1]
        assert len(sheet) == len(reports) + 1
