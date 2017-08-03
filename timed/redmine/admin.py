from django.contrib import admin

from timed.projects.admin import ProjectAdmin
from timed.projects.models import Project
from timed_adfinis.redmine.models import RedmineProject

admin.site.unregister(Project)


class RedmineProjectInline(admin.StackedInline):
    model = RedmineProject


@admin.register(Project)
class ProjectAdmin(ProjectAdmin):
    """Adfinis specific project including Redmine issue configuration."""

    inlines = ProjectAdmin.inlines + [RedmineProjectInline, ]
