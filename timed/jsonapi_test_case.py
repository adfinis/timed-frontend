"""Helpers for testing with JSONAPI."""

import json
import logging

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_jwt.settings import api_settings

logging.getLogger('factory').setLevel(logging.WARN)
logging.getLogger('django_auth_ldap').setLevel(logging.WARN)


class JSONAPIClient(APIClient):
    """Base API client for testing CRUD methods with JSONAPI format."""

    def __init__(self, *args, **kwargs):
        """Initialize the API client."""
        super().__init__(*args, **kwargs)

        self._content_type = 'application/vnd.api+json'

    def _parse_data(self, data):
        return json.dumps(data) if data else data

    def get(self, path, data=None, **kwargs):
        """Patched GET method to enforce JSONAPI format.

        :param str  path: The URL to call
        :param dict data: The data of the request
        """
        return super().get(
            path=path,
            data=data,
            content_type=self._content_type,
            **kwargs
        )

    def post(self, path, data=None, **kwargs):
        """Patched POST method to enforce JSONAPI format.

        :param str  path: The URL to call
        :param dict data: The data of the request
        """
        return super().post(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **kwargs
        )

    def delete(self, path, data=None, **kwargs):
        """Patched DELETE method to enforce JSONAPI format.

        :param str  path: The URL to call
        :param dict data: The data of the request
        """
        return super().delete(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **kwargs
        )

    def patch(self, path, data=None, **kwargs):
        """Patched PATCH method to enforce JSONAPI format.

        :param str  path: The URL to call
        :param dict data: The data of the request
        """
        return super().patch(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **kwargs
        )

    def login(self, username, password):
        """Authenticate a user.

        :param str username: Username of the user
        :param str password: Password of the user
        :raises:             Exception
        """
        data = {
            'username': username,
            'password': password
        }

        response = super().post(reverse('login'), data)

        if response.status_code != status.HTTP_200_OK:
            raise Exception('Wrong credentials!')  # pragma: no cover

        self.credentials(
            HTTP_AUTHORIZATION='{0} {1}'.format(
                api_settings.JWT_AUTH_HEADER_PREFIX,
                response.data['token']
            )
        )


class JSONAPITestCase(APITestCase):
    """Base test case for testing the timed API."""

    def setUp(self):
        """Set the clients for testing up."""
        super().setUp()

        self.user = User.objects.create_user(
            username='user',
            password='123qweasd'
        )

        self.client = JSONAPIClient()
        self.client.login('user', '123qweasd')

        self.noauth_client = JSONAPIClient()

    def result(self, response):
        """Convert the response data to JSON."""
        return json.loads(response.content.decode('utf8'))
