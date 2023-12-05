import pytest
from django.urls import reverse
from rest_framework import status

from timed.conftest import setup_customer_and_employment_status
from timed.employment.factories import AbsenceTypeFactory, EmploymentFactory


@pytest.mark.parametrize(
    "is_employed, is_customer_assignee, is_customer, expected",
    [
        (False, True, True, 0),
        (False, True, False, 0),
        (True, False, False, 2),
        (True, True, False, 2),
        (True, True, True, 2),
    ],
)
def test_absence_type_list(
    auth_client, is_employed, is_customer_assignee, is_customer, expected
):
    setup_customer_and_employment_status(
        user=auth_client.user,
        is_assignee=is_customer_assignee,
        is_customer=is_customer,
        is_employed=is_employed,
        is_external=False,
    )
    AbsenceTypeFactory.create_batch(2)
    url = reverse("absence-type-list")

    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert len(json["data"]) == expected


def test_absence_type_list_filter_fill_worktime(internal_employee_client):
    absence_type = AbsenceTypeFactory.create(fill_worktime=True)
    AbsenceTypeFactory.create()

    url = reverse("absence-type-list")

    response = internal_employee_client.get(url, data={"fill_worktime": 1})
    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert len(json["data"]) == 1
    assert json["data"][0]["id"] == str(absence_type.id)


@pytest.mark.parametrize(
    "is_employed, expected",
    [
        (True, status.HTTP_200_OK),
        (False, status.HTTP_404_NOT_FOUND),
    ],
)
def test_absence_type_detail(auth_client, is_employed, expected):
    absence_type = AbsenceTypeFactory.create()
    if is_employed:
        EmploymentFactory.create(user=auth_client.user)

    url = reverse("absence-type-detail", args=[absence_type.id])

    response = auth_client.get(url)

    assert response.status_code == expected


def test_absence_type_create(auth_client):
    url = reverse("absence-type-list")

    response = auth_client.post(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


def test_absence_type_update(auth_client):
    absence_type = AbsenceTypeFactory.create()

    url = reverse("absence-type-detail", args=[absence_type.id])

    response = auth_client.patch(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED


def test_absence_type_delete(auth_client):
    absence_type = AbsenceTypeFactory.create()

    url = reverse("absence-type-detail", args=[absence_type.id])

    response = auth_client.delete(url)
    assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED
