"""Helpers for testing with JSONAPI."""

from rest_framework.test         import APITestCase, APIClient
from django.contrib.auth.models  import User, Group, Permission
from django.core.urlresolvers    import reverse
from rest_framework              import status
from rest_framework_jwt.settings import api_settings

import json
import logging

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
            data=self._parse_data(data),
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
            'data': {
                'type': 'obtain-json-web-tokens',
                'id': None,
                'attributes': {
                    'username': username,
                    'password': password
                }
            }
        }

        response = self.post(reverse('login'), data)

        if response.status_code != status.HTTP_200_OK:
            raise Exception("Wrong credentials!")

        self.credentials(
            HTTP_AUTHORIZATION='{} {}'.format(
                api_settings.JWT_AUTH_HEADER_PREFIX,
                response.data['token']
            )
        )


class JSONAPITestCase(APITestCase):
    """Base test case for testing the timed API."""

    def _get_system_admin_group_permissions(self):
        return Permission.objects.filter(codename__in=[
            'add_tasktemplate',
            'change_tasktemplate',
            'delete_tasktemplate',
        ])

    def _get_project_admin_group_permissions(self):
        return Permission.objects.filter(codename__in=[
            'add_customer',
            'change_customer',
            'delete_customer',
            'add_project',
            'change_project',
            'delete_project',
            'add_task',
            'change_task',
            'delete_task',
        ])

    def _get_user_group_permissions(self):
        return Permission.objects.filter(codename__in=[
            'add_activity',
            'change_activity',
            'delete_activity',
            'add_activityblock',
            'change_activityblock',
            'delete_activityblock',
            'add_attendance',
            'change_attendance',
            'delete_attendance',
            'add_report',
            'change_report',
            'delete_report',
        ])

    def _create_groups(self):
        system_admin_group  = Group.objects.create(name='System Admin')
        project_admin_group = Group.objects.create(name='Project Admin')
        user_group          = Group.objects.create(name='User')

        system_admin_perms  = self._get_system_admin_group_permissions()
        project_admin_perms = self._get_project_admin_group_permissions()
        user_perms          = self._get_user_group_permissions()

        system_admin_group.permissions.add(*system_admin_perms)
        project_admin_group.permissions.add(*project_admin_perms)
        user_group.permissions.add(*user_perms)

        system_admin_group.save()
        project_admin_group.save()
        user_group.save()

    def _create_users(self):
        self.system_admin_user = User.objects.create_user(
            username='system_admin',
            password='123qweasd'
        )

        self.project_admin_user = User.objects.create_user(
            username='project_admin',
            password='123qweasd'
        )

        self.user = User.objects.create_user(
            username='user',
            password='123qweasd'
        )

        self.system_admin_user.groups.add(*Group.objects.filter(name__in=[
            'System Admin',
            'Project Admin',
            'User'
        ]))

        self.project_admin_user.groups.add(*Group.objects.filter(name__in=[
            'Project Admin',
            'User'
        ]))

        self.user.groups.add(*Group.objects.filter(name__in=[
            'User'
        ]))

    def setUp(self):
        """Setup the clients for testing."""
        super().setUp()

        self._create_groups()
        self._create_users()

        self.system_admin_client = JSONAPIClient()
        self.system_admin_client.login('system_admin', '123qweasd')

        self.project_admin_client = JSONAPIClient()
        self.project_admin_client.login('project_admin', '123qweasd')

        self.client = JSONAPIClient()
        self.client.login('user', '123qweasd')

        self.noauth_client = JSONAPIClient()

    def result(self, response):
        """Convert the response data to JSON."""
        return json.loads(response.content.decode('utf8'))
