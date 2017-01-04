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

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self._content_type = 'application/vnd.api+json'

    def _parse_data(self, data):
        return json.dumps(data) if data else data

    def get(self, path, data=None, **extra):
        return super().get(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def post(self, path, data=None, **extra):
        return super().post(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def delete(self, path, data=None, **extra):
        return super().delete(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def patch(self, path, data=None, **extra):
        return super().patch(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def login(self, username, password):
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

        if response.status_code == status.HTTP_200_OK:
            self.credentials(
                HTTP_AUTHORIZATION='{} {}'.format(
                    api_settings.JWT_AUTH_HEADER_PREFIX,
                    response.data['token']
                )
            )

            return True

        return False  # pragma: no cover


class JSONAPITestCase(APITestCase):

    def get_system_admin_group_permissions(self):
        return Permission.objects.filter(codename__in=[
            'add_tasktemplate',
            'change_tasktemplate',
            'delete_tasktemplate',
        ])

    def get_project_admin_group_permissions(self):
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

    def get_user_group_permissions(self):
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

    def create_groups(self):
        system_admin_group  = Group.objects.create(name='System Admin')
        project_admin_group = Group.objects.create(name='Project Admin')
        user_group          = Group.objects.create(name='User')

        system_admin_perms  = self.get_system_admin_group_permissions()
        project_admin_perms = self.get_project_admin_group_permissions()
        user_perms          = self.get_user_group_permissions()

        system_admin_group.permissions.add(*system_admin_perms)
        project_admin_group.permissions.add(*project_admin_perms)
        user_group.permissions.add(*user_perms)

        system_admin_group.save()
        project_admin_group.save()
        user_group.save()

    def create_users(self):
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
        super().setUp()

        self.create_groups()
        self.create_users()

        self.noauth_client = JSONAPIClient()

        self.system_admin_client = JSONAPIClient()
        self.system_admin_client.login('system_admin', '123qweasd')

        self.project_admin_client = JSONAPIClient()
        self.project_admin_client.login('project_admin', '123qweasd')

        self.client = JSONAPIClient()
        self.client.login('user', '123qweasd')

    def result(self, response):
        return json.loads(response.content.decode('utf8'))
