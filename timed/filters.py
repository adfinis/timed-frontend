from django_filters import Filter


class ListFilter(Filter):
    """List filter expecting list of values as comma separated values."""

    def filter(self, qs, value):
        if not value:
            return qs

        self.lookup_expr = 'in'
        values = value.split(',')
        return super().filter(qs, values)
