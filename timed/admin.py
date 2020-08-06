from django.contrib.admin import AdminSite


class TimedAdminSite(AdminSite):
    login_template = "login.html"
