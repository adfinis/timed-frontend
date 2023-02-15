import datetime

import pytest
from django.core.management import call_command
from redminelib.exceptions import ResourceNotFoundError

from timed.redmine.models import RedmineProject


@pytest.mark.parametrize("pretend", [False, True])
def test_update_project_expenditure(db, mocker, capsys, report_factory, pretend):
    redmine_instance = mocker.MagicMock()
    issue = mocker.MagicMock()
    redmine_instance.issue.get.return_value = issue
    redmine_class = mocker.patch("redminelib.Redmine")
    redmine_class.return_value = redmine_instance

    report = report_factory(duration=datetime.timedelta(hours=4))
    project = report.task.project
    project.estimated_time = datetime.timedelta(hours=10)
    project.save()

    RedmineProject.objects.create(project=report.task.project, issue_id=1000)

    call_command("update_project_expenditure", pretend=pretend)

    if not pretend:
        redmine_instance.issue.get.assert_called_once_with(1000)
        assert issue.estimated_hours == project.estimated_time.total_seconds() / 3600
        assert issue.custom_fields[0]["value"] == report.duration.total_seconds() / 3600
        assert issue.custom_fields[1]["value"] == project.amount_offered.amount
        assert issue.custom_fields[2]["value"] == project.amount_invoiced.amount
        issue.save.assert_called_once_with()
    else:
        out, _ = capsys.readouterr()
        assert "Redmine issue 1000" in out
        assert f"total spent hours {report.duration.total_seconds() / 3600}" in out
        assert f"amount offered {project.amount_offered.amount}" in out
        assert f"amount invoiced {project.amount_invoiced.amount}" in out


def test_update_project_expenditure_invalid_issue(
    db, freezer, mocker, capsys, report_factory
):
    redmine_instance = mocker.MagicMock()
    redmine_class = mocker.patch("redminelib.Redmine")
    redmine_class.return_value = redmine_instance
    redmine_instance.issue.get.side_effect = ResourceNotFoundError()

    report = report_factory(duration=datetime.timedelta(hours=4))
    RedmineProject.objects.create(project=report.task.project, issue_id=1000)

    call_command("update_project_expenditure")

    out, _ = capsys.readouterr()
    assert "issue 1000 assigned. Skipping." in out
