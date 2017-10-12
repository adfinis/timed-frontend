from django.contrib import admin

from timed.redmine.models import RedmineProject


class RedmineProjectInline(admin.StackedInline):
    model = RedmineProject
