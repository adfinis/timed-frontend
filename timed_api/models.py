"""Models for the Timed API."""

from datetime import timedelta

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Activity(models.Model):
    """Activity model.

    An activity represents multiple timeblocks in which a user worked on a
    certain task.
    """

    comment        = models.CharField(max_length=255, blank=True)
    start_datetime = models.DateTimeField(auto_now_add=True)
    task           = models.ForeignKey('Task', related_name='activities')
    user           = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='activities'
    )

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
        return '{}: {}'.format(self.user, self.task)

    class Meta:
        """Meta informations for the activity model."""

        verbose_name_plural = 'activities'


class ActivityBlock(models.Model):
    """Activity block model.

    An activity block is a timeblock of an activity.
    """

    activity      = models.ForeignKey('Activity', related_name='blocks')
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
        return '{} ({})'.format(self.activity, self.duration)


class Attendance(models.Model):
    """Attendance model.

    An attendance is a timespan in which a user was present at work.
    """

    from_datetime = models.DateTimeField()
    to_datetime   = models.DateTimeField()
    user          = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='attendances'
    )

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{}: {} - {}'.format(
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

    comment  = models.CharField(max_length=255)
    duration = models.DurationField()
    review   = models.BooleanField(default=False)
    nta      = models.BooleanField(default=False)
    task     = models.ForeignKey(
        'Task',
        null=True,
        blank=True,
        related_name='reports'
    )
    user     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='reports'
    )

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{}: {}'.format(self.user, self.task)


class Customer(models.Model):
    """Customer model.

    A customer is a person or company which will pay the work
    reported on their projects.
    """

    name     = models.CharField(max_length=255)
    email    = models.EmailField(blank=True)
    website  = models.URLField(blank=True)
    comment  = models.TextField(blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return self.name


class Project(models.Model):
    """Project model.

    A project is an offer in most cases. It has multiple tasks and
    belongs to a customer.
    """

    TYPES = (
        ('GH', 'Github'),
        ('RM', 'Redmine')
    )

    name            = models.CharField(max_length=255)
    comment         = models.TextField(blank=True)
    archived        = models.BooleanField(default=False)
    tracker_type    = models.CharField(max_length=2, choices=TYPES, blank=True)
    tracker_name    = models.CharField(max_length=255, blank=True)
    tracker_api_key = models.CharField(max_length=255, blank=True)
    customer        = models.ForeignKey('Customer', related_name='projects')
    leaders         = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='projects',
        blank=True
    )

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{} > {}'.format(self.customer, self.name)


class Task(models.Model):
    """Task model.

    A task is a certain activity type on a project. Users can
    report their activities and reports on it.
    """

    name            = models.CharField(max_length=255)
    estimated_hours = models.PositiveIntegerField(blank=True, null=True)
    archived        = models.BooleanField(default=False)
    project         = models.ForeignKey('Project', related_name='tasks')

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{} > {}'.format(self.project, self.name)


class TaskTemplate(models.Model):
    """Task template model.

    A task template is a global template of a task which should
    be generated for every project.
    """

    name = models.CharField(max_length=255)

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return self.name


@receiver(post_save, sender=Project)
def create_default_tasks(sender, instance, created, **kwargs):
    """Create default tasks on a project.

    This gets executed as soon as a project is created.
    """
    if created:
        for template in TaskTemplate.objects.all():
            Task.objects.create(name=template.name, project=instance)
