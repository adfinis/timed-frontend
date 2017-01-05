"""Views for the admin interface."""

from django.contrib import admin

from timed_api import models


class OwnerAdminMixin(object):
    """Mixin for filtering an admin view by the user of the request."""

    owner_field = 'user'

    def get_queryset(self, request):
        """Filter a queryset by the user of the request.

        :param django.http.Request request: The HTTP request for this view
        :return:                            The filtered queryset
        :rtype:                             django.db.models.query.QuerySet
        """
        qs = super().get_queryset(request)

        if request.user.is_superuser:
            return qs

        return qs.filter(**{self.owner_field: request.user})


class ActivityBlockInline(OwnerAdminMixin, admin.StackedInline):
    """Activity block inline admin."""

    model       = models.ActivityBlock
    owner_field = 'activity__user'


@admin.register(models.Activity)
class ActivityAdmin(OwnerAdminMixin, admin.ModelAdmin):
    """Activity admin view."""

    list_display = ['comment', 'task', 'user', 'duration']
    list_filter  = ['user', 'task', 'task__project', 'task__project__customer']
    inlines      = (ActivityBlockInline,)


@admin.register(models.Attendance)
class AttendanceAdmin(OwnerAdminMixin, admin.ModelAdmin):
    """Attendance admin view."""

    list_display = ['user', 'from_datetime', 'to_datetime']
    list_filter  = ['user']


@admin.register(models.Report)
class ReportAdmin(OwnerAdminMixin, admin.ModelAdmin):
    """Report admin view."""

    list_display = ['user', 'task', 'duration', 'comment']


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    """Customer admin view."""

    list_display = ['name']
    search_fields = ['name']


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    """Project admin view."""

    list_display  = ['name', 'customer']
    list_filter   = ['customer']
    search_fields = ['name', 'customer']


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    """Task admin view."""

    list_display = ['__str__']


@admin.register(models.TaskTemplate)
class TaskTemplateAdmin(admin.ModelAdmin):
    """Task template admin view."""

    list_display = ['name']
