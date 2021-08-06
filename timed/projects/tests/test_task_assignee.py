from django.urls import reverse
from rest_framework.status import HTTP_200_OK

from timed.projects.factories import TaskAssigneeFactory


def test_task_assignee_list(internal_employee_client):
    task_assignee = TaskAssigneeFactory.create()
    url = reverse("task-assignee-list")

    res = internal_employee_client.get(url)
    assert res.status_code == HTTP_200_OK
    json = res.json()
    assert len(json["data"]) == 1
    assert json["data"][0]["id"] == str(task_assignee.id)
    assert json["data"][0]["relationships"]["task"]["data"]["id"] == str(
        task_assignee.task.id
    )
