from rest_framework import decorators, exceptions, response, status, viewsets

from timed.permissions import (
    IsAccountant,
    IsAuthenticated,
    IsCreateOnly,
    IsCustomer,
    IsReadOnly,
    IsSuperUser,
)
from timed.projects.filters import ProjectFilterSet
from timed.projects.models import Project

from . import filters, models, serializers


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
        return Project.objects.filter(archived=False, customer_visible=True)


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
