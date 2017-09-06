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

        self.projects = ProjectFactory.create_batch(10)

        ProjectFactory.create_batch(
            10,
            archived=True
        )

    def test_project_list(self):
        """Should respond with a list of projects."""
        url = reverse('project-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url, data={'archived': 0})

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.projects)

    def test_project_create(self):
        """Should not be able to create a new project."""
        url = reverse('project-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_project_update(self):
        """Should not be able to update an existing project."""
        project  = self.projects[0]

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_project_delete(self):
        """Should not be able to delete a project."""
        project = self.projects[0]

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED


def test_project_detail_no_auth(client):
    project = ProjectFactory.create()

    url = reverse('project-detail', args=[
        project.id
    ])

    res = client.get(url)
    assert res.status_code == HTTP_401_UNAUTHORIZED


def test_project_detail_no_reports(auth_client):
    project = ProjectFactory.create()

    url = reverse('project-detail', args=[
        project.id
    ])

    res = auth_client.get(url)

    assert res.status_code == HTTP_200_OK
    json = res.json()

    assert json['meta']['spent-time'] == '00:00:00'


def test_project_detail_with_reports(auth_client):
    project = ProjectFactory.create()
    task = TaskFactory.create(project=project)
    ReportFactory.create_batch(10, task=task, duration=timedelta(hours=1))

    url = reverse('project-detail', args=[
        project.id
    ])

    res = auth_client.get(url)

    assert res.status_code == HTTP_200_OK
    json = res.json()

    assert json['meta']['spent-time'] == '10:00:00'
