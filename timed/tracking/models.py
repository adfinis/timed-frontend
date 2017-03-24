"""Models for the tracking app."""

from datetime import timedelta

from django.conf import settings
from django.db import models


class Activity(models.Model):
    """Activity model.

    An activity represents multiple timeblocks in which a user worked on a
    certain task.
    """

    comment        = models.CharField(max_length=255, blank=True)
    start_datetime = models.DateTimeField(auto_now_add=True)
    task           = models.ForeignKey('projects.Task',
                                       related_name='activities')
    user           = models.ForeignKey(settings.AUTH_USER_MODEL,
                                       related_name='activities')

    @property
    def duration(self):
        """The total duration of this activity.

        :return: The total duration
        :rtype:  datetime.timedelta
        """
        durations = [
            block.duration
            for block
            in self.blocks.all()
            if block.duration
        ]

        return sum(durations, timedelta())

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{0}: {1}'.format(self.user, self.task)

    class Meta:
        """Meta informations for the activity model."""

        verbose_name_plural = 'activities'


class ActivityBlock(models.Model):
    """Activity block model.

    An activity block is a timeblock of an activity.
    """

    activity      = models.ForeignKey('tracking.Activity',
                                      related_name='blocks')
    from_datetime = models.DateTimeField(auto_now_add=True)
    to_datetime   = models.DateTimeField(blank=True, null=True)

    @property
    def duration(self):
        """The duration of this activity block.

        :return: The duration
        :rtype:  datetime.timedelta or None
        """
        if not self.to_datetime:
            return None

        return self.to_datetime - self.from_datetime

    def __str__(self):
        """String representation.

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
        """String representation.

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

    comment      = models.CharField(max_length=255, blank=True)
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
                                     related_name='reports')
    absence_type = models.ForeignKey('employment.AbsenceType',
                                     null=True,
                                     blank=True,
                                     related_name='reports')
    user         = models.ForeignKey(settings.AUTH_USER_MODEL,
                                     related_name='reports')

    def save(self, *args, **kwargs):
        """Customized save method.

        This rounds the duration of the report to the nearest 15 minutes.
        However, the duration must at least be 15 minutes long.

        :returns: The saved report
        :rtype:   timed.tracking.models.Report
        """
        self.duration = timedelta(
            seconds=max(
                15 * 60,
                round(self.duration.seconds / (15 * 60)) * (15 * 60)
            )
        )

        return super().save(*args, **kwargs)

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{0}: {1}'.format(self.user, self.task)
