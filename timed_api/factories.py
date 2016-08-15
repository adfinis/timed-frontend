from factory                    import Faker, lazy_attribute, SubFactory
from factory.django             import DjangoModelFactory
from timed_api                  import models
from django.contrib.auth.models import User
from random                     import randint
from pytz                       import timezone
from faker                      import Factory as FakerFactory

import datetime

tzinfo = timezone('Europe/Zurich')

faker = FakerFactory.create()


def begin_of_day(day):
    return datetime.datetime(
        day.year,
        day.month,
        day.day,
        0, 0, 0,
        tzinfo=tzinfo
    )


def end_of_day(day):
    return begin_of_day(day) + datetime.timedelta(days=1)


class UserFactory(DjangoModelFactory):
    first_name = Faker('first_name')
    last_name  = Faker('last_name')
    email      = Faker('email')
    password   = Faker('password', length=12)

    @lazy_attribute
    def username(self):
        return '{}.{}'.format(
            self.first_name,
            self.last_name,
        ).lower()

    class Meta:
        model = User


class AttendanceFactory(DjangoModelFactory):
    date = datetime.date.today()

    @lazy_attribute
    def from_datetime(self):
        return faker.date_time_between_dates(
            datetime_start=begin_of_day(self.date),
            datetime_end=end_of_day(self.date),
            tzinfo=tzinfo
        )

    @lazy_attribute
    def to_datetime(self):
        hours = randint(1, 5)

        return self.from_datetime + datetime.timedelta(hours=hours)

    class Meta:
        model   = models.Attendance
        exclude = ( 'date', )


class CustomerFactory(DjangoModelFactory):
    name     = Faker('company')
    email    = Faker('company_email')
    website  = Faker('url')
    comment  = Faker('sentence')
    archived = False

    class Meta:
        model = models.Customer


class ProjectFactory(DjangoModelFactory):
    name     = Faker('catch_phrase')
    archived = False
    comment  = Faker('sentence')
    customer = SubFactory(CustomerFactory)

    class Meta:
        model = models.Project


class TaskFactory(DjangoModelFactory):
    name            = Faker('company_suffix')
    estimated_hours = Faker('random_int', min=0, max=2000)
    archived        = False
    project         = SubFactory(ProjectFactory)

    class Meta:
        model = models.Task


class ReportFactory(DjangoModelFactory):
    comment = Faker('sentence')
    review  = False
    nta     = False
    task    = SubFactory(TaskFactory)

    @lazy_attribute
    def duration(self):
        return datetime.timedelta(
            hours=randint(0, 4),
            minutes=randint(0, 59)
        )

    class Meta:
        model = models.Report


class TaskTemplateFactory(DjangoModelFactory):
    name = Faker('sentence')

    class Meta:
        model = models.TaskTemplate
