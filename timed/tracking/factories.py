"""Factories for testing the tracking app."""

import datetime
from random import randint

from factory import Faker, SubFactory, lazy_attribute
from factory.django import DjangoModelFactory
from faker import Factory as FakerFactory
from pytz import timezone

from timed.employment.models import Employment
from timed.tracking import models

tzinfo = timezone('Europe/Zurich')

faker = FakerFactory.create()


def begin_of_day(day):
    """Determine the start of a day.

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
    """Determine the end of a day.

    :param datetime.datetime day: The datetime to get the day from
    :return:                      The end of the day
    :rtype:                       datetime.datetime
    """
    return begin_of_day(day) + datetime.timedelta(days=1)


class AttendanceFactory(DjangoModelFactory):
    """Attendance factory."""

    date = datetime.date.today()
    user = SubFactory('timed.employment.factories.UserFactory')

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

    @lazy_attribute
    def duration(self):
        """Take the users employment worktime per day as duration.

        :return: The computed duration
        :rtype:  datetime.timedelta
        """
        return Employment.employment_at(self.user, self.date).worktime_per_day

    class Meta:
        """Meta informations for the absence factory."""

        model = models.Absence
