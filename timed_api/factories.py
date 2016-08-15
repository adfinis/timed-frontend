from factory        import Faker, lazy_attribute, SubFactory
from factory.django import DjangoModelFactory
from timed_api      import models
from random         import randint
from pytz           import timezone

import datetime

tzinfo = timezone('Europe/Zurich')

today = datetime.date.today()

begin_of_today = datetime.datetime(
    today.year,
    today.month,
    today.day,
    0, 0, 0,
    tzinfo=tzinfo
)

end_of_today = begin_of_today + datetime.timedelta(days=1)


class UserFactory(DjangoModelFactory):
    first_name = Faker('first_name')
    last_name  = Faker('last_name')
    email      = Faker('email')
    password   = Faker('password', length=12)

    @lazy_attribute
    def username(self):
        return self.first_name.lower() + self.last_name[0].lower()


class AttendanceFactory(DjangoModelFactory):
    from_datetime = Faker(
        'date_time_between_dates',
        datetime_start=begin_of_today,
        datetime_end=end_of_today,
        tzinfo=tzinfo
    )

    @lazy_attribute
    def to_datetime(self):
        hours = randint(1, 5)

        return self.from_datetime + datetime.timedelta(hours=hours)

    class Meta:
        model = models.Attendance


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


class TaskTemplateFactory(DjangoModelFactory):
    name = Faker('sentence')

    class Meta:
        model = models.TaskTemplate
