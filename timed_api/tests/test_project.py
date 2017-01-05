"""Tests for the projects endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED,
                                   HTTP_403_FORBIDDEN)

from timed.jsonapi_test_case import JSONAPITestCase
from timed_api.factories import ProjectFactory, TaskTemplateFactory
from timed_api.models import Task


class ProjectTests(JSONAPITestCase):
    """Tests for the project endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        self.projects = ProjectFactory.create_batch(10)

        ProjectFactory.create_batch(
            10,
            archived=True
        )

    def test_project_list(self):
        """Should respond with a list of projects."""
        url = reverse('project-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == len(self.projects)

    def test_project_detail(self):
        """Should respond with a single project."""
        project = self.projects[0]

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

    def test_project_create(self):
        """Should create a new project."""
        customer = self.projects[1].customer

        data = {
            'data': {
                'type': 'projects',
                'id': None,
                'attributes': {
                    'name': 'Test Project'
                },
                'relationships': {
                    'customer': {
                        'data': {
                            'type': 'customers',
                            'id': customer.id
                        }
                    }
                }
            }
        }

        url = reverse('project-list')

        noauth_res        = self.noauth_client.post(url, data)
        user_res          = self.client.post(url, data)
        project_admin_res = self.project_admin_client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_201_CREATED

        result = self.result(project_admin_res)

        assert (
            int(result['data']['relationships']['customer']['data']['id']) ==
            int(data['data']['relationships']['customer']['data']['id'])
        )

    def test_project_update(self):
        """Should update an existing project."""
        project  = self.projects[0]
        customer = self.projects[1].customer

        data = {
            'data': {
                'type': 'projects',
                'id': project.id,
                'attributes': {
                    'name': 'Test Project 2'
                },
                'relationships': {
                    'customer': {
                        'data': {
                            'type': 'customers',
                            'id': customer.id
                        }
                    }
                }
            }
        }

        url = reverse('project-detail', args=[
            project.id
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
            int(result['data']['relationships']['customer']['data']['id']) ==
            int(data['data']['relationships']['customer']['data']['id'])
        )

    def test_project_delete(self):
        """Should delete a project."""
        project = self.projects[0]

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res        = self.noauth_client.delete(url)
        user_res          = self.client.delete(url)
        project_admin_res = self.project_admin_client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_204_NO_CONTENT

    def test_project_default_tasks(self):
        """Should generate tasks based on task templates for a new project."""
        templates = TaskTemplateFactory.create_batch(5)
        project   = ProjectFactory.create()
        tasks     = Task.objects.filter(project=project)

        assert len(templates) == len(tasks)
