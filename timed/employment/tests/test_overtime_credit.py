"""Tests for the overtime credits endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import OvertimeCreditFactory
from timed.jsonapi_test_case import JSONAPITestCase


class OvertimeCreditTests(JSONAPITestCase):
    """Tests for the overtime credits endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        self.overtime_credits = OvertimeCreditFactory.create_batch(
            5,
            user=self.user
        )

        OvertimeCreditFactory.create_batch(5)

    def test_overtime_credit_list(self):
        """Should respond with a list of overtime credits."""
        url = reverse('overtime-credit-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.overtime_credits)

    def test_overtime_credit_detail(self):
        """Should respond with a single overtime credit."""
        overtime_credit = self.overtime_credits[0]

        url = reverse('overtime-credit-detail', args=[
            overtime_credit.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_overtime_credit_create(self):
        """Should not be able to create a new overtime credit."""
        url = reverse('overtime-credit-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_overtime_credit_update(self):
        """Should not be able to update an existing overtime credit."""
        overtime_credit = self.overtime_credits[0]

        url = reverse('overtime-credit-detail', args=[
            overtime_credit.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_overtime_credit_delete(self):
        """Should not be able delete an overtime credit."""
        overtime_credit = self.overtime_credits[0]

        url = reverse('overtime-credit-detail', args=[
            overtime_credit.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED
