"""Views for the admin interface."""

from django.contrib import admin

from timed.employment import models


@admin.register(models.Location)
class LocationAdmin(admin.ModelAdmin):
    """Location admin view."""

    list_display  = ['name']
    search_fields = ['name']


@admin.register(models.Employment)
class EmploymentAdmin(admin.ModelAdmin):
    """Employment admin view."""

    list_display = ['__str__', 'percentage', 'location']
    list_filter  = ['location', 'user']


@admin.register(models.PublicHoliday)
class PublicHolidayAdmin(admin.ModelAdmin):
    """Public holiday admin view."""

    list_display = ['__str__', 'date', 'location']
    list_filter  = ['location']
