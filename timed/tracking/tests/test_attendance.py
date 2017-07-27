"""Tests for the attendances endpoint."""

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.tracking.factories import AttendanceFactory


class AttendanceTests(JSONAPITestCase):
    """Tests for the attendances endpoint."""

    def setUp(self):
        """Set the environment for the tests up."""
        super().setUp()

        other_user = get_user_model().objects.create_user(
            username='test',
            password='123qweasd'
        )

        self.attendances = AttendanceFactory.create_batch(
            10,
            user=self.user
        )

        AttendanceFactory.create_batch(
            10,
            user=other_user
        )

    def test_attendance_list(self):
        """Should respond with a list of attendances filtered by user."""
        url = reverse('attendance-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.attendances)

    def test_attendance_detail(self):
        """Should respond with a single attendance."""
        attendance = self.attendances[0]

        url = reverse('attendance-detail', args=[
            attendance.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_attendance_create(self):
        """Should create a new attendance and automatically set the user."""
        attendance = AttendanceFactory.build()

        data = {
            'data': {
                'type': 'attendances',
                'id': None,
                'attributes': {
                    'from-datetime': attendance.from_datetime.isoformat(),
                    'to-datetime': attendance.from_datetime.isoformat()
                }
            }
        }

        url = reverse('attendance-list')

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

    def test_attendance_update(self):
        """Should update and existing attendance."""
        attendance = self.attendances[0]

        attendance.to_datetime += timedelta(hours=1)

        data = {
            'data': {
                'type': 'attendances',
                'id': attendance.id,
                'attributes': {
                    'from-datetime': attendance.from_datetime.isoformat(),
                    'to-datetime': attendance.to_datetime.isoformat()
                }
            }
        }

        url = reverse('attendance-detail', args=[
            attendance.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        res        = self.client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert (
            result['data']['attributes']['to-datetime'] ==
            data['data']['attributes']['to-datetime']
        )

    def test_attendance_delete(self):
        """Should delete an attendance."""
        attendance = self.attendances[0]

        url = reverse('attendance-detail', args=[
            attendance.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_204_NO_CONTENT
