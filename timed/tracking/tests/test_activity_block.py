"""Tests for the activity blocks endpoint."""

from datetime import time

from django.core.urlresolvers import reverse
from rest_framework import status

from timed.tracking.factories import ActivityBlockFactory, ActivityFactory


def test_activity_block_list(auth_client):
    user = auth_client.user
    activity = ActivityFactory.create(user=user)
    block = ActivityBlockFactory.create(activity=activity)
    ActivityBlockFactory.create()

    url = reverse('activity-block-list')
    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert len(json['data']) == 1
    assert json['data'][0]['id'] == str(block.id)


def test_activity_block_detail(auth_client):
    user = auth_client.user
    activity = ActivityFactory.create(user=user)
    block = ActivityBlockFactory.create(activity=activity)

    url = reverse('activity-block-detail', args=[block.id])

    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK


def test_activity_block_create(auth_client):
    user = auth_client.user
    activity = ActivityFactory.create(user=user)

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

    response = auth_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED

    json = response.json()
    assert not json['data']['attributes']['from-time'] == '08:00'
    assert json['data']['attributes']['to-time'] is None


def test_activity_block_update(auth_client):
    user = auth_client.user
    activity = ActivityFactory.create(user=user)
    block = ActivityBlockFactory.create(activity=activity, to_time=time(10, 0))

    data = {
        'data': {
            'type': 'activity-blocks',
            'id': block.id,
            'attributes': {
                'to-time': '23:59:00',
                'from-time': '10:00:00'
            }
        }
    }

    url = reverse('activity-block-detail', args=[block.id])
    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert (
        json['data']['attributes']['to-time'] ==
        data['data']['attributes']['to-time']
    )


def test_activity_block_delete(auth_client):
    user = auth_client.user
    activity = ActivityFactory.create(user=user)
    block = ActivityBlockFactory.create(activity=activity)

    url = reverse('activity-block-detail', args=[block.id])

    response = auth_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT


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

    assert res.status_code == status.HTTP_400_BAD_REQUEST
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

    assert res.status_code == status.HTTP_400_BAD_REQUEST
    json = res.json()
    assert json['errors'][0]['detail'] == (
        'An activity block may not end before it starts.'
    )
