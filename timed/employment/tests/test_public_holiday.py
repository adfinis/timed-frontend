"""Tests for the public holidays endpoint."""

from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import PublicHolidayFactory
from timed.employment.models import PublicHoliday
from timed.jsonapi_test_case import JSONAPITestCase


class PublicHolidayTests(JSONAPITestCase):
    """Tests for the public holiday endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.public_holidays = PublicHolidayFactory.create_batch(10)

    def test_public_holiday_list(self):
        """Should respond with a list of public holidays."""
        url = reverse('public-holiday-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.public_holidays)

    def test_public_holiday_detail(self):
        """Should respond with a single public holiday."""
        public_holiday = self.public_holidays[0]

        url = reverse('public-holiday-detail', args=[
            public_holiday.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_public_holiday_create(self):
        """Should not be able to create a new public holiday."""
        url = reverse('public-holiday-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_public_holiday_update(self):
        """Should not be able to update an existing public holiday."""
        public_holiday = self.public_holidays[0]

        url = reverse('public-holiday-detail', args=[
            public_holiday.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_public_holiday_delete(self):
        """Should not be able delete a public holiday."""
        public_holiday = self.public_holidays[0]

        url = reverse('public-holiday-detail', args=[
            public_holiday.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_public_holiday_year_filter(self):
        """Should filter the public holidays by year."""
        year = self.public_holidays[0].date.strftime('%Y')

        url = '{0}?year={1}'.format(reverse('public-holiday-list'), year)

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result   = self.result(res)
        expected = PublicHoliday.objects.filter(date__year=year)

        assert len(result['data']) == len(expected)
