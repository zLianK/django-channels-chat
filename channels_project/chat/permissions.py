from rest_framework.permissions import BasePermission


class IsInGroup(BasePermission):
    def has_permission(self, request, view):

        if request.method == 'POST':
            data = request.data
            first_user = int(data['first_user'])
            second_user = int(data['second_user'])
        else:
            data = request.query_params
            first_user = int(data.get('first_user'))
            second_user = int(data.get('second_user'))

        user_id = request.user.id

        if user_id in [first_user, second_user]:
            return True

        return False


class IsSenderTheCurrentUser(BasePermission):
    def has_permission(self, request, view):
        user_id = request.user.id
        data = request.data
        sender = int(data['sender'])

        if user_id == sender:
            return True

        return False
