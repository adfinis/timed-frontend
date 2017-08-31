"""Tests for the employments endpoint."""

from datetime import date, timedelta

import pytest
from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment import factories
from timed.employment.admin import EmploymentForm
from timed.employment.models import Employment
from timed.jsonapi_test_case import JSONAPITestCase
from timed.tracking.factories import ReportFactory


class EmploymentTests(JSONAPITestCase):
    """Tests for the employment endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.employments = [
            factories.EmploymentFactory.create(
                user=self.user,
                start_date=date(2010, 1, 1),
                end_date=date(2015, 1, 1)
            ),
            factories.EmploymentFactory.create(
                user=self.user,
                start_date=date(2015, 1, 2)
            )
        ]

        factories.EmploymentFactory.create_batch(10)

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
            'start_date': date(2009, 1, 1),
            'end_date':   date(2016, 1, 1)
        }, instance=self.employments[0])

        with pytest.raises(ValueError):
            form.save()

    def test_employment_get_at(self):
        """Should return the right employment on a date."""
        employment = Employment.objects.get(user=self.user,
                                            end_date__isnull=True)

        assert (
            Employment.objects.get_at(self.user, employment.start_date) ==
            employment
        )

        employment.end_date = (
            employment.start_date +
            timedelta(days=20)
        )

        employment.save()

        with pytest.raises(Employment.DoesNotExist):
            Employment.objects.get_at(
                self.user,
                employment.start_date + timedelta(days=21)
            )


def test_worktime_balance_partial(db):
    """
    Test partial calculation of worktime balance.

    Partial is defined as a worktime balance of a time frame
    which is shorter than employment.
    """
    employment = factories.EmploymentFactory.create(
        start_date=date(2010, 1, 1),
        end_date=None,
        worktime_per_day=timedelta(hours=8)
    )
    user = employment.user

    # Calculate over one week
    start = date(2017, 3, 19)
    end   = date(2017, 3, 26)

    # Overtime credit of 10.5 hours
    factories.OvertimeCreditFactory.create(
        user=user,
        date=start,
        duration=timedelta(hours=10, minutes=30)
    )

    # One public holiday during workdays
    factories.PublicHolidayFactory.create(
        date=start,
        location=employment.location
    )
    # One public holiday on weekend
    factories.PublicHolidayFactory.create(
        date=start + timedelta(days=1),
        location=employment.location
    )
    # 5 workdays minus one holiday (32 hours)
    expected_expected = timedelta(hours=32)

    # reported 2 days each 10 hours
    for day in range(3, 5):
        ReportFactory.create(
            user=user,
            date=start + timedelta(days=day),
            duration=timedelta(hours=10)
        )
    # 10 hours reported time + 10.5 overtime credit
    expected_reported = timedelta(hours=30, minutes=30)
    expected_balance = expected_reported - expected_expected

    reported, expected, balance = employment.calculate_worktime(start, end)

    assert expected == expected_expected
    assert reported == expected_reported
    assert balance == expected_balance


def test_worktime_balance_longer(db):
    """Test calculation of worktime when frame is longer than employment."""
    employment = factories.EmploymentFactory.create(
        start_date=date(2017, 3, 21),
        end_date=date(2017, 3, 27),
        worktime_per_day=timedelta(hours=8)
    )
    user = employment.user

    # Calculate over one year
    start = date(2017, 1, 1)
    end   = date(2017, 12, 31)

    # Overtime credit of 10.5 hours before employment
    factories.OvertimeCreditFactory.create(
        user=user,
        date=start,
        duration=timedelta(hours=10, minutes=30)
    )
    # Overtime credit of during employment
    factories.OvertimeCreditFactory.create(
        user=user,
        date=employment.start_date,
        duration=timedelta(hours=10, minutes=30)
    )

    # One public holiday during employment
    factories.PublicHolidayFactory.create(
        date=employment.start_date,
        location=employment.location
    )
    # One public holiday before employment started
    factories.PublicHolidayFactory.create(
        date=date(2017, 3, 20),
        location=employment.location
    )
    # 5 workdays minus one holiday (32 hours)
    expected_expected = timedelta(hours=32)

    # reported 2 days each 10 hours
    for day in range(3, 5):
        ReportFactory.create(
            user=user,
            date=employment.start_date + timedelta(days=day),
            duration=timedelta(hours=10)
        )
    # reported time not on current employment
    ReportFactory.create(
        user=user,
        date=date(2017, 1, 5),
        duration=timedelta(hours=10)
    )
    # 10 hours reported time + 10.5 overtime credit
    expected_reported = timedelta(hours=30, minutes=30)
    expected_balance = expected_reported - expected_expected

    reported, expected, balance = employment.calculate_worktime(start, end)

    assert expected == expected_expected
    assert reported == expected_reported
    assert balance == expected_balance


def test_employment_for_user(db):
    user = factories.UserFactory.create()
    # employment overlapping time frame (early start)
    factories.EmploymentFactory.create(
        start_date=date(2017, 1, 1),
        end_date=date(2017, 2, 28),
        user=user
    )
    # employment overlapping time frame (early end)
    factories.EmploymentFactory.create(
        start_date=date(2017, 3, 1),
        end_date=date(2017, 3, 31),
        user=user
    )
    # employment within time frame
    factories.EmploymentFactory.create(
        start_date=date(2017, 4, 1),
        end_date=date(2017, 4, 30),
        user=user
    )
    # employment without end date
    factories.EmploymentFactory.create(
        start_date=date(2017, 5, 1),
        end_date=None,
        user=user
    )

    employments = Employment.objects.for_user(
        user, date(2017, 2, 1), date(2017, 12, 1)
    )

    assert employments.count() == 4
