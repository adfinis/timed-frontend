from django.db.models import Sum
from django.db.models.signals import pre_save
from django.dispatch import receiver

from timed.tracking.models import Report


@receiver(pre_save, sender=Report)
def update_rejected_on_reports(sender, instance, **kwargs):
    """Unreject report when the task changes."""
    # Check if the report is being created or updated
    if instance.pk and instance.rejected:
        report = Report.objects.get(id=instance.id)
        if report.task_id != instance.task_id:
            instance.rejected = False


@receiver(pre_save, sender=Report)
def update_most_recent_remaining_effort(sender, instance, **kwargs):
    """Update remaining effort on task, if remaining effort tracking is active.

    Update most_recent_remaining_effort on task and total_remaining_effort on project
    only if remaining effort on report has changed.
    Any other change on report should not trigger this signal.
    """
    if kwargs.get("raw", False):  # pragma: no cover
        return

    if not instance.pk:
        return
    if instance.task.project.remaining_effort_tracking is not True:
        return

    if instance.remaining_effort != Report.objects.get(id=instance.id).remaining_effort:
        task = instance.task
        task.most_recent_remaining_effort = instance.remaining_effort
        task.save()

        project = task.project
        total_remaining_effort = (
            project.tasks.all()
            .aggregate(sum_remaining=Sum("most_recent_remaining_effort"))
            .get("sum_remaining")
        )
        project.total_remaining_effort = total_remaining_effort
        project.save()
