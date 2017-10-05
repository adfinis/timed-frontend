"""Factories for testing the tracking app."""

import datetime
from random import randint

from factory import Faker, SubFactory, lazy_attribute
from factory.django import DjangoModelFactory
from faker import Factory as FakerFactory
from pytz import timezone

from timed.tracking import models

tzinfo = timezone('Europe/Zurich')

faker = FakerFactory.create()


class AttendanceFactory(DjangoModelFactory):
    """Attendance factory."""

    date = Faker('date')
    from_time = Faker('time')
    to_time = Faker('time')
    user = SubFactory('timed.employment.factories.UserFactory')

    class Meta:
        """Meta informations for the attendance factory."""

        model   = models.Attendance


class ReportFactory(DjangoModelFactory):
    """Task factory."""

    comment      = Faker('sentence')
    date         = Faker('date')
    review       = False
    not_billable = False
    task         = SubFactory('timed.projects.factories.TaskFactory')
    user         = SubFactory('timed.employment.factories.UserFactory')

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


class ActivityFactory(DjangoModelFactory):
    """Activity factory."""

    comment = Faker('sentence')
    task    = SubFactory('timed.projects.factories.TaskFactory')
    user    = SubFactory('timed.employment.factories.UserFactory')

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


class AbsenceFactory(DjangoModelFactory):
    """Absence factory."""

    user = SubFactory('timed.employment.factories.UserFactory')
    type = SubFactory('timed.employment.factories.AbsenceTypeFactory')
    date = Faker('date')

    class Meta:
        """Meta informations for the absence factory."""

        model = models.Absence
