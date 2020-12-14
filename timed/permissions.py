from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticated

from timed.projects import models as projects_models


class IsUnverified(BasePermission):
    """Allows access only to verified objects."""

    def has_object_permission(self, request, view, obj):
        return obj.verified_by_id is None


class IsReadOnly(BasePermission):
    """Allows read only methods."""

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsDeleteOnly(BasePermission):
    """Allows only delete method."""

    def has_permission(self, request, view):
        return request.method == "DELETE"

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsNotDelete(BasePermission):
    """Disallow delete method."""

    def has_permission(self, request, view):
        return request.method != "DELETE"

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsCreateOnly(BasePermission):
    """Allows only create method."""

    def has_permission(self, request, view):
        return request.method == "POST"

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsUpdateOnly(BasePermission):
    """Allows only update method."""

    def has_permission(self, request, view):
        return request.method in ["PATCH", "PUT"]

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsAuthenticated(IsAuthenticated):
    """
    Support mixing permission IsAuthenticated with object permission.

    This is needed to use IsAuthenticated with rest condition and or
    operator.
    """

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsOwner(IsAuthenticated):
    """Allows access to object only to owners."""

    def has_object_permission(self, request, view, obj):
        if not super().has_object_permission(request, view, obj):  # pragma: no cover
            return False

        return obj.user_id == request.user.id


class IsSupervisor(IsAuthenticated):
    """Allows access to object only to supervisors."""

    def has_object_permission(self, request, view, obj):
        if not super().has_object_permission(request, view, obj):  # pragma: no cover
            return False

        return request.user.supervisees.filter(id=obj.user_id).exists()


class IsReviewer(IsAuthenticated):
    """Allows access to object only to reviewers."""

    def has_permission(self, request, view):
        if not super().has_permission(request, view):  # pragma: no cover
            return False

        if request.method not in SAFE_METHODS:
            return request.user.reviews.exists()

        return True

    def has_object_permission(self, request, view, obj):
        if not super().has_object_permission(request, view, obj):  # pragma: no cover
            return False

        user = request.user

        if isinstance(obj, projects_models.Task):
            return obj.project.reviewers.filter(id=user.id).exists()

        return obj.task.project.reviewers.filter(id=user.id).exists()


class IsSuperUser(IsAuthenticated):
    """Allows access only to superuser."""

    def has_permission(self, request, view):
        if not super().has_permission(request, view):  # pragma: no cover
            return False

        return request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsNotTransferred(BasePermission):
    """Allows access only to not transferred objects."""

    def has_object_permission(self, request, view, obj):
        return not obj.transferred


class IsNotBilledAndVerfied(BasePermission):
    """Allows access only to not billed and not verfied objects."""

    def has_object_permission(self, request, view, obj):
        return not obj.billed or obj.verified_by_id is None
