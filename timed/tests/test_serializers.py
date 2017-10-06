from datetime import timedelta

import pytest
from rest_framework_json_api.serializers import DurationField, IntegerField

from timed.serializers import DictObjectSerializer


class MyPkDictSerializer(DictObjectSerializer):
    test_duration = DurationField()
    test_nr = IntegerField()

    class Meta:
        pk_key = 'test_nr'
        resource_name = 'my-resource'


@pytest.fixture
def data():
    return {
        'test_nr': 123,
        'test_duration': timedelta(hours=1),
        'invalid_field': '1234'
    }


def test_pk_dict_serializer_single(data):
    serializer = MyPkDictSerializer(data)

    expected_data = {
        'test_duration': '01:00:00',
        'test_nr': 123,
    }

    assert expected_data == serializer.data


def test_pk_dict_serializer_many(data):
    list_data = [
        data,
        data
    ]
    serializer = MyPkDictSerializer(list_data, many=True)

    expected_data = [
        {
            'test_duration': '01:00:00',
            'test_nr': 123,
        },
        {
            'test_duration': '01:00:00',
            'test_nr': 123,
        },
    ]

    assert expected_data == serializer.data
