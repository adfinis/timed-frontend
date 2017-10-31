"""Tests for the locations endpoint."""

from django.core.urlresolvers import reverse
from rest_framework import status

from timed.employment.factories import UserFactory
from timed.tracking.factories import ReportFactory


def test_user_list_unauthenticated(client):
    url = reverse('user-list')
    response = client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_user_update_unauthenticated(client):
    user = UserFactory.create()
    url = reverse('user-detail', args=[user.id])
    response = client.patch(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_user_list(auth_client, django_assert_num_queries):
    UserFactory.create_batch(2)

    url = reverse('user-list')

    with django_assert_num_queries(5):
        response = auth_client.get(url)

    assert response.status_code == status.HTTP_200_OK

    json = response.json()
    assert len(json['data']) == 3


def test_user_detail(auth_client):
    user = auth_client.user

    url = reverse('user-detail', args=[user.id])

    response = auth_client.get(url)
    assert response.status_code == status.HTTP_200_OK


def test_user_create_authenticated(auth_client):
    url = reverse('user-list')

    response = auth_client.post(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_user_create_superuser(superadmin_client):
    url = reverse('user-list')

    data = {
        'data': {
            'type': 'users',
            'id': None,
            'attributes': {
                'is_staff': True,
                'tour_done': True,
                'email': 'test@example.net',
                'first_name': 'First name',
                'last_name': 'Last name',
            },
        }
    }

    response = superadmin_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED


def test_user_update_owner(auth_client):
    user = auth_client.user
    data = {
        'data': {
            'type': 'users',
            'id': user.id,
            'attributes': {
                'is_staff': True,
                'tour_done': True
            },
        }
    }

    url = reverse('user-detail', args=[
        user.id
    ])

    response = auth_client.patch(url, data)
    assert response.status_code == status.HTTP_200_OK

    user.refresh_from_db()
    assert user.tour_done
    assert not user.is_staff


def test_user_update_other(auth_client):
    """User may not change other user."""
    user = UserFactory.create()
    url = reverse('user-detail', args=[user.id])
    res = auth_client.patch(url)

    assert res.status_code == status.HTTP_403_FORBIDDEN


def test_user_delete_authenticated(auth_client):
    """Should not be able delete a user."""
    user = auth_client.user

    url = reverse('user-detail', args=[user.id])

    response = auth_client.delete(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_user_delete_superuser(superadmin_client):
    """Should not be able delete a user."""
    user = UserFactory.create()

    url = reverse('user-detail', args=[user.id])

    response = superadmin_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_user_delete_with_reports_superuser(superadmin_client):
    """Test that user with reports may not be deleted."""
    user = UserFactory.create()
    ReportFactory.create(user=user)

    url = reverse('user-detail', args=[user.id])

    response = superadmin_client.delete(url)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_user_supervisor_filter(auth_client):
    """Should filter users by supervisor."""
    supervisees = UserFactory.create_batch(5)

    UserFactory.create_batch(5)

    auth_client.user.supervisees.add(*supervisees)
    auth_client.user.save()

    res = auth_client.get(reverse('user-list'), {
        'supervisor': auth_client.user.id
    })

    assert len(res.json()['data']) == 5
