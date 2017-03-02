"""Tests for the employments endpoint."""

import datetime

import pytest
from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.admin import EmploymentForm
from timed.employment.factories import EmploymentFactory
from timed.jsonapi_test_case import JSONAPITestCase


class EmploymentTests(JSONAPITestCase):
    """Tests for the employment endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        self.employments = [
            EmploymentFactory.create(user=self.user,
                                     start_date=datetime.date(2010, 1, 1),
                                     end_date=datetime.date(2015, 1, 1)),
            EmploymentFactory.create(user=self.user,
                                     start_date=datetime.date(2015, 1, 2))
        ]

        EmploymentFactory.create_batch(10)

    def test_employment_list(self):
        """Should respond with a list of employments."""
        url = reverse('employment-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.employments)

    def test_employment_detail(self):
        """Should respond with a single employment."""
        employment = self.employments[0]

        url = reverse('employment-detail', args=[
            employment.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_employment_create(self):
        """Should not be able to create a new employment."""
        url = reverse('employment-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_employment_update(self):
        """Should not be able to update an existing employment."""
        employment = self.employments[0]

        url = reverse('employment-detail', args=[
            employment.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_employment_delete(self):
        """Should not be able delete a employment."""
        employment = self.employments[0]

        url = reverse('employment-detail', args=[
            employment.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_employment_unique_active(self):
        """Should only be able to have one active employment per user."""
        form = EmploymentForm({
            'end_date': None
        }, instance=self.employments[1])

        with pytest.raises(ValueError):
            form.save()

    def test_employment_unique_range(self):
        """Should only be able to have one employment at a time per user."""
        form = EmploymentForm({
            'start_date': datetime.date(2009, 1, 1),
            'end_date':   datetime.date(2016, 1, 1)
        }, instance=self.employments[0])

        with pytest.raises(ValueError):
            form.save()
