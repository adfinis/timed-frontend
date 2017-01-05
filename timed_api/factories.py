"""Factories for testing the Timed API."""

import datetime
from random import randint

from django.contrib.auth.models import User
from factory import Faker, SubFactory, lazy_attribute
from factory.django import DjangoModelFactory
from faker import Factory as FakerFactory
from pytz import timezone

from timed_api import models

tzinfo = timezone('Europe/Zurich')

faker = FakerFactory.create()


def begin_of_day(day):
    """Function for determining the start of a day.

    :param datetime.datetime day: The datetime to get the day from
    :return:                      The start of the day
    :rtype:                       datetime.datetime
    """
    return datetime.datetime(
        day.year,
        day.month,
        day.day,
        0, 0, 0,
        tzinfo=tzinfo
    )


def end_of_day(day):
    """Function for determining the end of a day.

    :param datetime.datetime day: The datetime to get the day from
    :return:                      The end of the day
    :rtype:                       datetime.datetime
    """
    return begin_of_day(day) + datetime.timedelta(days=1)


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

        model = User


class AttendanceFactory(DjangoModelFactory):
    """Attendance factory."""

    date = datetime.date.today()
    user = SubFactory(UserFactory)

    @lazy_attribute
    def from_datetime(self):
        """Generate a datetime between the start and the end of the day.

        :return: The generated datetime
        :rtype:  datetime.datetime
        """
        return faker.date_time_between_dates(
            datetime_start=begin_of_day(self.date),
            datetime_end=end_of_day(self.date),
            tzinfo=tzinfo
        )

    @lazy_attribute
    def to_datetime(self):
        """Generate a datetime based on from_datetime.

        :return: The generated datetime
        :rtype:  datetime.datetime
        """
        hours = randint(1, 5)

        return self.from_datetime + datetime.timedelta(hours=hours)

    class Meta:
        """Meta informations for the attendance factory."""

        model   = models.Attendance
        exclude = ('date',)


class CustomerFactory(DjangoModelFactory):
    """Customer factory."""

    name     = Faker('company')
    email    = Faker('company_email')
    website  = Faker('url')
    comment  = Faker('sentence')
    archived = False

    class Meta:
        """Meta informations for the customer factory."""

        model = models.Customer


class ProjectFactory(DjangoModelFactory):
    """Project factory."""

    name     = Faker('catch_phrase')
    archived = False
    comment  = Faker('sentence')
    customer = SubFactory(CustomerFactory)

    class Meta:
        """Meta informations for the project factory."""

        model = models.Project


class TaskFactory(DjangoModelFactory):
    """Task factory."""

    name            = Faker('company_suffix')
    estimated_hours = Faker('random_int', min=0, max=2000)
    archived        = False
    project         = SubFactory(ProjectFactory)

    class Meta:
        """Meta informations for the task factory."""

        model = models.Task


class ReportFactory(DjangoModelFactory):
    """Task factory."""

    comment = Faker('sentence')
    review  = False
    nta     = False
    task    = SubFactory(TaskFactory)
    user    = SubFactory(UserFactory)

    @lazy_attribute
    def duration(self):
        """Generate a random duration between 0 and 5 hours.

        :return: The generated duration
        :rtype:  datetime.timedelta
        """
        return datetime.timedelta(
            hours=randint(0, 4),
            minutes=randint(0, 59)
        )

    class Meta:
        """Meta informations for the report factory."""

        model = models.Report


class TaskTemplateFactory(DjangoModelFactory):
    """Task template factory."""

    name = Faker('sentence')

    class Meta:
        """Meta informations for the task template factory."""

        model = models.TaskTemplate


class ActivityFactory(DjangoModelFactory):
    """Activity factory."""

    comment = Faker('sentence')
    task    = SubFactory(TaskFactory)
    user    = SubFactory(UserFactory)

    class Meta:
        """Meta informations for the activity block factory."""

        model = models.Activity


class ActivityBlockFactory(DjangoModelFactory):
    """Activity block factory."""

    activity      = SubFactory(ActivityFactory)
    from_datetime = Faker('date_time', tzinfo=tzinfo)

    @lazy_attribute
    def to_datetime(self):
        """Generate a datetime based on the from_datetime.

        :return: The generated datetime
        :rtype:  datetime.datetime
        """
        hours = randint(1, 5)

        return self.from_datetime + datetime.timedelta(hours=hours)

    class Meta:
        """Meta informations for the activity block factory."""

        model = models.ActivityBlock
