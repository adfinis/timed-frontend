"""Factories for testing the tracking app."""

from django.conf import settings
from factory import Faker, lazy_attribute
from factory.django import DjangoModelFactory


class UserFactory(DjangoModelFactory):
    """User factory."""

    first_name = Faker('first_name')
    last_name  = Faker('last_name')
    email      = Faker('email')
    password   = Faker('password', length=12)

    @lazy_attribute
    def username(self):
        """Generate a username from first and last name.

        :return: The generated username
        :rtype:  str
        """
        return '{0}.{1}'.format(
            self.first_name,
            self.last_name,
        ).lower()

    class Meta:
        """Meta informations for the user factory."""

        model = settings.AUTH_USER_MODEL
