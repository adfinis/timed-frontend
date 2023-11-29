from django.conf import settings
from django.contrib.admin import AdminSite
from django.views.decorators.cache import never_cache


class TimedAdminSite(AdminSite):
    login_template = "login.html"

    @never_cache
    def login(self, request, extra_context=None):
        extra = {"show_local_login": settings.ALLOW_LOCAL_LOGIN}

        if isinstance(extra_context, dict):
            extra_context.update(extra)
        else:
            extra_context = extra
        return super().login(request, extra_context)
