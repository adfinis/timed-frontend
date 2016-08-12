from timed.jsonapi_test_case    import JSONAPITestCase
from django.core.urlresolvers   import reverse
from timed_api.factories        import AttendanceFactory
from rest_framework             import status
from django.contrib.auth.models import User
from datetime                   import timedelta


class AttendanceTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        other_user = User.objects.create_user(
            username='tester2',
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
        response = self.client.get(reverse('attendance-list'))

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(result['data']), len(self.attendances))

        self.assertIn('id',            result['data'][0])
        self.assertIn('from-datetime', result['data'][0]['attributes'])
        self.assertIn('to-datetime',   result['data'][0]['attributes'])

    def test_attendance_detail(self):
        attendance = self.attendances[0]

        response = self.client.get(reverse('attendance-detail', args=[
            attendance.id
        ]))

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('id',            result['data'])
        self.assertIn('from-datetime', result['data']['attributes'])
        self.assertIn('to-datetime',   result['data']['attributes'])

    def test_attendance_create(self):
        attendance = AttendanceFactory.build()

        data = {
            'data': {
                'type': 'attendances',
                'id': None,
                'attributes': {
                    'from-datetime': attendance.from_datetime.isoformat(),
                    'to-datetime': attendance.from_datetime.isoformat()
                },
                'relationships': {
                    'user': {
                        'data': {
                            'type': 'users',
                            'id': self.user.id
                        }
                    }
                }
            }
        }

        response = self.client.post(reverse('attendance-list'), data)

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertIsNotNone(result['data']['id'])

        self.assertEqual(
            result['data']['attributes']['from-datetime'],
            data['data']['attributes']['from-datetime']
        )

        self.assertEqual(
            result['data']['attributes']['to-datetime'],
            data['data']['attributes']['to-datetime']
        )

    def test_attendance_update(self):
        attendance = self.attendances[0]

        attendance.to_datetime += timedelta(hours=1)

        data = {
            'data': {
                'type': 'attendances',
                'id': attendance.id,
                'attributes': {
                    'from-datetime': attendance.from_datetime.isoformat(),
                    'to-datetime': attendance.to_datetime.isoformat()
                },
                'relationships': {
                    'user': {
                        'data': {
                            'type': 'users',
                            'id': attendance.user.id
                        }
                    }
                }
            }
        }

        response = self.client.patch(reverse('attendance-detail', args=[
            attendance.id
        ]), data)

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            result['data']['attributes']['to-datetime'],
            data['data']['attributes']['to-datetime']
        )

    def test_attendance_delete(self):
        attendance = self.attendances[0]

        response = self.client.delete(reverse('attendance-detail', args=[
            attendance.id
        ]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
