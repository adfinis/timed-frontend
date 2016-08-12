from rest_framework.test         import APITestCase, APIClient
from django.contrib.auth.models  import User
from django.core.urlresolvers    import reverse
from rest_framework              import status
from rest_framework_jwt.settings import api_settings

import json


class JSONAPIClient(APIClient):

    def __init__(self, *args, **kwargs):
        super(JSONAPIClient, self).__init__(*args, **kwargs)

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

        return False


class JSONAPITestCase(APITestCase):

    def setUp(self):
        super(JSONAPITestCase, self).setUp()

        self.user = User.objects.create_user(
            username='tester',
            password='123qweasd',
            is_staff=True,
            is_superuser=True
        )

        self.noauth_client = JSONAPIClient()
        self.client        = JSONAPIClient()

        self.client.login('tester', '123qweasd')

    def result(self, response):
        return json.loads(response.content.decode('utf8'))
