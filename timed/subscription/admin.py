"""Views for the admin interface."""

from django.contrib import admin

from . import models


@admin.register(models.Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Subscription admin view."""

    list_display = ['name', 'archived']


@admin.register(models.Package)
class PackageAdmin(admin.ModelAdmin):
    """Attendance admin view."""

    list_display = ['subscription', 'duration', 'price']


@admin.register(models.SubscriptionProject)
class SubscriptionProjectAdmin(admin.ModelAdmin):
    """Subscription project assignment admin view."""

    list_display = ['project', 'subscription']
    list_filter  = ['project']
