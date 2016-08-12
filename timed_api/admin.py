from django.contrib import admin
from timed_api      import models


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = [ 'task', 'comment', 'duration' ]


@admin.register(models.ActivityBlock)
class ActivityBlockAdmin(admin.ModelAdmin):
    list_display = [ 'from_datetime', 'to_datetime', 'duration' ]


@admin.register(models.Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = [ 'from_datetime', 'to_datetime' ]


@admin.register(models.Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = [ 'user', 'comment' ]


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = [ 'name', 'email', 'website' ]


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [ 'name' ]


@admin.register(models.Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [ 'name' ]


@admin.register(models.TaskTemplate)
class TaskTemplateAdmin(admin.ModelAdmin):
    list_display = [ 'name' ]
