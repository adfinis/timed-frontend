from django.urls import reverse
from rest_framework.status import HTTP_200_OK

from timed.projects.factories import ProjectAssigneeFactory


def test_project_assignee_list(internal_employee_client):
    project_assignee = ProjectAssigneeFactory.create()
    url = reverse("project-assignee-list")

    res = internal_employee_client.get(url)
    assert res.status_code == HTTP_200_OK
    json = res.json()
    assert len(json["data"]) == 1
    assert json["data"][0]["id"] == str(project_assignee.id)
    assert json["data"][0]["relationships"]["project"]["data"]["id"] == str(
        project_assignee.project.id
    )
