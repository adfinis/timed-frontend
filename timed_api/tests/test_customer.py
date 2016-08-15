from timed.jsonapi_test_case    import JSONAPITestCase
from django.core.urlresolvers   import reverse
from timed_api.factories        import CustomerFactory
from rest_framework             import status


class CustomerTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        self.customers = CustomerFactory.create_batch(10)

        CustomerFactory.create_batch(
            10,
            archived=True
        )

    def test_customer_list(self):
        url = reverse('customer-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)
        admin_res  = self.admin_client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertEqual(len(result['data']), len(self.customers))

        self.assertIn('id',       result['data'][0])
        self.assertIn('name',     result['data'][0]['attributes'])
        self.assertIn('email',    result['data'][0]['attributes'])
        self.assertIn('website',  result['data'][0]['attributes'])
        self.assertIn('comment',  result['data'][0]['attributes'])
        self.assertIn('projects', result['data'][0]['relationships'])

    def test_customer_detail(self):
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)
        admin_res  = self.admin_client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)
        self.assertEqual(admin_res.status_code,  status.HTTP_200_OK)

        result = self.result(admin_res)

        self.assertIn('id',       result['data'])
        self.assertIn('name',     result['data']['attributes'])
        self.assertIn('email',    result['data']['attributes'])
        self.assertIn('website',  result['data']['attributes'])
        self.assertIn('comment',  result['data']['attributes'])
        self.assertIn('projects', result['data']['relationships'])

    def test_customer_create(self):
        data = {
            'data': {
                'type': 'customers',
                'id': None,
                'attributes': {
                    'name': 'Test customer',
                    'email': 'foo@bar.ch'
                }
            }
        }

        url = reverse('customer-list')

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
            result['data']['attributes']['email'],
            data['data']['attributes']['email']
        )

    def test_customer_update(self):
        customer  = self.customers[0]

        data = {
            'data': {
                'type': 'customers',
                'id': customer.id,
                'attributes': {
                    'name': 'Test customer',
                    'email': 'foo@bar.ch'
                }
            }
        }

        url = reverse('customer-detail', args=[
            customer.id
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
            result['data']['attributes']['email'],
            data['data']['attributes']['email']
        )

    def test_customer_delete(self):
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res = self.noauth_client.delete(url)
        user_res   = self.client.delete(url)
        admin_res  = self.admin_client.delete(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_403_FORBIDDEN)
        self.assertEqual(admin_res.status_code,  status.HTTP_204_NO_CONTENT)
