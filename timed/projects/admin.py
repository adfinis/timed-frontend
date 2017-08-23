"""Views for the admin interface."""

from django.contrib import admin
from django.forms.models import BaseInlineFormSet
from django.utils.translation import ugettext_lazy as _

from timed.projects import models


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Customer admin view."""

    list_display = ['name']
    search_fields = ['name']

    def has_delete_permission(self, request, obj=None):
        return obj and not obj.projects.exists()


@admin.register(models.BillingType)
class BillingType(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


class TaskInlineFormset(BaseInlineFormSet):
    """Task formset defaulting to task templates when project is created."""

    def __init__(self, *args, **kwargs):
        kwargs['initial'] = [
            {'name': tmpl.name}
            for tmpl in models.TaskTemplate.objects.order_by('name')
        ]
        super().__init__(*args, **kwargs)


class TaskInline(admin.TabularInline):
    formset = TaskInlineFormset
    model = models.Task

    def get_extra(self, request, obj=None, **kwargs):
        if obj is not None:
            return 0
        return models.TaskTemplate.objects.count()

    def has_delete_permission(self, request, obj=None):
        # for some reason obj is parent object and not task
        # so this doesn't work
        # return obj and not obj.reports.exists()
        return False


class ReviewerInline(admin.TabularInline):
    model = models.Project.reviewers.through
    extra = 0
    verbose_name = _('Reviewer')
    verbose_name_plural = _('Reviewers')


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    """Project admin view."""

    list_display  = ['name', 'customer']
    list_filter   = ['customer']
    search_fields = ['name', 'customer__name']

    inlines = [TaskInline, ReviewerInline]
    exclude = ('reviewers', )

    def has_delete_permission(self, request, obj=None):
        return obj and not obj.tasks.exists()


@admin.register(models.TaskTemplate)
class TaskTemplateAdmin(admin.ModelAdmin):
    """Task template admin view."""

    list_display = ['name']
