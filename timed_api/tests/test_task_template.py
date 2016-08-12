from timed.jsonapi_test_case  import JSONAPITestCase
from django.core.urlresolvers import reverse
from timed_api.factories      import TaskTemplateFactory
from rest_framework           import status


class TaskTemplateTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        self.task_templates = TaskTemplateFactory.create_batch(5)

    def test_task_template_list(self):
        response = self.client.get(reverse('task-template-list'))

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(result['data']), len(self.task_templates))

        self.assertIn('id',   result['data'][0])
        self.assertIn('name', result['data'][0]['attributes'])

    def test_task_template_detail(self):
        task_template = self.task_templates[0]

        response = self.client.get(reverse('task-template-detail', args=[
            task_template.id
        ]))

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('id',   result['data'])
        self.assertIn('name', result['data']['attributes'])

    def test_task_template_create(self):
        data = {
            'data': {
                'type': 'task-templates',
                'id': None,
                'attributes': {
                    'name': 'Test Task Template'
                }
            }
        }

        response = self.client.post(reverse('task-template-list'), data)

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertIsNotNone(result['data']['id'])

        self.assertEqual(
            result['data']['attributes']['name'],
            data['data']['attributes']['name']
        )

    def test_task_template_update(self):
        task_template = self.task_templates[0]

        data = {
            'data': {
                'type': 'task-templates',
                'id': task_template.id,
                'attributes': {
                    'name': 'Test Task Template'
                }
            }
        }

        response = self.client.patch(reverse('task-template-detail', args=[
            task_template.id
        ]), data)

        result = self.result(response)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            result['data']['attributes']['name'],
            data['data']['attributes']['name']
        )

    def test_task_template_delete(self):
        task_template = self.task_templates[0]

        response = self.client.delete(reverse('task-template-detail', args=[
            task_template.id
        ]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
