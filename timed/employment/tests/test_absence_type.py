"""Tests for the absence types endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import AbsenceTypeFactory
from timed.jsonapi_test_case import JSONAPITestCase


class AbsenceTypeTests(JSONAPITestCase):
    """Tests for the absence types endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.absence_types = AbsenceTypeFactory.create_batch(5)

    def test_absence_type_list(self):
        """Should respond with a list of absence types."""
        url = reverse('absence-type-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.absence_types)

    def test_absence_type_detail(self):
        """Should respond with a single absence type."""
        absence_type = self.absence_types[0]

        url = reverse('absence-type-detail', args=[
            absence_type.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_absence_type_create(self):
        """Should not be able to create a new absence type."""
        url = reverse('absence-type-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_absence_type_update(self):
        """Should not be able to update an existing absence type."""
        absence_type = self.absence_types[0]

        url = reverse('absence-type-detail', args=[
            absence_type.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_absence_type_delete(self):
        """Should not be able delete an absence type."""
        absence_type = self.absence_types[0]

        url = reverse('absence-type-detail', args=[
            absence_type.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
