from datetime import date

from django.db.models import Q
from rest_framework import decorators, exceptions, response, status, viewsets
from rest_framework_json_api.serializers import ValidationError

from timed.employment.models import Employment
from timed.permissions import (
    IsAccountant,
    IsAuthenticated,
    IsCreateOnly,
    IsCustomer,
    IsReadOnly,
    IsSuperUser,
)
from timed.projects.filters import ProjectFilterSet
from timed.projects.models import CustomerAssignee, Project

from . import filters, models, notify_admin, serializers


class SubscriptionProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Subscription specific project view.

    Subscription projects are not archived projects
    which have a billing type with packages.
    """

    serializer_class = serializers.SubscriptionProjectSerializer
    filterset_class = ProjectFilterSet
    ordering_fields = ("name", "id")

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(archived=False, customer_visible=True)
        try:
            # check if user is an internal employee
            current_employment = Employment.objects.get_at(user=user, date=date.today())
            if not current_employment.is_external:  # pragma: no cover
                return queryset
        except Employment.DoesNotExist:
            # if user has no employment, check if he's a customer
            if CustomerAssignee.objects.filter(user=user, is_customer=True).exists():
                return queryset.filter(
                    Q(
                        customer__customer_assignees__user=user,
                        customer__customer_assignees__is_customer=True,
                    )
                )
        return queryset.none()


class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.PackageSerializer
    filterset_class = filters.PackageFilter

    def get_queryset(self):
        return models.Package.objects.select_related("billing_type")


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.OrderSerializer
    filterset_class = filters.OrderFilter
    permission_classes = [
        # superuser and accountants may edit all orders
        (IsSuperUser | IsAccountant)
        # customers may only create orders
        | IsCustomer & IsCreateOnly
        # all authenticated users may read all orders
        | IsAuthenticated & IsReadOnly
    ]

    def create(self, request, *args, **kwargs):
        """Override so we can issue emails on creation."""
        # check if order is acknowledged and created by admin/accountant
        if (
            request.method == "POST"
            and request.data.get("acknowledged")
            and not (request.user.is_accountant or request.user.is_superuser)
        ):
            raise ValidationError("User can not create confirmed orders!")

        project = Project.objects.get(id=request.data.get("project")["id"])
        order_duration = request.data.get("duration")

        notify_admin.prepare_and_send_email(project, order_duration)
        return super().create(request, *args, **kwargs)

    @decorators.action(
        detail=True,
        methods=["post"],
        permission_classes=[IsSuperUser | IsAccountant],
    )
    def confirm(self, request, pk=None):
        """
        Confirm order.

        Only allowed by staff members
        """
        order = self.get_object()
        order.acknowledged = True
        order.confirmedby = request.user
        order.save()

        return response.Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        return models.Order.objects.select_related("project")

    def destroy(self, request, pk):
        instance = self.get_object()
        if instance.acknowledged:
            # acknowledge orders may not be deleted
            raise exceptions.PermissionDenied()

        instance.delete()
        return response.Response(status=status.HTTP_204_NO_CONTENT)
