"""Tests for the tasks endpoint."""
from datetime import date, timedelta

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.projects.factories import TaskFactory
from timed.tracking.factories import ReportFactory


class TaskTests(JSONAPITestCase):
    """Tests for the tasks endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.tasks = TaskFactory.create_batch(5)

        TaskFactory.create_batch(5, archived=True)

    def test_task_list(self):
        """Should respond with a list of tasks."""
        url = reverse('task-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.tasks)

        assert 'id' in result['data'][0]
        assert 'name' in result['data'][0]['attributes']
        assert 'project' in result['data'][0]['relationships']

    def test_task_my_most_frequent(self):
        """Should respond with a list of my most frequent tasks."""
        report_date = date.today() - timedelta(days=20)
        old_report_date = date.today() - timedelta(days=90)

        # tasks[0] should appear as most frequently used task
        ReportFactory.create_batch(
            5, date=report_date, user=self.user, task=self.tasks[0]
        )
        # tasks[1] should appear as secondly most frequently used task
        ReportFactory.create_batch(
            4, date=report_date, user=self.user, task=self.tasks[1]
        )
        # tasks[2] should not appear in result, as too far in the past
        ReportFactory.create_batch(
            4, date=old_report_date, user=self.user, task=self.tasks[2]
        )

        url = reverse('task-list')

        res = self.client.get(url, {'my_most_frequent': '10'})
        assert res.status_code == HTTP_200_OK

        result = self.result(res)
        data = result['data']
        assert len(data) == 2
        assert data[0]['id'] == str(self.tasks[0].id)
        assert data[1]['id'] == str(self.tasks[1].id)

    def test_task_detail(self):
        """Should respond with a single task."""
        task = self.tasks[0]

        url = reverse('task-detail', args=[
            task.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert 'id' in result['data']
        assert 'name' in result['data']['attributes']
        assert 'project' in result['data']['relationships']

    def test_task_create(self):
        """Should not be able to create a task."""
        url = reverse('task-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_task_update(self):
        """Should not be able to update an exisiting task."""
        task = self.tasks[0]

        url = reverse('task-detail', args=[
            task.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_task_delete(self):
        """Should not be able delete a task."""
        task = self.tasks[0]

        url = reverse('task-detail', args=[
            task.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
