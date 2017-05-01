"""Tests for the activity blocks endpoint."""

from datetime import datetime

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from pytz import timezone
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST,
                                   HTTP_401_UNAUTHORIZED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed.tracking.factories import ActivityBlockFactory, ActivityFactory


class ActivityBlockTests(JSONAPITestCase):
    """Tests for the activity blocks endpoint."""

    def setUp(self):
        """Set the environment for the tests up."""
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
        """Should respond with a list of activity blocks."""
        url = reverse('activity-block-list')

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert len(result['data']) == len(self.activity_blocks)

    def test_activity_block_detail(self):
        """Should respond with a single activity block."""
        activity_block = self.activity_blocks[0]

        url = reverse('activity-block-detail', args=[
            activity_block.id
        ])

        noauth_res = self.noauth_client.get(url)
        res        = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

    def test_activity_block_create(self):
        """Should create a new activity block."""
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
        res        = self.client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_201_CREATED

        result = self.result(res)

        assert not result['data']['attributes']['from-datetime'] is None
        assert result['data']['attributes']['to-datetime'] is None

    def test_activity_block_update(self):
        """Should update an existing activity block."""
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
        res        = self.client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_200_OK

        result = self.result(res)

        assert (
            result['data']['attributes']['to-datetime'] ==
            data['data']['attributes']['to-datetime']
        )

    def test_activity_block_delete(self):
        """Should delete an activity block."""
        activity_block = self.activity_blocks[0]

        url = reverse('activity-block-detail', args=[
            activity_block.id
        ])

        noauth_res = self.noauth_client.delete(url)
        res        = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert res.status_code == HTTP_204_NO_CONTENT

    def test_activity_block_active_unique(self):
        """Should not be able to have two active blocks."""
        block = self.activity_blocks[0]

        block.to_datetime = None
        block.save()

        data = {
            'data': {
                'type': 'activity-blocks',
                'id': None,
                'attributes': {},
                'relationships': {
                    'activity': {
                        'data': {
                            'type': 'activities',
                            'id': block.activity.id
                        }
                    }
                }
            }
        }

        url = reverse('activity-block-list')

        res = self.client.post(url, data)

        assert res.status_code == HTTP_400_BAD_REQUEST
