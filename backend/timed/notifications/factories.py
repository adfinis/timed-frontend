from factory import Faker, SubFactory
from factory.django import DjangoModelFactory

from timed.notifications.models import Notification


class NotificationFactory(DjangoModelFactory):
    project = SubFactory("timed.projects.factories.ProjectFactory")
    notification_type = Faker("word", ext_word_list=Notification.NOTIFICATION_TYPES)

    class Meta:
        model = Notification
