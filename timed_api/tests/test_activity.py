"""Tests for the activities endpoint."""

from datetime import datetime

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from pytz import timezone
from rest_framework.status import (HTTP_200_OK, HTTP_201_CREATED,
                                   HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED)

from timed.jsonapi_test_case import JSONAPITestCase
from timed_api.factories import ActivityBlockFactory, ActivityFactory


class ActivityTests(JSONAPITestCase):
    """Tests for the activities endpoint."""

    def setUp(self):
        """Setup the environment for the tests."""
        super().setUp()

        other_user = User.objects.create_user(
            username='test',
            password='123qweasd'
        )

        self.activities = ActivityFactory.create_batch(
            10,
            user=self.user
        )

        for activity in self.activities:
            ActivityBlockFactory.create_batch(5, activity=activity)

        ActivityFactory.create_batch(
            10,
            user=other_user
        )

    def test_activity_list(self):
        """Should respond with a list of activities filtered by user."""
        url = reverse('activity-list')

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert len(result['data']) == len(self.activities)

    def test_activity_detail(self):
        """Should respond with a single activity."""
        activity = self.activities[0]

        url = reverse('activity-detail', args=[
            activity.id
        ])

        noauth_res = self.noauth_client.get(url)
        user_res   = self.client.get(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

    def test_activity_create(self):
        """Should create a new activity and automatically set the user."""
        task = self.activities[0].task

        data = {
            'data': {
                'type': 'activities',
                'id': None,
                'attributes': {
                    'comment': 'Test activity'
                },
                'relationships': {
                    'task': {
                        'data': {
                            'type': 'tasks',
                            'id': task.id
                        }
                    }
                }
            }
        }

        url = reverse('activity-list')

        noauth_res = self.noauth_client.post(url, data)
        user_res   = self.client.post(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_201_CREATED

        result = self.result(user_res)

        assert (
            int(result['data']['relationships']['user']['data']['id']) ==
            int(self.user.id)
        )

    def test_activity_update(self):
        """Should update an existing activity."""
        activity = self.activities[0]

        data = {
            'data': {
                'type': 'activities',
                'id': activity.id,
                'attributes': {
                    'comment': 'Test activity 2'
                }
            }
        }

        url = reverse('activity-detail', args=[
            activity.id
        ])

        noauth_res = self.noauth_client.patch(url, data)
        user_res   = self.client.patch(url, data)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_200_OK

        result = self.result(user_res)

        assert (
            result['data']['attributes']['comment'] ==
            data['data']['attributes']['comment']
        )

    def test_activity_delete(self):
        """Should delete an activity."""
        activity = self.activities[0]

        url = reverse('activity-detail', args=[
            activity.id
        ])

        noauth_res = self.noauth_client.delete(url)
        user_res   = self.client.delete(url)

        assert noauth_res.status_code == HTTP_401_UNAUTHORIZED
        assert user_res.status_code == HTTP_204_NO_CONTENT

    def test_activity_list_filter_active(self):
        """Should respond with a list of active activities."""
        activity = self.activities[0]
        block    = ActivityBlockFactory.create(activity=activity)

        block.to_datetime = None
        block.save()

        url = reverse('activity-list')

        res = self.client.get('{}?active=true'.format(url))

        result = self.result(res)

        assert len(result['data']) == 1

        assert int(result['data'][0]['id']) == int(activity.id)

    def test_activity_list_filter_day(self):
        """Should respond with a list of activities starting today."""
        now      = datetime.now(timezone('Europe/Zurich'))
        activity = self.activities[0]

        activity.start_datetime = now
        activity.save()

        url = reverse('activity-list')

        res = self.client.get('{}?day={}'.format(
            url,
            now.strftime('%Y-%m-%d')
        ))

        result = self.result(res)

        assert len(result['data']) >= 1

        assert any([
            int(data['id']) == activity.id
            for data
            in result['data']
        ])
