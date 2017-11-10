"""Tests for the reports endpoint."""

from datetime import timedelta

import pyexcel
import pytest
from django.core.urlresolvers import reverse
from django.utils.duration import duration_string
from rest_framework import status

from timed.projects.factories import (CostCenterFactory, ProjectFactory,
                                      TaskFactory)
from timed.tracking.factories import ReportFactory


def test_report_list(auth_client):
    user = auth_client.user
    ReportFactory.create(user=user)
    report = ReportFactory.create(user=user, duration=timedelta(hours=1))
    url = reverse('report-list')

    response = auth_client.get(url, data={
        'date': report.date,
        'user': user.id,
        'task': report.task_id,
        'project': report.task.project_id,
        'customer': report.task.project.customer_id,
        'include': (
            'user,task,task.project,task.project.customer,verified_by'
        )
    })

    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert len(json['data']) == 1
    assert json['data'][0]['id'] == str(report.id)
    assert json['meta']['total-time'] == '01:00:00'


def test_report_list_filter_reviewer(auth_client):
    user = auth_client.user
    report = ReportFactory.create(user=user)
    report.task.project.reviewers.add(user)

    url = reverse('report-list')

    response = auth_client.get(url, data={'reviewer': user.id})
    assert response.status_code == status.HTTP_200_OK
    json = response.json()
    assert len(json['data']) == 1
    assert json['data'][0]['id'] == str(report.id)


def test_report_export_missing_type(auth_client):
    user = auth_client.user
    url = reverse('report-export')

    response = auth_client.get(url, data={'user': user.id})

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_report_detail(auth_client):
    user = auth_client.user
    report = ReportFactory.create(user=user)

    url = reverse('report-detail', args=[report.id])
    response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK


def test_report_create(auth_client):
    """Should create a new report and automatically set the user."""
    user = auth_client.user
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

    response = auth_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED

    json = response.json()
    assert (
        json['data']['relationships']['user']['data']['id'] == str(user.id)
    )

    assert json['data']['relationships']['task']['data']['id'] == str(task.id)


def test_report_update_verified_as_non_staff_but_owner(auth_client):
    """Test that an owner (not staff) may not change a verified report."""
    user = auth_client.user
    report = ReportFactory.create(
        user=user, verified_by=user, duration=timedelta(hours=2)
    )

    url = reverse('report-detail', args=[report.id])

    data = {
        'data': {
            'type': 'reports',
            'id': report.id,
            'attributes': {
                'duration': '01:00:00',
            },
        }
    }

    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_report_update_owner(auth_client):
    """Should update an existing report."""
    user = auth_client.user
    report = ReportFactory.create(user=user)
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

    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert (
        json['data']['attributes']['comment'] ==
        data['data']['attributes']['comment']
    )
    assert (
        json['data']['attributes']['duration'] ==
        data['data']['attributes']['duration']
    )
    assert (
        json['data']['attributes']['date'] ==
        data['data']['attributes']['date']
    )
    assert (
        json['data']['relationships']['task']['data']['id'] ==
        str(data['data']['relationships']['task']['data']['id'])
    )


def test_report_update_date_staff(admin_client):
    report = ReportFactory.create()

    data = {
        'data': {
            'type': 'reports',
            'id': report.id,
            'attributes': {
                'date': '2017-02-04'
            },
        }
    }

    url = reverse('report-detail', args=[report.id])

    response = admin_client.patch(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_report_update_duration_staff(admin_client):
    report = ReportFactory.create(duration=timedelta(hours=2))

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

    res = admin_client.patch(url, data)
    assert res.status_code == status.HTTP_400_BAD_REQUEST


def test_report_update_not_staff_user(auth_client):
    """Updating of report belonging to different user is not allowed."""
    report = ReportFactory.create()
    data = {
        'data': {
            'type': 'reports',
            'id': report.id,
            'attributes': {
                'comment':  'foobar',
            },
        }
    }

    url = reverse('report-detail', args=[report.id])
    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_report_set_verified_by_not_staff_user(auth_client):
    """Not staff user may not set verified by."""
    user = auth_client.user
    report = ReportFactory.create(user=user)
    data = {
        'data': {
            'type': 'reports',
            'id': report.id,
            'relationships': {
                'verified-by': {
                    'data': {
                        'id': user.id,
                        'type': 'users'
                    }
                },
            }
        }
    }

    url = reverse('report-detail', args=[report.id])
    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_report_update_staff_user(admin_client):
    user = admin_client.user
    report = ReportFactory.create(user=user)

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
                        'id': user.id,
                        'type': 'users'
                    }
                },
            }
        }
    }

    url = reverse('report-detail', args=[report.id])

    response = admin_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK


def test_report_reset_verified_by_staff_user(admin_client):
    """Staff user may reset verified by on report."""
    user = admin_client.user
    report = ReportFactory.create(user=user, verified_by=user)

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

    url = reverse('report-detail', args=[report.id])
    response = admin_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK


def test_report_delete(auth_client):
    user = auth_client.user
    report = ReportFactory.create(user=user)

    url = reverse('report-detail', args=[report.id])
    response = auth_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_report_round_duration(db):
    """Should round the duration of a report to 15 minutes."""
    report = ReportFactory.create()

    report.duration = timedelta(hours=1, minutes=7)
    report.save()

    assert duration_string(report.duration) == '01:00:00'

    report.duration = timedelta(hours=1, minutes=8)
    report.save()

    assert duration_string(report.duration) == '01:15:00'

    report.duration = timedelta(hours=1, minutes=53)
    report.save()

    assert duration_string(report.duration) == '02:00:00'


def test_report_list_no_result(admin_client):
    url = reverse('report-list')
    res = admin_client.get(url)

    assert res.status_code == status.HTTP_200_OK
    json = res.json()
    assert json['meta']['total-time'] == '00:00:00'


def test_report_delete_superuser(superadmin_client):
    """Test that superuser may not delete reports of other users."""
    report = ReportFactory.create()
    url = reverse('report-detail', args=[report.id])

    response = superadmin_client.delete(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_report_list_filter_cost_center(auth_client):
    cost_center = CostCenterFactory.create()
    # 1st valid case: report with task of given cost center
    # but different project cost center
    task = TaskFactory.create(cost_center=cost_center)
    report_task = ReportFactory.create(task=task)
    # 2nd valid case: report with project of given cost center
    project = ProjectFactory.create(cost_center=cost_center)
    task = TaskFactory.create(cost_center=None, project=project)
    report_project = ReportFactory.create(task=task)
    # Invalid case: report without cost center
    project = ProjectFactory.create(cost_center=None)
    task = TaskFactory.create(cost_center=None, project=project)
    ReportFactory.create(task=task)

    url = reverse('report-list')

    res = auth_client.get(url, data={'cost_center': cost_center.id})
    assert res.status_code == status.HTTP_200_OK
    json = res.json()
    assert len(json['data']) == 2
    ids = {int(entry['id']) for entry in json['data']}
    assert {report_task.id, report_project.id} == ids


@pytest.mark.parametrize('file_type', ['csv', 'xlsx', 'ods'])
def test_report_export(auth_client, file_type, django_assert_num_queries):
    reports = ReportFactory.create_batch(2)

    url = reverse('report-export')

    with django_assert_num_queries(2):
        response = auth_client.get(url, data={'file_type': file_type})

    assert response.status_code == status.HTTP_200_OK
    book = pyexcel.get_book(
        file_content=response.content, file_type=file_type
    )
    # bookdict is a dict of tuples(name, content)
    sheet = book.bookdict.popitem()[1]
    assert len(sheet) == len(reports) + 1
