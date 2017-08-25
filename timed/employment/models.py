"""Models for the employment app."""

import datetime

from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from timed.models import WeekdaysField


class EmploymentManager(models.Manager):
    """Custom manager for employments."""

    def for_user(self, user, date=datetime.date.today()):
        """Get the employment on a date for a user.

        :param User user: The user of the searched employment
        :param datetime.date date: The date of the searched employment
        :returns: The employment on the date for the user
        :rtype: timed.employment.models.Employment
        """
        return self.get(
            (
                models.Q(end_date__gte=date) |
                models.Q(end_date__isnull=True)
            ),
            start_date__lte=date,
            user=user
        )


class Location(models.Model):
    """Location model.

    A location is the place where an employee works.
    """

    name     = models.CharField(max_length=50, unique=True)
    workdays = WeekdaysField(default=[str(day) for day in range(1, 6)])
    """
    Workdays defined per location, default is Monday - Friday
    """

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return self.name


class UserManager(UserManager):
    def all_supervisors(self):
        objects = self.model.objects.annotate(
            supervisees_count=models.Count('supervisees'))
        return objects.filter(supervisees_count__gt=0)

    def all_reviewers(self):
        objects = self.model.objects.annotate(
            reviews_count=models.Count('reviews'))
        return objects.filter(reviews__gt=0)

    def all_supervisees(self):
        objects = self.model.objects.annotate(
            supervisors_count=models.Count('supervisors'))
        return objects.filter(supervisors_count__gt=0)


class User(AbstractUser):
    """Timed specific user."""

    supervisors = models.ManyToManyField('self', symmetrical=False,
                                         related_name='supervisees')

    tour_done = models.BooleanField(default=False)
    """
    Indicate whether user has finished tour through Timed in frontend.
    """

    objects = UserManager()


class Employment(models.Model):
    """Employment model.

    An employment represents a contract which defines where an employee works
    and from when to when.
    """

    user             = models.ForeignKey(settings.AUTH_USER_MODEL,
                                         related_name='employments')
    location         = models.ForeignKey(Location, related_name='employments')
    percentage       = models.IntegerField(validators=[
                                           MinValueValidator(0),
                                           MaxValueValidator(100)])
    worktime_per_day = models.DurationField()
    start_date       = models.DateField()
    end_date         = models.DateField(blank=True, null=True)
    objects          = EmploymentManager()

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

    class Meta:
        """Meta information for the employment model."""

        indexes = [models.Index(fields=['start_date', 'end_date'])]


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

    class Meta:
        """Meta information for the public holiday model."""

        indexes = [models.Index(fields=['date'])]


class AbsenceType(models.Model):
    """Absence type model.

    An absence type defines the type of an absence. E.g sickness, holiday or
    school.
    """

    name          = models.CharField(max_length=50)
    fill_worktime = models.BooleanField(default=False)

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return self.name


class AbsenceCredit(models.Model):
    """Absence credit model.

    An absence credit is a credit for an absence of a certain type. A user
    should only be able to create as many absences as defined in this credit.
    E.g a credit that defines that a user can only have 25 holidays.
    """

    user         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                     related_name='absence_credits')
    comment      = models.CharField(max_length=255, blank=True)
    absence_type = models.ForeignKey(AbsenceType,
                                     related_name='absence_credits')
    date         = models.DateField()
    days         = models.PositiveIntegerField(default=0)


class OvertimeCredit(models.Model):
    """Overtime credit model.

    An overtime credit is a transferred overtime from the last year. This is
    added to the worktime of a user.
    """

    user     = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 related_name='overtime_credits')
    date     = models.DateField()
    duration = models.DurationField(blank=True, null=True)


class UserAbsenceTypeManager(models.Manager):
    def with_user(self, user, start_date, end_date):
        """Get all user absence types with the needed calculations.

        This is achieved using a raw query because the calculations were too
        complicated to do with django annotations / aggregations. Since those
        proxy models are read only and don't need to be filtered or anything,
        the raw query shouldn't block any needed functions.

        :param User user: The user of the user absence type
        :param datetime.date start_date: Start date of the user absence type
        :param datetime.date end_date: End date of the user absence type
        :returns: User absence types for the requested user
        :rtype: django.db.models.QuerySet
        """
        from timed.tracking.models import Absence

        return UserAbsenceType.objects.raw("""
            SELECT
                at.*,
                %(user_id)s AS user_id,
                %(start)s AS start_date,
                %(end)s AS end_date,
                CASE
                    WHEN at.fill_worktime THEN NULL
                    ELSE credit_join.credit
                END AS credit,
                CASE
                    WHEN at.fill_worktime THEN NULL
                    ELSE used_join.used_days
                END AS used_days,
                CASE
                    WHEN at.fill_worktime THEN used_join.used_duration
                    ELSE NULL
                END AS used_duration,
                CASE
                    WHEN at.fill_worktime THEN NULL
                    ELSE credit_join.credit - used_join.used_days
                END AS balance
            FROM {absencetype_table} AS at
            LEFT JOIN (
                SELECT
                    at.id,
                    SUM(ac.days) AS credit
                FROM {absencetype_table} AS at
                LEFT JOIN {absencecredit_table} AS ac ON (
                    ac.absence_type_id = at.id
                    AND
                    ac.user_id = %(user_id)s
                    AND
                    ac.date BETWEEN %(start)s AND %(end)s
                )
                GROUP BY at.id, ac.absence_type_id
            ) AS credit_join ON (at.id = credit_join.id)
            LEFT JOIN (
                SELECT
                    at.id,
                    COUNT(a.id) AS used_days,
                    SUM(a.duration) AS used_duration
                FROM {absencetype_table} AS at
                LEFT JOIN {absence_table} AS a ON (
                    a.type_id = at.id
                    and
                    a.user_id = %(user_id)s
                    AND
                    a.date BETWEEN %(start)s AND %(end)s
                )
                GROUP BY at.id, a.type_id
            ) AS used_join ON (at.id = used_join.id)
        """.format(
            absence_table=Absence._meta.db_table,
            absencetype_table=AbsenceType._meta.db_table,
            absencecredit_table=AbsenceCredit._meta.db_table
        ), {
            'user_id': user.id,
            'start': start_date,
            'end': end_date
        })


class UserAbsenceType(AbsenceType):
    """User absence type.

    This is a proxy for the absence type model used to generate a fake relation
    between a user and an absence type. This is required so we can expose the
    absence credits in a clean way to the API.

    The PK of this model is a combination of the user ID and the actual absence
    type ID.
    """

    objects = UserAbsenceTypeManager()

    @property
    def pk(self):
        return '{0}-{1}'.format(self.user_id, self.id)

    class Meta:
        proxy = True
