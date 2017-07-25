from __future__ import unicode_literals

from django.db import models
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

    project = models.OneToOneField('projects.Project',
                                   related_name='subscription')
    subscription = models.ForeignKey(Subscription)
