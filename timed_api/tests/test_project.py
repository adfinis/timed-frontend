from timed.jsonapi_test_case    import JSONAPITestCase
from django.core.urlresolvers   import reverse
from timed_api.factories        import ProjectFactory
from rest_framework             import status


class ProjectTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        self.projects = ProjectFactory.create_batch(10)

        ProjectFactory.create_batch(
            10,
            archived=True
        )

    def test_project_list(self):
        url = reverse('project-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)
        admin_res  = self.admin_client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertEqual(len(result['data']), len(self.projects))

        self.assertIn('id',              result['data'][0])
        self.assertIn('name',            result['data'][0]['attributes'])
        self.assertIn('comment',         result['data'][0]['attributes'])
        self.assertIn('tracker-type',    result['data'][0]['attributes'])
        self.assertIn('tracker-name',    result['data'][0]['attributes'])
        self.assertIn('tracker-api-key', result['data'][0]['attributes'])
        self.assertIn('customer',        result['data'][0]['relationships'])
        self.assertIn('leaders',         result['data'][0]['relationships'])

    def test_project_detail(self):
        project = self.projects[0]

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)
        admin_res  = self.admin_client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertIn('id',              result['data'])
        self.assertIn('name',            result['data']['attributes'])
        self.assertIn('comment',         result['data']['attributes'])
        self.assertIn('tracker-type',    result['data']['attributes'])
        self.assertIn('tracker-name',    result['data']['attributes'])
        self.assertIn('tracker-api-key', result['data']['attributes'])
        self.assertIn('customer',        result['data']['relationships'])
        self.assertIn('leaders',         result['data']['relationships'])

    def test_project_create(self):
        customer = self.projects[1].customer

        data = {
            'data': {
                'type': 'projects',
                'id': None,
                'attributes': {
                    'name': 'Test Project'
                },
                'relationships': {
                    'customer': {
                        'data': {
                            'type': 'customers',
                            'id': str(customer.id)
                        }
                    }
                }
            }
        }

        url = reverse('project-list')

        noauth_res = self.noauth_client.post(url, data)
        user_res   = self.client.post(url, data)
        admin_res  = self.admin_client.post(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_201_CREATED)

        result = self.result(admin_res)

        self.assertIsNotNone(result['data']['id'])

        self.assertEqual(
            result['data']['attributes']['name'],
            data['data']['attributes']['name']
        )

        self.assertEqual(
            result['data']['relationships']['customer']['data']['id'],
            data['data']['relationships']['customer']['data']['id']
        )

    def test_project_update(self):
        project  = self.projects[0]
        customer = self.projects[1].customer

        data = {
            'data': {
                'type': 'projects',
                'id': project.id,
                'attributes': {
                    'name': 'Test Project'
                },
                'relationships': {
                    'customer': {
                        'data': {
                            'type': 'customers',
                            'id': str(customer.id)
                        }
                    }
                }
            }
        }

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        user_res   = self.client.patch(url, data)
        admin_res  = self.admin_client.patch(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertEqual(
            result['data']['attributes']['name'],
            data['data']['attributes']['name']
        )

        self.assertEqual(
            result['data']['relationships']['customer']['data']['id'],
            data['data']['relationships']['customer']['data']['id']
        )

    def test_project_delete(self):
        project = self.projects[0]

        url = reverse('project-detail', args=[
            project.id
        ])

        noauth_res = self.noauth_client.delete(url)
        user_res   = self.client.delete(url)
        admin_res  = self.admin_client.delete(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_204_NO_CONTENT)
