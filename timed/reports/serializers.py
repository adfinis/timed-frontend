from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.utils.duration import duration_string
from rest_framework_json_api import relations
from rest_framework_json_api.serializers import DurationField, IntegerField

from timed.projects.models import Customer, Project, Task
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


class CustomerStatisticSerializer(TotalTimeRootMetaMixin,
                                  DictObjectSerializer):
    duration = DurationField()
    customer = relations.ResourceRelatedField(
        source='task__project__customer', model=Customer, read_only=True
    )

    included_serializers = {
        'customer': 'timed.projects.serializers.CustomerSerializer',
    }

    class Meta:
        resource_name = 'customer-statistics'


class ProjectStatisticSerializer(TotalTimeRootMetaMixin, DictObjectSerializer):
    duration = DurationField()
    project = relations.ResourceRelatedField(
        source='task__project', model=Project, read_only=True
    )

    included_serializers = {
        'project': 'timed.projects.serializers.ProjectSerializer',
    }

    class Meta:
        resource_name = 'project-statistics'


class TaskStatisticSerializer(TotalTimeRootMetaMixin, DictObjectSerializer):
    duration = DurationField(read_only=True)
    task = relations.ResourceRelatedField(model=Task, read_only=True)

    included_serializers = {
        'task': 'timed.projects.serializers.TaskSerializer',
    }

    class Meta:
        resource_name = 'task-statistics'


class UserStatisticSerializer(TotalTimeRootMetaMixin, DictObjectSerializer):
    duration = DurationField(read_only=True)
    user = relations.ResourceRelatedField(model=get_user_model(),
                                          read_only=True)

    included_serializers = {
        'user': 'timed.employment.serializers.UserSerializer',
    }

    class Meta:
        resource_name = 'user-statistics'
