"""Views for the admin interface."""

import datetime

from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError

from timed.employment import models


class EmploymentForm(forms.ModelForm):
    """Custom form for the employment admin."""

    def clean(self):
        """Validate the employment as a whole.

        Ensure the end date is after the start date and there is only one
        active employment per user and there are no overlapping employments.

        :throws: django.core.exceptions.ValidationError
        :return: The cleaned data
        :rtype:  dict
        """
        data = super().clean()

        employments = models.Employment.objects.filter(user=data.get('user'))

        if (
            data.get('end_date') and
            data.get('start_date') >= data.get('end_date')
        ):
            raise ValidationError('The end date must be after the start date')

        if (
            employments.filter(end_date__isnull=True) and
            data.get('end_date') is None
        ):
            raise ValidationError('A user can only have one active employment')

        if any([
            e.start_date <= (
                data.get('end_date') if
                data.get('end_date') else
                datetime.date.today()
            ) and data.get('start_date') <= (
                e.end_date if e.end_date else datetime.date.today()
            )
            for e
            in employments
        ]):
            raise ValidationError('A user can\'t have multiple employments '
                                  'at the same time')

        return data

    class Meta:
        """Meta information for the employment form."""

        fields = '__all__'
        model = models.Employment


@admin.register(models.Location)
class LocationAdmin(admin.ModelAdmin):
    """Location admin view."""

    list_display  = ['name']
    search_fields = ['name']


@admin.register(models.Employment)
class EmploymentAdmin(admin.ModelAdmin):
    """Employment admin view."""

    form         = EmploymentForm
    list_display = ['__str__', 'percentage', 'location']
    list_filter  = ['location', 'user']


@admin.register(models.PublicHoliday)
class PublicHolidayAdmin(admin.ModelAdmin):
    """Public holiday admin view."""

    list_display = ['__str__', 'date', 'location']
    list_filter  = ['location']
