"""Tests for the absence credits endpoint."""

from datetime import timedelta

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import AbsenceCreditFactory
from timed.jsonapi_test_case import JSONAPITestCase
from timed.tracking.factories import ReportFactory


class AbsenceCreditTests(JSONAPITestCase):
    """Tests for the absence credits endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.absence_credits = AbsenceCreditFactory.create_batch(
            5,
            user=self.user
        )

        AbsenceCreditFactory.create_batch(5)

    def test_absence_credit_list(self):
        """Should respond with a list of absence credits."""
        url = reverse('absence-credit-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.absence_credits)

    def test_absence_credit_detail(self):
        """Should respond with a single absence credit."""
        absence_credit = self.absence_credits[0]

        url = reverse('absence-credit-detail', args=[
            absence_credit.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_absence_credit_create(self):
        """Should not be able to create a new absence credit."""
        url = reverse('absence-credit-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_absence_credit_update(self):
        """Should not be able to update an existing absence credit."""
        absence_credit = self.absence_credits[0]

        url = reverse('absence-credit-detail', args=[
            absence_credit.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_absence_credit_delete(self):
        """Should not be able delete an absence credit."""
        absence_credit = self.absence_credits[0]

        url = reverse('absence-credit-detail', args=[
            absence_credit.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_absence_credit_balance(self):
        """Should calculate an absence credit balance."""
        absence_credit = AbsenceCreditFactory.create(
            user=self.user,
            duration=timedelta(hours=30)
        )

        ReportFactory.create_batch(
            2,
            user=self.user,
            absence_type=absence_credit.absence_type,
            date=absence_credit.date + timedelta(days=1),
            duration=timedelta(hours=8)
        )

        ReportFactory.create(
            user=self.user,
            absence_type=absence_credit.absence_type,
            date=absence_credit.date - timedelta(days=1),
            duration=timedelta(hours=8)
        )

        url = reverse('absence-credit-detail', args=[
            absence_credit.id
        ])

        res    = self.client.get(url)
        result = self.result(res)

        assert result['data']['attributes']['duration'] == '1 06:00:00'
        assert result['data']['attributes']['used'] == '16:00:00'
        assert result['data']['attributes']['balance'] == '14:00:00'

    def test_absence_credit_balance_no_duration(self):
        """Should not calculate an absence credit balance."""
        absence_credit = AbsenceCreditFactory.create(
            user=self.user,
            duration=None
        )

        ReportFactory.create(
            user=self.user,
            absence_type=absence_credit.absence_type,
            date=absence_credit.date + timedelta(days=1),
            duration=timedelta(hours=8)
        )

        url = reverse('absence-credit-detail', args=[
            absence_credit.id
        ])

        res    = self.client.get(url)
        result = self.result(res)

        assert result['data']['attributes']['duration'] is None
        assert result['data']['attributes']['used'] == '08:00:00'
        assert result['data']['attributes']['balance'] is None

    def test_absence_credit_balance_until(self):
        """Should calculate a correct absence credit balance."""
        absence_credit = AbsenceCreditFactory.create(
            user=self.user,
            duration=timedelta(hours=30)
        )

        ReportFactory.create_batch(
            2,
            user=self.user,
            absence_type=absence_credit.absence_type,
            date=absence_credit.date + timedelta(days=1),
            duration=timedelta(hours=8)
        )

        ReportFactory.create(
            user=self.user,
            absence_type=absence_credit.absence_type,
            date=absence_credit.date - timedelta(days=1),
            duration=timedelta(hours=8)
        )

        ReportFactory.create(
            user=self.user,
            absence_type=absence_credit.absence_type,
            date=absence_credit.date + timedelta(days=2),
            duration=timedelta(hours=8)
        )

        url = reverse('absence-credit-detail', args=[
            absence_credit.id
        ])

        res = self.client.get('{0}?until={1}'.format(
            url,
            (absence_credit.date + timedelta(days=1)).strftime('%Y-%m-%d')
        ))

        result = self.result(res)

        assert result['data']['attributes']['duration'] == '1 06:00:00'
        assert result['data']['attributes']['used'] == '16:00:00'
        assert result['data']['attributes']['balance'] == '14:00:00'
