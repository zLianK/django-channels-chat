from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from .serializers import UserSerializer, MessageSerializer
from .permissions import IsInGroup, IsSenderTheCurrentUser
from .models import ChatGroup, Message
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.timezone import now


class SearchList(APIView):
    permission_classes = [IsAuthenticated]

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


class PostMessage(APIView):
    permission_classes = [IsAuthenticated, IsSenderTheCurrentUser]

    def post(self, request):
        data = request.data

        content = data['content']
        sender = User.objects.get(id=data['sender'])
        recipient = User.objects.get(id=data['recipient'])

        message = Message(content=content, sender=sender,
                          recipient=recipient, status=True)
        message.save()

        return Response({'message': 'Successfully sent.'})


class GetMessages(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]

    def get(self, request):
        data = request.query_params

        first_user = int(data.get('first_user'))
        second_user = int(data.get('second_user'))

        users = [first_user, second_user]

        queryset = {}

        messages = Message.objects.filter(
            sender__in=users, recipient__in=users).order_by('id')

        serializer = MessageSerializer(messages, many=True)

        queryset['users'] = users
        queryset['messages'] = serializer.data

        return Response(queryset)


class UpdateGroup(APIView):
    permission_classes = [IsAuthenticated, IsInGroup]

    def post(self, request):

        data = request.data
        first_user = data['first_user']
        second_user = data['second_user']

        datetime = now()

        try:
            group = ChatGroup.objects.get(
                user_1=first_user, user_2=second_user)
            group.last_change = datetime
        except:
            group = ChatGroup(
                user_1=first_user,
                status_user_1='e',
                user_2=second_user,
                status_user_2='e',
                last_change=datetime
            )

        group.save()

        return Response({'message': 'Successfully updated'})
