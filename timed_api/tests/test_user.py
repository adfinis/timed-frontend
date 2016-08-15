from timed.jsonapi_test_case    import JSONAPITestCase
from django.core.urlresolvers   import reverse
from timed_api.factories        import UserFactory
from rest_framework             import status


class UserTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        self.users = UserFactory.create_batch(10)

    def test_user_list(self):
        url = reverse('user-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)
        admin_res  = self.admin_client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertEqual(len(result['data']), len(self.users) + 2)

        self.assertIn('id',          result['data'][0])
        self.assertIn('username',    result['data'][0]['attributes'])
        self.assertIn('first-name',  result['data'][0]['attributes'])
        self.assertIn('last-name',   result['data'][0]['attributes'])
        self.assertIn('projects',    result['data'][0]['relationships'])
        self.assertIn('attendances', result['data'][0]['relationships'])
        self.assertIn('activities',  result['data'][0]['relationships'])
        self.assertIn('reports',     result['data'][0]['relationships'])

    def test_user_detail(self):
        user = self.users[0]

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)
        admin_res  = self.admin_client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertIn('id',          result['data'])
        self.assertIn('username',    result['data']['attributes'])
        self.assertIn('first-name',  result['data']['attributes'])
        self.assertIn('last-name',   result['data']['attributes'])
        self.assertIn('projects',    result['data']['relationships'])
        self.assertIn('attendances', result['data']['relationships'])
        self.assertIn('activities',  result['data']['relationships'])
        self.assertIn('reports',     result['data']['relationships'])

    def test_user_create(self):
        data = {}
        url  = reverse('user-list')

        noauth_res = self.noauth_client.post(url, data)
        user_res   = self.client.post(url, data)
        admin_res  = self.admin_client.post(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_403_FORBIDDEN)

    def test_user_update(self):
        user = self.users[1]
        data = {}

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        user_res   = self.client.patch(url, data)
        admin_res  = self.admin_client.patch(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_403_FORBIDDEN)

    def test_user_delete(self):
        user = self.users[1]
        data = {}

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.delete(url, data)
        user_res   = self.client.delete(url, data)
        admin_res  = self.admin_client.delete(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_403_FORBIDDEN)
