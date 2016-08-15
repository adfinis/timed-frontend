from timed.jsonapi_test_case    import JSONAPITestCase
from django.core.urlresolvers   import reverse
from timed_api.factories        import ReportFactory, TaskFactory
from rest_framework             import status
from django.contrib.auth.models import User


class ReportTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        other_user = User.objects.create_user(
            username='tester2',
            password='123qweasd'
        )

        self.reports = ReportFactory.create_batch(10, user=self.user)

        ReportFactory.create_batch(10, user=other_user)

    def test_report_list(self):
        url = reverse('report-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)

        result = self.result(user_res)

        self.assertEqual(len(result['data']), len(self.reports))

        self.assertIn('id',       result['data'][0])
        self.assertIn('comment',  result['data'][0]['attributes'])
        self.assertIn('duration', result['data'][0]['attributes'])
        self.assertIn('review',   result['data'][0]['attributes'])
        self.assertIn('nta',      result['data'][0]['attributes'])
        self.assertIn('task',     result['data'][0]['relationships'])
        self.assertIn('user',     result['data'][0]['relationships'])

    def test_report_detail(self):
        report = self.reports[0]

        url = reverse('report-detail', args=[
            report.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)

        result = self.result(user_res)

        self.assertIn('id',       result['data'])
        self.assertIn('comment',  result['data']['attributes'])
        self.assertIn('duration', result['data']['attributes'])
        self.assertIn('review',   result['data']['attributes'])
        self.assertIn('nta',      result['data']['attributes'])
        self.assertIn('task',     result['data']['relationships'])
        self.assertIn('user',     result['data']['relationships'])

    def test_report_create(self):
        task = TaskFactory.create()

        data = {
            'data': {
                'type': 'reports',
                'id': None,
                'attributes': {
                    'comment':  'foo',
                    'duration': '00:50:00'
                },
                'relationships': {
                    'user': {
                        'data': {
                            'type': 'users',
                            'id': self.user.id
                        }
                    },
                    'task': {
                        'data': {
                            'type': 'tasks',
                            'id': task.id
                        }
                    },
                }
            }
        }

        url = reverse('report-list')

        noauth_res = self.noauth_client.post(url, data)
        user_res   = self.client.post(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_201_CREATED)

        result = self.result(user_res)

        self.assertIsNotNone(result['data']['id'])

        self.assertEqual(
            result['data']['attributes']['comment'],
            data['data']['attributes']['comment']
        )

        self.assertEqual(
            result['data']['attributes']['duration'],
            data['data']['attributes']['duration']
        )

    def test_report_update(self):
        report = self.reports[0]

        data = {
            'data': {
                'type': 'reports',
                'id': report.id,
                'attributes': {
                    'comment':  'foo',
                    'duration': '00:50:00'
                },
                'relationships': {
                    'user': {
                        'data': {
                            'type': 'users',
                            'id': report.user.id
                        }
                    },
                    'task': {
                        'data': {
                            'type': 'tasks',
                            'id': report.task.id
                        }
                    },
                }
            }
        }

        url = reverse('report-detail', args=[
            report.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        user_res   = self.client.patch(url, data)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_200_OK)

        result = self.result(user_res)

        self.assertEqual(
            result['data']['attributes']['comment'],
            data['data']['attributes']['comment']
        )

        self.assertEqual(
            result['data']['attributes']['duration'],
            data['data']['attributes']['duration']
        )

    def test_report_delete(self):
        report = self.reports[0]

        url = reverse('report-detail', args=[
            report.id
        ])

        noauth_res = self.noauth_client.delete(url)
        user_res   = self.client.delete(url)

        self.assertEqual(noauth_res.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(user_res.status_code,   status.HTTP_204_NO_CONTENT)
