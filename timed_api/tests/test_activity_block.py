from timed.jsonapi_test_case    import JSONAPITestCase
from django.core.urlresolvers   import reverse
from timed_api.factories        import ActivityFactory, ActivityBlockFactory
from django.contrib.auth.models import User
from datetime                   import datetime
from pytz                       import timezone

from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_401_UNAUTHORIZED
)


class ActivityBlockTests(JSONAPITestCase):

    def setUp(self):
        super().setUp()

        other_user = User.objects.create_user(
            username='test',
            password='123qweasd'
        )

        activity       = ActivityFactory.create(user=self.user)
        other_activity = ActivityFactory.create(user=other_user)

        self.activity_blocks = ActivityBlockFactory.create_batch(
            10,
            activity=activity
        )

        ActivityBlockFactory.create_batch(
            10,
            activity=other_activity
        )

    def test_activity_block_list(self):
        url = reverse('activity-block-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == len(self.activity_blocks)

    def test_activity_block_detail(self):
        activity_block = self.activity_blocks[0]

        url = reverse('activity-block-detail', args=[
            activity_block.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

    def test_activity_block_create(self):
        activity = self.activity_blocks[0].activity

        data = {
            'data': {
                'type': 'activity-blocks',
                'id': None,
                'attributes': {},
                'relationships': {
                    'activity': {
                        'data': {
                            'type': 'activities',
                            'id': activity.id
                        }
                    }
                }
            }
        }

        url = reverse('activity-block-list')

        noauth_res = self.noauth_client.post(url, data)
        user_res   = self.client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_201_CREATED

        result = self.result(user_res)

        assert not result['data']['attributes']['from-datetime'] is None
        assert result['data']['attributes']['to-datetime'] is None

    def test_activity_block_update(self):
        activity_block = self.activity_blocks[0]
        tz = timezone('Europe/Zurich')

        data = {
            'data': {
                'type': 'activity-blocks',
                'id': activity_block.id,
                'attributes': {
                    'to-datetime': datetime.now(tz).isoformat()
                }
            }
        }

        url = reverse('activity-block-detail', args=[
            activity_block.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        user_res   = self.client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert (
            result['data']['attributes']['to-datetime'] ==
            data['data']['attributes']['to-datetime']
        )

    def test_activity_delete(self):
        activity_block = self.activity_blocks[0]

        url = reverse('activity-block-detail', args=[
            activity_block.id
        ])

        noauth_res = self.noauth_client.delete(url)
        user_res   = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_204_NO_CONTENT
