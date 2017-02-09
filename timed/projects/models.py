"""Models for the projects app."""

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    customer        = models.ForeignKey('projects.Customer',
                                        related_name='projects')
    leaders         = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                             related_name='projects',
                                             blank=True)

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{0} > {1}'.format(self.customer, self.name)


class Task(models.Model):
    """Task model.

    A task is a certain activity type on a project. Users can
    report their activities and reports on it.
    """

    name            = models.CharField(max_length=255)
    estimated_hours = models.PositiveIntegerField(blank=True, null=True)
    archived        = models.BooleanField(default=False)
    project         = models.ForeignKey('projects.Project',
                                        related_name='tasks')

    def __str__(self):
        """String representation.

        :return: The string representation
        :rtype:  str
        """
        return '{0} > {1}'.format(self.project, self.name)


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
