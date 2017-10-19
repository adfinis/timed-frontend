from datetime import timedelta

from django.db.models import Sum
from django.utils.duration import duration_string
from rest_framework_json_api.serializers import DurationField, IntegerField

from timed.serializers import DictObjectSerializer


class TotalTimeRootMetaMixin(object):
    def get_root_meta(self, resource, many):
        """Add total hours over whole result (not just page) to meta."""
        if many:
            view = self.context['view']
            queryset = view.filter_queryset(view.get_queryset())
            data = queryset.aggregate(total_time=Sum('duration'))
            data['total_time'] = duration_string(
                data['total_time'] or timedelta(0)
            )
            return data
        return {}


class YearStatisticSerializer(TotalTimeRootMetaMixin, DictObjectSerializer):
    duration = DurationField()
    year = IntegerField()

    class Meta:
        resource_name = 'year-statistics'


class MonthStatisticSerializer(TotalTimeRootMetaMixin, DictObjectSerializer):
    duration = DurationField()
    year = IntegerField()
    month = IntegerField()

    class Meta:
        resource_name = 'month-statistics'
