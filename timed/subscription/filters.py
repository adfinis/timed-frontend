from django_filters import FilterSet, NumberFilter

from . import models


class PackageFilter(FilterSet):
    class Meta:
        model = models.Package
        fields = (
            'billing_type',
        )


class OrderFilter(FilterSet):
    customer = NumberFilter(name='project__customer')

    class Meta:
        model = models.Order
        fields = (
            'customer',
            'project',
            'acknowledged'
        )
