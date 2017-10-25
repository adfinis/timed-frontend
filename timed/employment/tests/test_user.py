"""Tests for the locations endpoint."""

from datetime import date, timedelta

from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.status import (HTTP_200_OK, HTTP_401_UNAUTHORIZED,
                                   HTTP_405_METHOD_NOT_ALLOWED)

from timed.employment.factories import (AbsenceCreditFactory,
                                        AbsenceTypeFactory, EmploymentFactory,
                                        UserFactory)
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

    def test_user_update_self(self):
        """User may only change self."""
        user = self.user
        user.is_staff = False
        user.save()

        data = {
            'data': {
                'type': 'users',
                'id': user.id,
                'attributes': {
                    'is_staff': True,
                    'tour_done': True
                },
            }
        }

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.patch(url)
        res        = self.client.patch(url, data=data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == status.HTTP_200_OK

        user.refresh_from_db()
        assert self.user.tour_done
        assert not self.user.is_staff

    def test_user_update_other(self):
        """User may not change other user."""
        url = reverse('user-detail', args=[
            self.users[0].id
        ])
        res = self.client.patch(url)

        assert res.status_code == status.HTTP_403_FORBIDDEN

    def test_user_delete(self):
        """Should not be able delete a user."""
        user = self.user

        url = reverse('user-detail', args=[
            user.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_405_METHOD_NOT_ALLOWED

    def test_user_absence_types(self):
        absence_type = AbsenceTypeFactory.create()

        absence_credit = AbsenceCreditFactory.create(date=date.today(),
                                                     user=self.user, days=5,
                                                     absence_type=absence_type)

        # credit on different user, may not show up on included
        AbsenceCreditFactory.create(date=date.today(),
                                    absence_type=absence_type)

        AbsenceFactory.create(date=date.today(),
                              user=self.user,
                              type=absence_type)

        AbsenceFactory.create(date=date.today() - timedelta(days=1),
                              user=self.user,
                              type=absence_type)

        url = reverse('user-detail', args=[
            self.user.id
        ])

        res = self.client.get(url, {
            'include': 'user_absence_types,user_absence_types.absence_credits'
        })

        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        rel = result['data']['relationships']
        inc = result['included']

        assert len(rel['user-absence-types']['data']) == 1
        assert len(inc) == 2

        absence_type_inc = inc[0]
        assert absence_type_inc['id'] == str(absence_credit.id)

        absence_credit_inc = inc[1]
        assert (
            absence_credit_inc['id'] ==
            '{0}-{1}'.format(self.user.id, absence_credit.absence_type.id)
        )
        assert absence_credit_inc['attributes']['credit'] == 5
        assert absence_credit_inc['attributes']['balance'] == 3
        assert absence_credit_inc['attributes']['used-days'] == 2
        assert absence_credit_inc['attributes']['used-duration'] is None

    def test_user_absence_types_fill_worktime(self):
        absence_type = AbsenceTypeFactory.create(fill_worktime=True)

        employment = self.user.employments.get(end_date__isnull=True)

        employment.worktime_per_day = timedelta(hours=5)
        employment.start_date       = date.today() - timedelta(days=1)

        employment.save()

        ReportFactory.create(
            user=self.user,
            date=date.today(),
            duration=timedelta(hours=4)
        )

        AbsenceFactory.create(date=date.today(),
                              user=self.user,
                              type=absence_type)

        AbsenceFactory.create(date=date.today() - timedelta(days=1),
                              user=self.user,
                              type=absence_type)

        url = reverse('user-detail', args=[
            self.user.id
        ])

        res = self.client.get(url, {'include': 'user_absence_types'})

        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        rel = result['data']['relationships']
        inc = result['included']

        assert len(rel['user-absence-types']['data']) == 1
        assert len(inc) == 1

        assert (
            inc[0]['id'] ==
            '{0}-{1}'.format(self.user.id, absence_type.id)
        )

        assert inc[0]['attributes']['credit'] is None
        assert inc[0]['attributes']['balance'] is None
        assert inc[0]['attributes']['used-days'] is None
        assert inc[0]['attributes']['used-duration'] == '06:00:00'


def test_user_supervisor_filter(auth_client):
    """Should filter users by supervisor."""
    supervisees = UserFactory.create_batch(5)

    UserFactory.create_batch(5)

    auth_client.user.supervisees.add(*supervisees)
    auth_client.user.save()

    res = auth_client.get(reverse('user-list'), {
        'supervisor': auth_client.user.id
    })

    assert len(res.json()['data']) == 5
