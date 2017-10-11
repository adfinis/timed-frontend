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

from timed.employment.factories import UserFactory
from timed.jsonapi_test_case import JSONAPIClient, JSONAPITestCase
from timed.projects.factories import TaskFactory
from timed.tracking.factories import ReportFactory
from timed.tracking.models import Report


class ReportTests(JSONAPITestCase):
    """Tests for the reports endpoint."""

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        other_user = get_user_model().objects.create_user(
            username='test',
            password='123qweasd'
        )

        self.reports = ReportFactory.create_batch(10, user=self.user,
                                                  duration=timedelta(hours=1))
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
            'include': (
                'user,task,task.project,task.project.customer,verified_by'
            )
        })

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == 1
        assert result['data'][0]['id'] == str(self.reports[0].id)
        assert result['meta']['total-time'] == '01:00:00'

    def test_report_list_filter_reviewer(self):
        report = self.reports[0]
        report.task.project.reviewers.add(self.user)

        url = reverse('report-list')

        res = self.client.get(url, data={'reviewer': self.user.id})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 1
        assert result['data'][0]['id'] == str(report.id)

    def test_report_list_verify(self):
        url_list = reverse('report-list')
        res = self.client.get(url_list, data={'not_verified': 1})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 20

        url_verify = reverse('report-verify')
        res = self.client.post(url_verify, QUERY_STRING='user=%s' %
                               self.user.id)
        assert res.status_code == HTTP_200_OK

        res = self.client.get(url_list, data={'not_verified': 0})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 10
        assert result['meta']['total-time'] == '10:00:00'

    def test_report_list_verify_non_admin(self):
        """Non admin resp. non staff user may not verify reports."""
        self.user.is_staff = False
        self.user.save()

        url_verify = reverse('report-verify')
        res = self.client.post(url_verify, QUERY_STRING='user=%s' %
                               self.user.id)
        assert res.status_code == HTTP_403_FORBIDDEN

    def test_report_list_verify_page(self):
        url_verify = reverse('report-verify')
        res = self.client.post(url_verify, QUERY_STRING='user=%s&page_size=5' %
                               self.user.id)
        assert res.status_code == HTTP_200_OK

        url_list = reverse('report-list')
        res = self.client.get(url_list, data={'not_verified': 0})
        assert res.status_code == HTTP_200_OK
        result = self.result(res)
        assert len(result['data']) == 5

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
                    'verified-by': {
                        'data': None
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

    def test_report_update_verified_as_non_staff_but_owner(self):
        """Test that an owner (not staff) may not change a verified report."""
        report = self.reports[0]
        report.verified_by = self.user
        report.duration = timedelta(hours=2)
        report.save()

        url = reverse('report-detail', args=[
            report.id
        ])

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'duration': '01:00:00',
                },
            }
        }

        client = JSONAPIClient()
        client.login('test', '123qweasd')
        res = client.patch(url, data)
        assert res.status_code == HTTP_403_FORBIDDEN

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

    def test_report_set_verified_by_not_staff_user(self):
        """Not staff user may not set verified by."""
        self.user.is_staff = False
        self.user.save()

        report = self.reports[0]
        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'relationships': {
                    'verified-by': {
                        'data': {
                            'id': self.user.id,
                            'type': 'users'
                        }
                    },
                }
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        res = self.client.patch(url, data)
        assert res.status_code == HTTP_400_BAD_REQUEST

    def test_report_update_staff_user(self):
        report = self.reports[0]

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foobar',
                },
                'relationships': {
                    'verified-by': {
                        'data': {
                            'id': self.user.id,
                            'type': 'users'
                        }
                    },
                }
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        res = self.client.patch(url, data)
        assert res.status_code == HTTP_200_OK

    def test_report_reset_verified_by_staff_user(self):
        """Staff user may reset verified by on report."""
        report = self.reports[0]
        report.verified_by = self.user
        report.save()

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foobar',
                },
                'relationships': {
                    'verified-by': {
                        'data': None
                    },
                }
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


def test_report_list_no_result(admin_client):
    url = reverse('report-list')
    res = admin_client.get(url)

    assert res.status_code == HTTP_200_OK
    json = res.json()
    assert json['meta']['total-time'] == '00:00:00'


def test_report_by_year(auth_client):
    ReportFactory.create(duration=timedelta(hours=1), date=date(2017, 1, 1))
    ReportFactory.create(duration=timedelta(hours=1), date=date(2015, 2, 28))
    ReportFactory.create(duration=timedelta(hours=1), date=date(2015, 12, 31))

    url = reverse('report-by-year')
    result = auth_client.get(url, data={'ordering': 'year'})
    assert result.status_code == 200

    json = result.json()
    expected_json = [
        {
            'type': 'report-years',
            'id': '2015',
            'attributes': {
                'year': 2015,
                'duration': '02:00:00'
            }
        },
        {
            'type': 'report-years',
            'id': '2017',
            'attributes': {
                'year': 2017,
                'duration': '01:00:00'
            }
        }
    ]

    assert json['data'] == expected_json
    assert json['meta']['total-time'] == '03:00:00'


