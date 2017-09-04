"""Tests for the projects endpoint."""
from datetime import timedelta

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.projects.factories import ProjectFactory, TaskFactory
from timed.tracking.factories import ReportFactory


class ProjectTests(JSONAPITestCase):
    """Tests for the project endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.project = ProjectFactory.create()

        ProjectFactory.create_batch(
            10,
            archived=True
        )

    def test_project_list(self):
        """Should respond with a list of projects."""
        task = TaskFactory.create(project=self.project)
        ReportFactory.create_batch(10, task=task, duration=timedelta(hours=1))

        url = reverse('project-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url, data={'archived': 0})

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == 1
        assert result['data'][0]['attributes']['spent-hours'] == (
            '10:00:00'
        )

    def test_project_detail(self):
        """Should respond with a single project."""
        url = reverse('project-detail', args=[
            self.project.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_project_create(self):
        """Should not be able to create a new project."""
        url = reverse('project-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_project_update(self):
        """Should not be able to update an existing project."""
        url = reverse('project-detail', args=[
            self.project.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_project_delete(self):
        """Should not be able to delete a project."""
        url = reverse('project-detail', args=[
            self.project.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
