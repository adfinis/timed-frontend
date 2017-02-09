"""Tests for the tasks endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED,
                                   HTTP_403_FORBIDDEN)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.projects.factories import TaskFactory


class TaskTests(JSONAPITestCase):
    """Tests for the tasks endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        self.tasks = TaskFactory.create_batch(5)

    def test_task_list(self):
        """Should respond with a list of tasks."""
        url = reverse('task-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == len(self.tasks)

        assert 'id' in result['data'][0]
        assert 'name' in result['data'][0]['attributes']
        assert 'project' in result['data'][0]['relationships']

    def test_task_detail(self):
        """Should respond with a single task."""
        task = self.tasks[0]

        url = reverse('task-detail', args=[
            task.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert 'id' in result['data']
        assert 'name' in result['data']['attributes']
        assert 'project' in result['data']['relationships']

    def test_task_create(self):
        """Should create a new task."""
        project = self.tasks[0].project

        data = {
            'data': {
                'type': 'tasks',
                'id': None,
                'attributes': {
                    'name': 'Test Task',
                    'estimated-hours': 200,
                    'archived': False
                },
                'relationships': {
                    'project': {
                        'data': {
                            'type': 'projects',
                            'id': project.id
                        }
                    }
                }
            }
        }

        url = reverse('task-list')

        noauth_res        = self.noauth_client.post(url, data)
        user_res          = self.client.post(url, data)
        project_admin_res = self.project_admin_client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_201_CREATED

        result = self.result(project_admin_res)

        assert not result['data']['id'] is None

        assert (
            result['data']['attributes']['name'] ==
            data['data']['attributes']['name']
        )
        assert (
            int(result['data']['relationships']['project']['data']['id']) ==
            int(data['data']['relationships']['project']['data']['id'])
        )

    def test_task_update(self):
        """Should update an exisiting task."""
        task = self.tasks[0]
        project = self.tasks[1].project

        data = {
            'data': {
                'type': 'tasks',
                'id': task.id,
                'attributes': {
                    'name': 'Test Task updated'
                },
                'relationships': {
                    'project': {
                        'data': {
                            'type': 'projects',
                            'id': project.id
                        }
                    }
                }
            }
        }

        url = reverse('task-detail', args=[
            task.id
        ])

        noauth_res        = self.noauth_client.patch(url, data)
        user_res          = self.client.patch(url, data)
        project_admin_res = self.project_admin_client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_200_OK

        result = self.result(project_admin_res)

        assert (
            result['data']['attributes']['name'] ==
            data['data']['attributes']['name']
        )
        assert (
            int(result['data']['relationships']['project']['data']['id']) ==
            int(data['data']['relationships']['project']['data']['id'])
        )

    def test_task_delete(self):
        """Should delete a task."""
        task = self.tasks[0]

        url = reverse('task-detail', args=[
            task.id
        ])

        noauth_res        = self.noauth_client.delete(url)
        user_res          = self.client.delete(url)
        project_admin_res = self.project_admin_client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_204_NO_CONTENT
