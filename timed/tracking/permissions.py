from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsOwnerOrStaffElseReadOnly(BasePermission):
    """
    Restrict writing to object for owner or staff only.

    Changing an object is only allowed if object belongs to current user
    or user is a staff member.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.user_id == request.user.id or request.user.is_staff
