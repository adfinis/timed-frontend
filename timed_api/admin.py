from django.contrib import admin
from timed_api      import models


class ActivityBlockInline(admin.StackedInline):
    model = models.ActivityBlock


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = [ 'task', 'user', 'start_datetime', 'comment', 'duration' ]
    inlines      = (ActivityBlockInline,)


@admin.register(models.Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = [ 'user', 'from_datetime', 'to_datetime' ]


@admin.register(models.Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [ 'user', 'task', 'duration', 'comment' ]


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [ 'name', 'email', 'website' ]


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [ 'customer', 'name' ]


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
    list_display = [ '__str__' ]
