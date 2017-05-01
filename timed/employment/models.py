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
        """Represent the model as a string.

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
        """Represent the model as a string.

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
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return '{0} {1}'.format(self.name, self.date.strftime('%Y'))


class AbsenceType(models.Model):
    """Absence type model.

    An absence type defines the type of an absence. E.g sickness, holiday or
    school.
    """

    name = models.CharField(max_length=50)

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return self.name


class AbsenceCredit(models.Model):
    """Absence credit model.

    An absence credit is a credit for an absence of a certain type. An absence
    is a report marked as an absence by referencing an absence type.
    """

    user         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                     related_name='absence_credits')
    absence_type = models.ForeignKey(AbsenceType)
    date         = models.DateField()
    duration     = models.DurationField(blank=True, null=True)


class OvertimeCredit(models.Model):
    """Overtime credit model.

    An overtime credit is a transferred overtime from the last year. This is
    added to the worktime of a user.
    """

    user     = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 related_name='overtime_credits')
    date     = models.DateField()
    duration = models.DurationField(blank=True, null=True)
