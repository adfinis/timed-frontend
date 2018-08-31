from datetime import date

import pytest
from django.core.management import call_command

from timed.employment.factories import UserFactory
from timed.projects.factories import ProjectFactory, TaskFactory
from timed.tracking.factories import ReportFactory


@pytest.mark.freeze_time('2017-8-4')
def test_notify_reviewers(db, mailoutbox):
    """Test time range 2017-7-1 till 2017-7-31."""
    # a reviewer which will be notified
    reviewer_work = UserFactory.create()
    project_work = ProjectFactory.create()
    project_work.reviewers.add(reviewer_work)
    task_work = TaskFactory.create(project=project_work)
    ReportFactory.create(date=date(2017, 7, 1), task=task_work,
                         verified_by=None)

    # a reviewer which doesn't have any unverfied reports
    reviewer_no_work = UserFactory.create()
    project_no_work = ProjectFactory.create()
    project_no_work.reviewers.add(reviewer_no_work)
    task_no_work = TaskFactory.create(project=project_no_work)
    ReportFactory.create(date=date(2017, 7, 1), task=task_no_work,
                         verified_by=reviewer_no_work)

    call_command(
        'notify_reviewers_unverified',
        '--cc=example@example.com',
        '--message=This is a test'
    )

    # checks
    mail = mailoutbox[0]
    assert len(mailoutbox) == 1
    assert mail.to == [reviewer_work.email]
    url = (
        'http://localhost:4200/analysis?fromDate=2017-07-01&'
        'toDate=2017-07-31&reviewer=%d&editable=1'
    ) % reviewer_work.id
    assert url in mail.body
    assert 'This is a test' in mail.body
    assert mail.cc == ['example@example.com']
