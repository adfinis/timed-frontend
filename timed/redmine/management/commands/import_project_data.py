import redminelib
from django.conf import settings
from django.core.management.base import BaseCommand

from timed.projects.models import Project


class Command(BaseCommand):  # pragma: no cover
    help = "Update projects"

    def handle(self, *args, **options):
        redmine = redminelib.Redmine(
            settings.REDMINE_URL,
            key=settings.REDMINE_APIKEY,
        )

        open_redmine_projects = list(
            redmine.issue.filter(
                tracker_id=6, status="open", project_id=settings.REDMINE_BUILD_PROJECT
            )
        )
        closed_redmine_projects = list(
            redmine.issue.filter(
                tracker_id=6,
                status_id=5,
                closed_on="y",
                project_id=settings.REDMINE_BUILD_PROJECT,
            )
        )

        redmine_projects = open_redmine_projects + closed_redmine_projects

        for redmine_project in redmine_projects:
            timed_project = Project.objects.filter(
                redmine_project__issue_id=redmine_project.id,
            ).first()

            if not timed_project:
                continue

            custom_fields = list(redmine_project.custom_fields.values())

            amount_offered = next(
                item for item in custom_fields if item["name"] == "Offeriert"
            )

            amount_invoiced = next(
                item for item in custom_fields if item["name"] == "Verrechnet"
            )

            timed_project.amount_offered = (
                amount_offered["value"]
                if amount_offered != ""
                else timed_project.amount_offered
            )
            timed_project.amount_invoiced = (
                amount_invoiced["value"]
                if amount_invoiced != ""
                else timed_project.amount_invoiced
            )
            timed_project.save()
