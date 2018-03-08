from django_filters import FilterSet, NumberFilter

from . import models


class PackageFilter(FilterSet):
    customer = NumberFilter(field_name='billing_type__projects__customer')

    class Meta:
        model = models.Package
        fields = (
            'billing_type',
            'customer',
        )


class OrderFilter(FilterSet):
    customer = NumberFilter(name='project__customer')
    acknowledged = NumberFilter(field_name='acknowledged')

    class Meta:
        model = models.Order
        fields = (
            'customer',
            'project',
            'acknowledged'
        )
