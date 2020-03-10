import inspect

import mockldap
import pytest
from django.contrib.auth import get_user_model
from factory.base import FactoryMetaClass
from pytest_factoryboy import register

from timed.employment import factories as employment_factories
from timed.projects import factories as projects_factories
from timed.subscription import factories as subscription_factories
from timed.tests.client import JSONAPIClient
from timed.tracking import factories as tracking_factories


def register_module(module):
    for name, obj in inspect.getmembers(module):
        if isinstance(obj, FactoryMetaClass) and not obj._meta.abstract:
            register(obj)


register_module(employment_factories)
register_module(projects_factories)
register_module(subscription_factories)
register_module(tracking_factories)


@pytest.fixture(autouse=True, scope="session")
def ldap_directory():
    top = ("o=test", {"o": "test"})
    people = ("ou=people,o=test", {"ou": "people"})
    groups = ("ou=groups,o=test", {"ou": "groups"})
    ldapuser = (
        "uid=ldapuser,ou=people,o=test",
        {
            "uid": ["ldapuser"],
            "objectClass": [
                "person",
                "organizationalPerson",
                "inetOrgPerson",
                "posixAccount",
            ],
            "userPassword": ["Test1234!"],
            "uidNumber": ["1000"],
            "gidNumber": ["1000"],
            "givenName": ["givenName"],
            "mail": ["ldapuser@example.net"],
            "sn": ["LdapUser"],
        },
    )

    directory = dict([top, people, groups, ldapuser])
    mock = mockldap.MockLdap(directory)
    mock.start()

    yield

    mock.stop()


@pytest.fixture
def client(db):
    return JSONAPIClient()


@pytest.fixture
def auth_client(db):
    """Return instance of a JSONAPIClient that is logged in as test user."""
    user = get_user_model().objects.create_user(
        username="user",
        password="123qweasd",
        first_name="Test",
        last_name="User",
        is_superuser=False,
        is_staff=False,
    )

    client = JSONAPIClient()
    client.user = user
    client.login("user", "123qweasd")
    return client


@pytest.fixture
def admin_client(db):
    """Return instance of a JSONAPIClient that is logged in as a staff user."""
    user = get_user_model().objects.create_user(
        username="user",
        password="123qweasd",
        first_name="Test",
        last_name="User",
        is_superuser=False,
        is_staff=True,
    )

    client = JSONAPIClient()
    client.user = user
    client.login("user", "123qweasd")
    return client


@pytest.fixture
def superadmin_client(db):
    """Return instance of a JSONAPIClient that is logged in as superuser."""
    user = get_user_model().objects.create_user(
        username="user",
        password="123qweasd",
        first_name="Test",
        last_name="User",
        is_staff=True,
        is_superuser=True,
    )

    client = JSONAPIClient()
    client.user = user
    client.login("user", "123qweasd")
    return client
