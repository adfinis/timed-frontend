"""Models for the employment app."""

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Location(models.Model):
    """Location model.

    A location is the place where an employee works.
    """

    name = models.CharField(max_length=50)

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return self.name


class Employment(models.Model):
    """Employment model.

    An employment represents a contract which defines where an employee works
    and from when to when.
    """

    user             = models.ForeignKey(settings.AUTH_USER_MODEL,
                                         related_name='employments')
    location         = models.ForeignKey(Location)
    percentage       = models.IntegerField(validators=[
                                           MinValueValidator(0),
                                           MaxValueValidator(100)])
    worktime_per_day = models.DurationField()
    start_date       = models.DateField()
    end_date         = models.DateField(blank=True, null=True)

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{0} ({1} - {2})'.format(
            self.user.username,
            self.start_date.strftime('%d.%m.%Y'),
            self.end_date.strftime('%d.%m.%Y') if self.end_date else 'today'
        )


class PublicHoliday(models.Model):
    """Public holiday model.

    A public holiday is a day on which no employee of a certain location has
    to work.
    """

    name     = models.CharField(max_length=50)
    date     = models.DateField()
    location = models.ForeignKey(Location,
                                 related_name='public_holidays')

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{0} {1}'.format(self.name, self.date.strftime('%Y'))
