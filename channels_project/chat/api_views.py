from django.utils.timezone import now
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .permissions import IsInGroup
from .models import ChatGroup
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response


class SearchList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        queryset = {}
        # Get data and error checking
        try:
            search = request.GET['search']
            if search == '':
                return HttpResponseRedirect(reverse='index')
        except:
            return HttpResponseRedirect(reverse('index'))

        queryset['searching_for'] = search

        # Get users and sort it
        users = User.objects.filter(username__contains=search)
        users_ordered = sorted(
            users, key=lambda user: user.username.lower().find(search))
        serializer = UserSerializer(users_ordered, many=True)

        queryset['users'] = serializer.data

        return Response(queryset)


class CreateGroupView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsInGroup]

    def post(self, request):
        data = request.data
        first_user = int(data['first_user'])
        second_user = int(data['second_user'])
        users = sorted([first_user, second_user])

        try:
            group = ChatGroup.objects.get(user_1=users[0], user_2=users[1])
            if request.user.id == group.user_1:
                group.status_user_1 = 'e'
                group.last_change_1 = now()
            else:
                group.status_user_2 = 'e'
                group.last_change_2 = now()
            group.save()

            return Response({'message': 'Group successfully enabled to the current user.'})
        except:
            user_1 = User.objects.get(id=users[0])
            user_2 = User.objects.get(id=users[1])

            if request.user.id == first_user:
                group = ChatGroup(user_1=user_1, user_2=user_2,
                                  last_change_1=now(), status_user_1='e')
                group.save()
            else:
                group = ChatGroup(user_1=user_1, user_2=user_2,
                                  last_change_2=now(), status_user_2='e')
                group.save()

            return Response({'message': 'Group successfully created.'})
