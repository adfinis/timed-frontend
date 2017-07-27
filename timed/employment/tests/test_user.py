"""Tests for the locations endpoint."""

from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from django.utils.duration import duration_string
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import (EmploymentFactory,
                                        OvertimeCreditFactory,
                                        PublicHolidayFactory, UserFactory)
from timed.jsonapi_test_case import JSONAPITestCase
from timed.tracking.factories import AbsenceFactory, ReportFactory


class UserTests(JSONAPITestCase):
    """Tests for the user endpoint.

    This endpoint should be read only for normal users.
    """

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        self.users = UserFactory.create_batch(3)

        for user in self.users + [self.user]:
            EmploymentFactory.create(user=user)

    def test_user_list(self):
        """Should respond with a list of all users."""
        url = reverse('user-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == 4
        assert int(result['data'][0]['id']) == self.user.id

    def test_logged_in_user_detail(self):
        """Should respond with a single user.

        This should only work if it is the currently logged in user.
        """
        url = reverse('user-detail', args=[
            self.user.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_not_logged_in_user_detail(self):
        """Should return other users too."""
        url = reverse('user-detail', args=[
            self.users[0].id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_user_create(self):
        """Should not be able to create a new user."""
        url = reverse('user-list')

        noauth_res = self.noauth_client.post(url)
        res        = self.client.post(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_user_update(self):
        """Should not be able to update an existing user."""
        user = self.user

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_user_delete(self):
        """Should not be able delete a user."""
        user = self.user

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.patch(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_user_worktime_balance(self):
        """Should calculate correct worktime balances."""
        user       = self.user
        employment = user.employments.get(end_date__isnull=True)

        # Calculate over one week
        start_date = date(2017, 3, 19)
        end_date   = date(2017, 3, 26)

        employment.start_date       = start_date
        employment.worktime_per_day = timedelta(hours=8)

        employment.save()

        # Overtime credit of 10 hours
        OvertimeCreditFactory.create(
            user=user,
            date=start_date,
            duration=timedelta(hours=10, minutes=30)
        )

        # One public holiday during workdays
        PublicHolidayFactory.create(
            date=start_date,
            location=employment.location
        )
        # One public holiday on weekend
        PublicHolidayFactory.create(
            date=start_date + timedelta(days=1),
            location=employment.location
        )

        url = reverse('user-detail', args=[
            user.id
        ])

        res = self.client.get('{0}?until={1}'.format(
            url,
            end_date.strftime('%Y-%m-%d')
        ))

        result = self.result(res)

        # 5 workdays minus one holiday minus 10 hours overtime credit
        expected_worktime = (
            4 * employment.worktime_per_day -
            timedelta(hours=10, minutes=30)
        )

        assert (
            result['data']['attributes']['worktime-balance'] ==
            duration_string(timedelta() - expected_worktime)
        )

        # 2x 10 hour reported worktime
        ReportFactory.create(
            user=user,
            date=start_date + timedelta(days=3),
            duration=timedelta(hours=10)
        )

        ReportFactory.create(
            user=user,
            date=start_date + timedelta(days=4),
            duration=timedelta(hours=10)
        )

        AbsenceFactory.create(
            user=user,
            date=start_date + timedelta(days=5)
        )

        res2 = self.client.get('{0}?until={1}'.format(
            url,
            end_date.strftime('%Y-%m-%d')
        ))

        result2 = self.result(res2)

        assert (
            result2['data']['attributes']['worktime-balance'] ==
            duration_string(timedelta(hours=28) - expected_worktime)
        )

    def test_user_without_employment(self):
        user = get_user_model().objects.create_user(username='test',
                                                    password='1234qwer')
        self.client.login('test', '1234qwer')

        url = reverse('user-detail', args=[
            user.id
        ])

        res = self.client.get(url)

        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert int(result['data']['id']) == user.id
        assert result['data']['attributes']['worktime-balance'] == (
            '00:00:00'
        )
