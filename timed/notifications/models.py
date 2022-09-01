from django.db import models

from timed.projects.models import Project


class Notification(models.Model):
    BUDGET_CHECK_30 = "budget_check_30"
    BUDGET_CHECK_70 = "budget_check_70"

    NOTIFICATION_TYPE_CHOICES = [
        (BUDGET_CHECK_30, "project budget exceeded 30%"),
        (BUDGET_CHECK_70, "project budget exceeded 70%"),
    ]

    NOTIFICATION_TYPES = [n for n, _ in NOTIFICATION_TYPE_CHOICES]

    sent_at = models.DateTimeField(null=True)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, null=True, related_name="notifications"
    )
    notification_type = models.CharField(
        max_length=50, choices=NOTIFICATION_TYPE_CHOICES
    )

    def __str__(self):
        return f"Notification: {self.get_notification_type_display()}, id: {self.pk}"
