"""Tests for the locations endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import LocationFactory
from timed.jsonapi_test_case import JSONAPITestCase


class LocationTests(JSONAPITestCase):
    """Tests for the location endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.locations = LocationFactory.create_batch(3)

    def test_location_list(self):
        """Should respond with a list of locations."""
        url = reverse('location-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.locations)

    def test_location_detail(self):
        """Should respond with a single location."""
        location = self.locations[0]

        url = reverse('location-detail', args=[
            location.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_location_create(self):
        """Should not be able to create a new location."""
        url = reverse('location-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_location_update(self):
        """Should not be able to update an existing location."""
        location = self.locations[0]

        url = reverse('location-detail', args=[
            location.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_location_delete(self):
        """Should not be able delete a location."""
        location = self.locations[0]

        url = reverse('location-detail', args=[
            location.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
