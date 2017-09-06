"""Factories for testing the projects app."""

from factory import Faker, SubFactory
from factory.django import DjangoModelFactory

from timed.projects import models


class CustomerFactory(DjangoModelFactory):
    """Customer factory."""

    name     = Faker('company')
    email    = Faker('company_email')
    website  = Faker('url')
    comment  = Faker('sentence')
    archived = False

    class Meta:
        """Meta informations for the customer factory."""

        model = models.Customer


class BillingTypeFactory(DjangoModelFactory):
    name = Faker('uuid4')

    class Meta:
        model = models.BillingType


class ProjectFactory(DjangoModelFactory):
    """Project factory."""

    name            = Faker('catch_phrase')
    estimated_time  = Faker('time_delta')
    archived        = False
    comment         = Faker('sentence')
    customer        = SubFactory('timed.projects.factories.CustomerFactory')

    class Meta:
        """Meta informations for the project factory."""

        model = models.Project


class TaskFactory(DjangoModelFactory):
    """Task factory."""

    name            = Faker('company_suffix')
    estimated_time  = Faker('time_delta')
    archived        = False
    project         = SubFactory('timed.projects.factories.ProjectFactory')

    class Meta:
        """Meta informations for the task factory."""

        model = models.Task


class TaskTemplateFactory(DjangoModelFactory):
    """Task template factory."""

    name = Faker('sentence')

    class Meta:
        """Meta informations for the task template factory."""

        model = models.TaskTemplate
