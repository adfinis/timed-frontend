"""Tests for the activity blocks endpoint."""

from datetime import time

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
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

        other_user = get_user_model().objects.create_user(
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
                'attributes': {
                    'from-time': '08:00'
                },
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

        assert not result['data']['attributes']['from-time'] == '08:00'
        assert result['data']['attributes']['to-time'] is None

    def test_activity_block_update(self):
        """Should update an existing activity block."""
        activity_block = self.activity_blocks[0]
        activity_block.from_time = time(10, 0)
        activity_block.save()

        data = {
            'data': {
                'type': 'activity-blocks',
                'id': activity_block.id,
                'attributes': {
                    'to-time': '23:59:00'
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
            result['data']['attributes']['to-time'] ==
            data['data']['attributes']['to-time']
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


def test_activity_block_active_unique(auth_client):
    """Should not be able to have two active blocks."""
    activity = ActivityFactory.create(user=auth_client.user)
    block = ActivityBlockFactory.create(to_time=None, activity=activity)

    data = {
        'data': {
            'type': 'activity-blocks',
            'id': None,
            'attributes': {
                'from-time': '08:00',
            },
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

    res = auth_client.post(url, data)

    assert res.status_code == HTTP_400_BAD_REQUEST
    json = res.json()
    assert json['errors'][0]['detail'] == (
        'A user can only have one active activity'
    )


def test_activity_block_to_before_from(auth_client):
    """Test that to is not before from."""
    activity = ActivityFactory.create(user=auth_client.user)
    block = ActivityBlockFactory.create(
        from_time=time(7, 30),
        to_time=None,
        activity=activity
    )

    data = {
        'data': {
            'type': 'activity-blocks',
            'id': block.id,
            'attributes': {
                'to-time': '07:00',
            }
        }
    }

    url = reverse('activity-block-detail', args=[block.id])

    res = auth_client.patch(url, data)

    assert res.status_code == HTTP_400_BAD_REQUEST
    json = res.json()
    assert json['errors'][0]['detail'] == (
        'An activity block may not end before it starts.'
    )
