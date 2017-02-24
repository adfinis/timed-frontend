"""Tests for the locations endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_404_NOT_FOUND,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import UserFactory
from timed.jsonapi_test_case import JSONAPITestCase


class UserTests(JSONAPITestCase):
    """Tests for the user endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        self.users = UserFactory.create_batch(3)

    def test_user_list(self):
        """Should respond with a list of one user: the currently logged in."""
        url = reverse('user-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == 1
        assert int(result['data'][0]['id']) == self.user.id

    def test_logged_in_user_detail(self):
        """Should respond with a single user.

        This should only work if it is the currently logged in user.
        """
        url = reverse('user-detail', args=[
            self.user.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_not_logged_in_user_detail(self):
        """Should throw a 404 since we don't request the logged in user."""
        url = reverse('user-detail', args=[
            self.users[0].id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_404_NOT_FOUND

    def test_user_create(self):
        """Should not be able to create a new user."""
        url = reverse('user-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_user_update(self):
        """Should not be able to update an existing user."""
        user = self.users[0]

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_user_delete(self):
        """Should not be able delete a user."""
        user = self.users[0]

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
