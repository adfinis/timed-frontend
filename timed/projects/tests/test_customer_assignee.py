from django.urls import reverse
from rest_framework.status import HTTP_200_OK

from timed.projects.factories import CustomerAssigneeFactory


def test_customer_assignee_list(internal_employee_client):
    customer_assignee = CustomerAssigneeFactory.create()
    url = reverse("customer-assignee-list")

    res = internal_employee_client.get(url)
    assert res.status_code == HTTP_200_OK
    json = res.json()
    assert len(json["data"]) == 1
    assert json["data"][0]["id"] == str(customer_assignee.id)
    assert json["data"][0]["relationships"]["customer"]["data"]["id"] == str(
        customer_assignee.customer.id
    )
