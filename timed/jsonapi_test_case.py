from rest_framework.test import APITestCase, APIClient

import json


class JSONAPIClient(APIClient):

    def __init__(self, *args, **kwargs):
        super(JSONAPIClient, self).__init__(*args, **kwargs)

        self._content_type = 'application/vnd.api+json'

    def _parse_data(self, data):
        return json.dumps(data) if data else data

    def get(self, path, data=None, **extra):
        return super(JSONAPIClient, self).get(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def post(self, path, data=None, **extra):
        return super(JSONAPIClient, self).post(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def delete(self, path, data=None, **extra):
        return super(JSONAPIClient, self).delete(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )

    def patch(self, path, data=None, **extra):
        return super(JSONAPIClient, self).patch(
            path=path,
            data=self._parse_data(data),
            content_type=self._content_type,
            **extra
        )


class JSONAPITestCase(APITestCase):

    def setUp(self):
        super(JSONAPITestCase, self).setUp()

        self.client = JSONAPIClient()

    def result(self, response):
        return json.loads(response.content.decode('utf8'))
