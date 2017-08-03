from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from djmoney.models.fields import MoneyField


class Subscription(models.Model):
    """Representation of a support subscription."""

    name     = models.CharField(max_length=255)
    archived = models.BooleanField(default=False)

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return self.name


class Package(models.Model):
    """Representing a subscription package."""

    subscription = models.ForeignKey(Subscription)
    duration     = models.DurationField()
    price        = MoneyField(max_digits=7, decimal_places=2,
                              default_currency='CHF')


class SubscriptionProject(models.Model):
    """
    Assign subscription to project.

    A project can only be assigned to one subscription.
    """

    project = models.OneToOneField('projects.Project')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)


class Order(models.Model):
    """Order of customer for specific amount of hours."""

    project = models.OneToOneField('projects.Project',
                                   on_delete=models.CASCADE,
                                   related_name='subscription')
    duration = models.DurationField()
    ordered = models.DateTimeField(default=timezone.now)
    acknowledged = models.BooleanField(default=False)
    confirmedby = models.ForeignKey(settings.AUTH_USER_MODEL,
                                    on_delete=models.SET_NULL,
                                    null=True, blank=True,
                                    related_name='orders_confirmed')


class CustomerPassword(models.Model):
    """
    Password per customer used for login into SySupport portal.

    Password are only hashed with md5. This model will be obsolete
    once customer center will go live.
    """

    customer = models.OneToOneField('projects.Customer')
    password = models.CharField(_('password'), max_length=128,
                                null=True, blank=True)
