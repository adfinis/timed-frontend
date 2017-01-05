"""Models for the API."""

from django.db                import models
from django.conf              import settings
from django.db.models.signals import post_save
from django.dispatch          import receiver
from datetime                 import timedelta


class Activity(models.Model):
    comment        = models.CharField(max_length=255, blank=True)
    start_datetime = models.DateTimeField(auto_now_add=True)
    task           = models.ForeignKey('Task', related_name='activities')
    user           = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='activities'
    )

    @property
    def duration(self):
        durations = [
            block.duration
            for block
            in self.blocks.all()
            if block.duration
        ]

        return sum(durations, timedelta())

    def __str__(self):
        return '{}: {}'.format(self.user, self.task)

    class Meta:
        verbose_name_plural = 'activities'


class ActivityBlock(models.Model):
    activity      = models.ForeignKey('Activity', related_name='blocks')
    from_datetime = models.DateTimeField(auto_now_add=True)
    to_datetime   = models.DateTimeField(blank=True, null=True)

    @property
    def duration(self):
        if not self.to_datetime:
            return None

        return self.to_datetime - self.from_datetime

    def __str__(self):
        return '{} ({})'.format(self.activity, self.duration)


class Attendance(models.Model):
    from_datetime = models.DateTimeField()
    to_datetime   = models.DateTimeField()
    user          = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='attendances'
    )


class Report(models.Model):
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
        return '{}: {}'.format(self.user, self.task)


class Customer(models.Model):
    name     = models.CharField(max_length=255)
    email    = models.EmailField(blank=True)
    website  = models.URLField(blank=True)
    comment  = models.TextField(blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Project(models.Model):
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
        return '{} > {}'.format(self.customer, self.name)


class Task(models.Model):
    name            = models.CharField(max_length=255)
    estimated_hours = models.PositiveIntegerField(blank=True, null=True)
    archived        = models.BooleanField(default=False)
    project         = models.ForeignKey('Project', related_name='tasks')

    def __str__(self):
        return '{} > {}'.format(self.project, self.name)


class TaskTemplate(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


@receiver(post_save, sender=Project)
def create_default_tasks(sender, instance, created, **kwargs):
    if created:
        for template in TaskTemplate.objects.all():
            Task.objects.create(name=template.name, project=instance)
