"""Models for the tracking app."""

from datetime import timedelta

from django.conf import settings
from django.db import models
from django.db.models import F, Sum

from timed.employment.models import Employment


class Activity(models.Model):
    """Activity model.

    An activity represents multiple timeblocks in which a user worked on a
    certain task.
    """

    comment  = models.TextField(blank=True)
    date     = models.DateField(auto_now_add=True)
    task     = models.ForeignKey('projects.Task',
                                 null=True,
                                 blank=True,
                                 related_name='activities')
    user     = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 related_name='activities')

    @property
    def duration(self):
        """Calculate the total duration of this activity.

        :return: The total duration
        :rtype:  datetime.timedelta
        """
        return self.blocks.all().aggregate(
            duration=Sum(F('to_datetime') - F('from_datetime'))
        ).get('duration')

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return '{0}: {1}'.format(self.user, self.task)

    class Meta:
        """Meta informations for the activity model."""

        verbose_name_plural = 'activities'
        indexes             = [models.Index(fields=['date'])]


class ActivityBlock(models.Model):
    """Activity block model.

    An activity block is a timeblock of an activity.
    """

    activity      = models.ForeignKey('tracking.Activity',
                                      related_name='blocks')
    from_datetime = models.DateTimeField()
    to_datetime   = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return '{1} ({0})'.format(self.activity, self.duration)


class Attendance(models.Model):
    """Attendance model.

    An attendance is a timespan in which a user was present at work.
    """

    from_datetime = models.DateTimeField()
    to_datetime   = models.DateTimeField()
    user          = models.ForeignKey(settings.AUTH_USER_MODEL,
                                      related_name='attendances')

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return '{0}: {1} - {2}'.format(
            self.user,
            self.from_datetime.strftime('%d.%m.%Y %h:%i'),
            self.to_datetime.strftime('%d.%m.%Y %h:%i')
        )


class Report(models.Model):
    """Report model.

    A report is a timespan in which a user worked on a certain task.
    The difference to the activity is, that this is going to be on the
    bill for the customer.
    """

    comment      = models.TextField(blank=True)
    date         = models.DateField()
    duration     = models.DurationField()
    review       = models.BooleanField(default=False)
    not_billable = models.BooleanField(default=False)
    task         = models.ForeignKey('projects.Task',
                                     null=True,
                                     blank=True,
                                     related_name='reports')
    activity     = models.ForeignKey(Activity,
                                     null=True,
                                     blank=True,
                                     on_delete=models.SET_NULL,
                                     related_name='reports')
    user         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                     related_name='reports')
    verified_by  = models.ForeignKey(settings.AUTH_USER_MODEL,
                                     on_delete=models.SET_NULL,
                                     null=True, blank=True)
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """Save the report with some custom functionality.

        This rounds the duration of the report to the nearest 15 minutes.
        However, the duration must at least be 15 minutes long.
        It also checks if an absence which should fill the expected worktime
        exists on this date. If so, the duration of the absence needs to be
        updated, by saving the absence again.
        """
        self.duration = timedelta(
            seconds=max(
                15 * 60,
                round(self.duration.seconds / (15 * 60)) * (15 * 60)
            )
        )

        super().save(*args, **kwargs)

        for absence in Absence.objects.filter(
            user=self.user,
            date=self.date,
            type__fill_worktime=True
        ):
            absence.save()

    def __str__(self):
        """Represent the model as a string.

        :return: The string representation
        :rtype:  str
        """
        return '{0}: {1}'.format(self.user, self.task)

    class Meta:
        """Meta information for the report model."""

        indexes = [models.Index(fields=['date'])]


class Absence(models.Model):
    """Absence model.

    An absence is time an employee was not working but still counts as
    worktime. E.g holidays or sickness.
    """

    comment  = models.TextField(blank=True)
    date     = models.DateField()
    duration = models.DurationField(default=timedelta())
    type     = models.ForeignKey('employment.AbsenceType',
                                 related_name='absences')
    user     = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 related_name='absences')

    def save(self, *args, **kwargs):
        """Compute the duration of the absence and save it.

        The duration of an absence should be the worktime per day of the
        employment. Unless an absence type should only fill the worktime (e.g
        sickness), in which case the duration of the absence needs to fill the
        difference between the reported time and the worktime per day.
        """
        employment = Employment.objects.for_user(self.user, self.date)

        if self.type.fill_worktime:
            worktime = sum(
                Report.objects.filter(
                    date=self.date,
                    user=self.user
                ).values_list('duration', flat=True),
                timedelta()
            )

            self.duration = max(
                timedelta(),
                employment.worktime_per_day - worktime
            )
        else:
            self.duration = employment.worktime_per_day

        super().save(*args, **kwargs)

    class Meta:
        """Meta informations for the absence model."""

        unique_together = ('date', 'user',)
