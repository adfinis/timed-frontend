"""Tests for the attendances endpoint."""

import datetime

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST,
                                   HTTP_401_UNAUTHORIZED)

from timed.employment.factories import (AbsenceTypeFactory, EmploymentFactory,
                                        PublicHolidayFactory)
from timed.employment.models import Employment
from timed.jsonapi_test_case import JSONAPITestCase
from timed.tracking.factories import AbsenceFactory, ReportFactory


class AbsenceTests(JSONAPITestCase):
    """Tests for the absences endpoint."""

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        user = self.user

        other_user = User.objects.create_user(
            username='test',
            password='123qweasd'
        )

        EmploymentFactory.create(
            user=user,
            start_date=datetime.date(2017, 5, 1),
            end_date=None
        )

        EmploymentFactory.create(
            user=other_user,
            start_date=datetime.date(2017, 5, 1),
            end_date=None
        )

        self.absences = [
            AbsenceFactory.create(user=user, date=datetime.date(2017, 5, 1)),
            AbsenceFactory.create(user=user, date=datetime.date(2017, 5, 2)),
            AbsenceFactory.create(user=user, date=datetime.date(2017, 5, 3))
        ]

        AbsenceFactory.create(user=other_user, date=datetime.date(2017, 5, 1))
        AbsenceFactory.create(user=other_user, date=datetime.date(2017, 5, 2))
        AbsenceFactory.create(user=other_user, date=datetime.date(2017, 5, 3))

    def test_absence_list(self):
        """Should respond with a list of absences filtered by user."""
        url = reverse('absence-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.absences)

    def test_absence_detail(self):
        """Should respond with a single absence."""
        absence = self.absences[0]

        url = reverse('absence-detail', args=[
            absence.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_absence_create(self):
        """Should create a new absence."""
        type = AbsenceTypeFactory.create()

        data = {
            'data': {
                'type': 'absences',
                'id': None,
                'attributes': {
                    'date': datetime.date(2017, 5, 4).strftime('%Y-%m-%d')
                },
                'relationships': {
                    'type': {
                        'data': {
                            'type': 'absence-types',
                            'id': type.id
                        }
                    }
                }
            }
        }

        url = reverse('absence-list')

        noauth_res = self.noauth_client.post(url, data)
        res        = self.client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_201_CREATED

        result = self.result(res)

        assert not result['data']['id'] is None

        assert (
            int(result['data']['relationships']['user']['data']['id']) ==
            int(self.user.id)
        )

    def test_absence_update(self):
        """Should update and existing absence."""
        absence = self.absences[0]

        absence.date = datetime.date(2017, 5, 5)
        absence.save()

        data = {
            'data': {
                'type': 'absences',
                'id': absence.id,
                'attributes': {
                    'date': datetime.date(2017, 5, 6).strftime('%Y-%m-%d')
                }
            }
        }

        url = reverse('absence-detail', args=[
            absence.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        res        = self.client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert (
            result['data']['attributes']['date'] ==
            data['data']['attributes']['date']
        )

    def test_absence_delete(self):
        """Should delete an absence."""
        absence = self.absences[0]

        url = reverse('absence-detail', args=[
            absence.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_204_NO_CONTENT

    def test_absence_fill_worktime(self):
        """Should create an absence which fills the worktime."""
        date       = datetime.date(2017, 5, 10)
        type       = AbsenceTypeFactory.create(fill_worktime=True)
        employment = Employment.employment_at(self.user, date)

        employment.worktime_per_day = datetime.timedelta(hours=8)
        employment.save()

        ReportFactory.create(
            user=self.user,
            date=date,
            duration=datetime.timedelta(hours=5)
        )

        data = {
            'data': {
                'type': 'absences',
                'id': None,
                'attributes': {
                    'date': date.strftime('%Y-%m-%d')
                },
                'relationships': {
                    'type': {
                        'data': {
                            'type': 'absence-types',
                            'id': type.id
                        }
                    }
                }
            }
        }

        url = reverse('absence-list')

        res = self.client.post(url, data)

        assert res.status_code == HTTP_201_CREATED

        result = self.result(res)

        assert result['data']['attributes']['duration'] == '03:00:00'

    def test_absence_weekend(self):
        """Should not be able to create an absence on a weekend."""
        type = AbsenceTypeFactory.create()

        data = {
            'data': {
                'type': 'absences',
                'id': None,
                'attributes': {
                    'date': datetime.date(2017, 5, 15).strftime('%Y-%m-%d')
                },
                'relationships': {
                    'type': {
                        'data': {
                            'type': 'absence-types',
                            'id': type.id
                        }
                    }
                }
            }
        }

        url = reverse('absence-list')

        res = self.client.post(url, data)

        assert res.status_code == HTTP_400_BAD_REQUEST

    def test_absence_public_holiday(self):
        """Should not be able to create an absence on a public holiday."""
        date = datetime.date(2017, 5, 16)

        type = AbsenceTypeFactory.create()

        PublicHolidayFactory.create(
            location=Employment.employment_at(self.user, date).location,
            date=date
        )

        data = {
            'data': {
                'type': 'absences',
                'id': None,
                'attributes': {
                    'date': date.strftime('%Y-%m-%d')
                },
                'relationships': {
                    'type': {
                        'data': {
                            'type': 'absence-types',
                            'id': type.id
                        }
                    }
                }
            }
        }

        url = reverse('absence-list')

        res = self.client.post(url, data)

        assert res.status_code == HTTP_400_BAD_REQUEST
