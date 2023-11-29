import redminelib
from django.conf import settings
from django.core.management.base import BaseCommand

from timed.projects.models import Project


class Command(BaseCommand):  # pragma: no cover
    help = "Update projects"

    def add_arguments(self, parser):
        parser.add_argument(
            "--pretend",
            action="store_true",
            help="Pretend mode for testing",
        )

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

        pretend = options["pretend"]

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
                amount_offered.get("value") or timed_project.amount_offered
            )
            timed_project.amount_invoiced = (
                amount_invoiced.get("value") or timed_project.amount_invoiced
            )
            if not pretend:
                timed_project.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"Updating project {timed_project.name} #{redmine_project.id} with amount offered {timed_project.amount_offered} and amount invoiced {timed_project.amount_invoiced}"
                )
            )
