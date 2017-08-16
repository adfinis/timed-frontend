"""Tests for the customers endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.projects.factories import CustomerFactory


class CustomerTests(JSONAPITestCase):
    """Tests for the customer endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.customers = CustomerFactory.create_batch(10)

        CustomerFactory.create_batch(
            10,
            archived=True
        )

    def test_customer_list(self):
        """Should respond with a list of customers."""
        url = reverse('customer-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url, data={'archived': False})

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.customers)

    def test_customer_detail(self):
        """Should respond with a single customer."""
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_customer_create(self):
        """Should not be able to create a new customer."""
        url = reverse('customer-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_customer_update(self):
        """Should not be able to update an existing customer."""
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_customer_delete(self):
        """Should not be able delete a customer."""
        customer = self.customers[0]

        url = reverse('customer-detail', args=[
            customer.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
