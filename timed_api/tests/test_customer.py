from timed.jsonapi_test_case  import JSONAPITestCase
from django.core.urlresolvers import reverse
from timed_api.factories      import CustomerFactory

from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN
)


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

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == len(self.customers)

    def test_customer_detail(self):
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

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

        noauth_res        = self.noauth_client.post(url, data)
        user_res          = self.client.post(url, data)
        project_admin_res = self.project_admin_client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_201_CREATED

    def test_customer_update(self):
        customer  = self.customers[0]

        data = {
            'data': {
                'type': 'customers',
                'id': customer.id,
                'attributes': {
                    'name': 'Test customer 2'
                }
            }
        }

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res        = self.noauth_client.patch(url, data)
        user_res          = self.client.patch(url, data)
        project_admin_res = self.project_admin_client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_200_OK

        result = self.result(project_admin_res)

        assert (
            result['data']['attributes']['name'] ==
            data['data']['attributes']['name']
        )

    def test_customer_delete(self):
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res        = self.noauth_client.delete(url)
        user_res          = self.client.delete(url)
        project_admin_res = self.project_admin_client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_403_FORBIDDEN
        assert project_admin_res.status_code == HTTP_204_NO_CONTENT
