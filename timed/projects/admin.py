"""Views for the admin interface."""

from django.contrib import admin

from timed.projects import models


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Customer admin view."""

    list_display = ['name']
    search_fields = ['name']


class TaskInline(admin.TabularInline):
    model = models.Task
    extra = 0


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    """Project admin view."""

    list_display  = ['name', 'customer']
    list_filter   = ['customer']
    search_fields = ['name', 'customer__name']

    inlines = [TaskInline]


@admin.register(models.TaskTemplate)
class TaskTemplateAdmin(admin.ModelAdmin):
    """Task template admin view."""

    list_display = ['name']
