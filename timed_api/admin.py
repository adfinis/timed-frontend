from django.contrib import admin
from timed_api      import models


class OwnerAdminMixin(object):
    owner_field = 'user'

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        if request.user.is_superuser:
            return qs

        return qs.filter(**{ self.owner_field: request.user })


class ActivityBlockInline(OwnerAdminMixin, admin.StackedInline):
    model       = models.ActivityBlock
    owner_field = 'activity__user'


@admin.register(models.Activity)
class ActivityAdmin(OwnerAdminMixin, admin.ModelAdmin):
    list_display = ['comment', 'task', 'user', 'duration']
    list_filter  = ['user', 'task', 'task__project', 'task__project__customer']
    inlines      = (ActivityBlockInline,)


@admin.register(models.Attendance)
class AttendanceAdmin(OwnerAdminMixin, admin.ModelAdmin):
    list_display = ['user', 'from_datetime', 'to_datetime']
    list_filter  = ['user']


@admin.register(models.Report)
class ReportAdmin(OwnerAdminMixin, admin.ModelAdmin):
    list_display = ['user', 'task', 'duration', 'comment']


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display  = ['name', 'customer']
    list_filter   = ['customer']
    search_fields = ['name', 'customer']


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [ 'get_customer', 'get_project', 'name' ]

    def get_customer(self, obj):
        return obj.project.customer.name

    get_customer.short_description = 'Customer'
    get_customer.admin_order_field = 'project__customer__name'

    def get_project(self, obj):
        return obj.project.name

    get_project.short_description = 'Project'
    get_project.admin_order_field = 'project__name'


@admin.register(models.TaskTemplate)
class TaskTemplateAdmin(admin.ModelAdmin):
    list_display = ['name']