def test_report_by_month(auth_client):
    ReportFactory.create(duration=timedelta(hours=1), date=date(2016, 1, 1))
    ReportFactory.create(duration=timedelta(hours=1), date=date(2015, 12, 4))
    ReportFactory.create(duration=timedelta(hours=2), date=date(2015, 12, 31))

    url = reverse('report-by-month')
    result = auth_client.get(url, data={'ordering': 'year,month'})
    assert result.status_code == 200

    json = result.json()
    expected_json = [
        {
            'type': 'report-months',
            'id': '2015-12',
            'attributes': {
                'year': 2015,
                'month': 12,
                'duration': '03:00:00'
            }
        },
        {
            'type': 'report-months',
            'id': '2016-1',
            'attributes': {
                'year': 2016,
                'month': 1,
                'duration': '01:00:00'
            }
        }
    ]

    assert json['data'] == expected_json
    assert json['meta']['total-time'] == '04:00:00'


def test_report_by_user(auth_client):
    user = auth_client.user
    ReportFactory.create(duration=timedelta(hours=1), user=user)
    ReportFactory.create(duration=timedelta(hours=2), user=user)
    report = ReportFactory.create(duration=timedelta(hours=2))

    url = reverse('report-by-user')
    result = auth_client.get(url, data={'ordering': 'duration'})
    assert result.status_code == 200

    json = result.json()
    expected_json = [
        {
            'type': 'report-users',
            'id': str(report.user.id),
            'attributes': {
                'duration': '02:00:00'
            },
            'relationships': {
                'user': {
                    'data': {
                        'id': str(report.user.id),
                        'type': 'users'
                    }
                }
            }
        },
        {
            'type': 'report-users',
            'id': str(user.id),
            'attributes': {
                'duration': '03:00:00'
            },
            'relationships': {
                'user': {
                    'data': {
                        'id': str(user.id),
                        'type': 'users'
                    }
                }
            }
        }
    ]

    assert json['data'] == expected_json
    assert json['meta']['total-time'] == '05:00:00'


def test_report_by_task(auth_client):
    task_z = TaskFactory.create(name='Z')
    task_test = TaskFactory.create(name='Test')
    ReportFactory.create(duration=timedelta(hours=1), task=task_test)
    ReportFactory.create(duration=timedelta(hours=2), task=task_test)
    ReportFactory.create(duration=timedelta(hours=2), task=task_z)

    url = reverse('report-by-task')
    result = auth_client.get(url, data={'ordering': 'task__name'})
    assert result.status_code == 200

    json = result.json()
    expected_json = [
        {
            'type': 'report-tasks',
            'id': str(task_test.id),
            'attributes': {
                'duration': '03:00:00'
            },
            'relationships': {
                'task': {
                    'data': {
                        'id': str(task_test.id),
                        'type': 'tasks'
                    }
                }
            }
        },
        {
            'type': 'report-tasks',
            'id': str(task_z.id),
            'attributes': {
                'duration': '02:00:00'
            },
            'relationships': {
                'task': {
                    'data': {
                        'id': str(task_z.id),
                        'type': 'tasks'
                    }
                }
            }
        }
    ]

    assert json['data'] == expected_json
    assert json['meta']['total-time'] == '05:00:00'


def test_report_by_project(auth_client):
    report = ReportFactory.create(duration=timedelta(hours=1))
    ReportFactory.create(duration=timedelta(hours=2), task=report.task)
    report2 = ReportFactory.create(duration=timedelta(hours=4))

    url = reverse('report-by-project')
    result = auth_client.get(url, data={'ordering': 'duration'})
    assert result.status_code == 200

    json = result.json()
    expected_json = [
        {
            'type': 'report-projects',
            'id': str(report.task.project.id),
            'attributes': {
                'duration': '03:00:00'
            },
            'relationships': {
                'project': {
                    'data': {
                        'id': str(report.task.project.id),
                        'type': 'projects'
                    }
                }
            }
        },
        {
            'type': 'report-projects',
            'id': str(report2.task.project.id),
            'attributes': {
                'duration': '04:00:00'
            },
            'relationships': {
                'project': {
                    'data': {
                        'id': str(report2.task.project.id),
                        'type': 'projects'
                    }
                }
            }
        }
    ]

    assert json['data'] == expected_json
    assert json['meta']['total-time'] == '07:00:00'


def test_report_by_customer(auth_client):
    report = ReportFactory.create(duration=timedelta(hours=1))
    ReportFactory.create(duration=timedelta(hours=2), task=report.task)
    report2 = ReportFactory.create(duration=timedelta(hours=4))

    url = reverse('report-by-customer')
    result = auth_client.get(url, data={'ordering': 'duration'})
    assert result.status_code == 200

    json = result.json()
    expected_data = [
        {
            'type': 'report-customers',
            'id': str(report.task.project.customer.id),
            'attributes': {
                'duration': '03:00:00'
            },
            'relationships': {
                'customer': {
                    'data': {
                        'id': str(report.task.project.customer.id),
                        'type': 'customers'
                    }
                }
            }
        },
        {
            'type': 'report-customers',
            'id': str(report2.task.project.customer.id),
            'attributes': {
                'duration': '04:00:00'
            },
            'relationships': {
                'customer': {
                    'data': {
                        'id': str(report2.task.project.customer.id),
                        'type': 'customers'
                    }
                }
            }
        }
    ]

    assert json['data'] == expected_data
    assert json['meta']['total-time'] == '07:00:00'
