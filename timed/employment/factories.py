"""Factories for testing the tracking app."""

import datetime

from django.conf import settings
from factory import Faker, SubFactory, lazy_attribute
from factory.django import DjangoModelFactory

from timed.employment import models


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


class LocationFactory(DjangoModelFactory):
    """Location factory."""

    name = Faker('city')

    class Meta:
        """Meta informations for the location factory."""

        model = models.Location


class PublicHolidayFactory(DjangoModelFactory):
    """Public holiday factory."""

    name     = Faker('word')
    date     = Faker('date_object')
    location = SubFactory(LocationFactory)

    class Meta:
        """Meta informations for the public holiday factory."""

        model = models.PublicHoliday


class EmploymentFactory(DjangoModelFactory):
    """Employment factory."""

    user       = SubFactory(UserFactory)
    location   = SubFactory(LocationFactory)
    percentage = Faker('random_int', min=50, max=100)
    start_date = Faker('date_object')
    end_date   = None

    @lazy_attribute
    def worktime_per_day(self):
        """Generate the worktime per day based on the percentage.

        :return: The generated worktime
        :rtype:  datetime.timedelta
        """
        return datetime.timedelta(minutes=60 * 8.5 * self.percentage)

    class Meta:
        """Meta informations for the employment factory."""

        model = models.Employment
