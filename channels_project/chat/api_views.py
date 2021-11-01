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
