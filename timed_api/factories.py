from factory        import Faker, lazy_attribute
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


class TaskTemplateFactory(DjangoModelFactory):
    name = Faker('sentence')

    class Meta:
        model = models.TaskTemplate
