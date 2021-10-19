from rest_framework import permissions


class IsInGroup(permissions.BasePermission):
    def has_permission(self, request, view):

        user_id = request.user.id
        data = request.data
        first_user = int(data['first_user'])
        second_user = int(data['second_user'])

        if user_id in [first_user, second_user]:
            return True

        return False
