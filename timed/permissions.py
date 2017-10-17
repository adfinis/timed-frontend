from rest_framework.permissions import (SAFE_METHODS, BasePermission,
                                        IsAdminUser, IsAuthenticated)


class IsOwner(BasePermission):
    """Allows access to object only to owners."""

    def has_object_permission(self, request, view, obj):
        return obj.user_id == request.user.id


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


class IsAuthenticated(IsAuthenticated):
    """
    Support mixing permission IsAuthenticated with object permission.

    This is needed to use IsAdminUser with rest condition and or
    operator.
    """

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsAdminUser(IsAdminUser):
    """
    Support mixing permission IsAdminUser with object permission.

    This is needed to use IsAdminUser with rest condition and or
    operator.
    """

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsSuperUser(BasePermission):
    """Allows access only to superuser."""

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
