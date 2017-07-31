import pytest
from django.core.management import call_command

from timed.tracking.factories import ReportFactory
from timed_adfinis.redmine.models import RedmineProject


@pytest.mark.freeze_time
def test_redmine_report(db, freezer, mocker):
    """
    Test redmine report.

    Simulate reports added on Friday 2017-07-28 and cronjob run on
    Monday 2017-07-31.
    """
    redmine_instance = mocker.MagicMock()
    issue = mocker.MagicMock()
    redmine_instance.issue.get.return_value = issue
    redmine_class = mocker.patch('redminelib.Redmine')
    redmine_class.return_value = redmine_instance

    freezer.move_to('2017-07-28')
    report = ReportFactory.create()
    report_hours = report.duration.total_seconds() / 3600
    RedmineProject.objects.create(project=report.task.project, issue_id=1000)
    # report not attached to redmine
    ReportFactory.create()

    freezer.move_to('2017-07-31')
    call_command('redmine_report', options={'--last-days': '7'})

    redmine_instance.issue.get.assert_called_once_with(1000)
    assert issue.custom_fields == [{
        'id': 6,
        'value': report_hours
    }]
    assert 'Total hours: {0}'.format(report_hours) in issue.notes
    assert 'Hours in last 7 days: {0}'.format(report_hours) in issue.notes
    issue.save.assert_called_once_with()
