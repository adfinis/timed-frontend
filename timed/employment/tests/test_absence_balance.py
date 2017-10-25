from datetime import date, timedelta

from django.core.urlresolvers import reverse
from rest_framework import status

from timed.employment.factories import (AbsenceCreditFactory,
                                        AbsenceTypeFactory, EmploymentFactory)
from timed.tracking.factories import AbsenceFactory, ReportFactory


def test_absence_balance_full_day(auth_client, django_assert_num_queries):
    day = date(2017, 2, 28)

    user = auth_client.user
    EmploymentFactory.create(user=user, start_date=day)
    absence_type = AbsenceTypeFactory.create()

    AbsenceCreditFactory.create(
        date=day,
        user=user,
        days=5,
        absence_type=absence_type
    )

    # credit on different user, may not show up
    AbsenceCreditFactory.create(
        date=date.today(),
        absence_type=absence_type
    )

    AbsenceFactory.create(
        date=day,
        user=user,
        type=absence_type
    )

    AbsenceFactory.create(
        date=day - timedelta(days=1),
        user=user,
        type=absence_type
    )

    url = reverse('absence-balance-list')

    with django_assert_num_queries(7):
        result = auth_client.get(url, data={
            'date': '2017-03-01',
            'user': user.id,
            'include': 'absence_credits,absence_type'
        })

    assert result.status_code == status.HTTP_200_OK
    json = result.json()
    assert len(json['data']) == 1
    entry = json['data'][0]

    assert (
        entry['id'] ==
        '{0}_{1}_2017-03-01'.format(user.id, absence_type.id)
    )
    assert entry['attributes']['credit'] == 5
    assert entry['attributes']['used-days'] == 2
    assert entry['attributes']['used-duration'] is None
    assert entry['attributes']['balance'] == 3

    assert len(json['included']) == 2


def test_absence_balance_fill_worktime(auth_client, django_assert_num_queries):
    day = date(2017, 2, 28)

    user = auth_client.user
    EmploymentFactory.create(
        user=user, start_date=day,
        worktime_per_day=timedelta(hours=5)
    )
    absence_type = AbsenceTypeFactory.create(fill_worktime=True)

    ReportFactory.create(
        user=user,
        date=day + timedelta(days=1),
        duration=timedelta(hours=4)
    )

    AbsenceFactory.create(date=day + timedelta(days=1),
                          user=user,
                          type=absence_type)

    AbsenceFactory.create(date=day,
                          user=user,
                          type=absence_type)

    url = reverse('absence-balance-list')
    with django_assert_num_queries(10):
        result = auth_client.get(url, data={
            'date': '2017-03-01',
            'user': user.id
        })
    assert result.status_code == status.HTTP_200_OK

    json = result.json()
    assert len(json['data']) == 1
    entry = json['data'][0]

    assert (
        entry['id'] ==
        '{0}_{1}_2017-03-01'.format(user.id, absence_type.id)
    )

    assert entry['attributes']['credit'] is None
    assert entry['attributes']['balance'] is None
    assert entry['attributes']['used-days'] is None
    assert entry['attributes']['used-duration'] == '06:00:00'
