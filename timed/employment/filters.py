"""Filters for filtering the data of the employment app endpoints."""


from django_filters import DateFilter, Filter, FilterSet

from timed.employment import models


class YearFilter(Filter):
    """Filter to filter a queryset by year."""

    def filter(self, qs, value):
        """Filter the queryset.

        :param QuerySet qs: The queryset to filter
        :param str   value: The year to filter to
        :return:            The filtered queryset
        :rtype:             QuerySet
        """
        return qs.filter(**{
            '%s__year' % self.name: value
        })


class PublicHolidayFilterSet(FilterSet):
    """Filter set for the public holidays endpoint."""

    year      = YearFilter(name='date')
    from_date = DateFilter(name='date', lookup_expr='gte')
    to_date   = DateFilter(name='date', lookup_expr='lte')

    class Meta:
        """Meta information for the public holiday filter set."""

        model  = models.PublicHoliday
        fields = ['year', 'location', 'date', 'from_date', 'to_date']


class UserFilterSet(FilterSet):
    class Meta:
        model  = models.User
        fields = ['is_active']
