from django.urls import reverse
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import TemplateView
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator

from .decorators import chat, unauthenticated_user_only, authenticated_user_only


@method_decorator(authenticated_user_only, name='dispatch')
class IndexView(TemplateView):
    template_name = 'chat/index.html'


@method_decorator(chat, name='dispatch')
class ChatView(TemplateView):
    template_name = 'chat/chat.html'

    def get(self, request, username):

        try:
            recipient = User.objects.get(username=username)
        except:
            return HttpResponseRedirect(reverse('index'))

        return render(request, self.template_name, {'recipient': recipient})


@method_decorator(unauthenticated_user_only, name='dispatch')
class LandingView(TemplateView):
    template_name = 'chat/landing.html'


@method_decorator(unauthenticated_user_only, name='dispatch')
class SignUpView(TemplateView):
    template_name = 'chat/signup.html'

    def get(self, request):
        return render(request, self.template_name, {})

    def post(self, request):
        # Getting data
        data = request.POST

        name = data['name']
        username = data['username']
        email = data['email']
        password = data['password']
        confirmation = data['confirmation']

        context = {}
        context['content'] = {
            'name': name,
            'username': username,
            'email': email,
        }

        # Error checking
        error = []

        input_name = ['Name', 'Username', 'Email',
                      'Password', 'Password Confirmation']
        input_content = [name, username, email, password, confirmation]

        for i in range(len(input_content)):
            if input_content[i] == '':
                error.append(f"{input_name[i]} can't be blank.")

        if len(password) < 8:
            error.append('Password must have 8+ characters.')

        if password != confirmation:
            error.append('Passwords must match.')

        if email.find('@') == -1 and email != '':
            error.append('Email not valid.')

        if len(error) > 0:

            context['error'] = error

            return render(request, self.template_name, context)

        # Attempt to create new user
        try:
            user = User.objects.create_user(
                username=username, email=email, password=password, first_name=name)
            user.save()
        except IntegrityError:
            return render(request, self.template_name, {'error': 'Username already taken.'})

        # Log the user in
        login(request, user)

        return HttpResponseRedirect(reverse('index'))


@method_decorator(unauthenticated_user_only, name='dispatch')
class LogInView(TemplateView):
    template_name = 'chat/login.html'

    def get(self, request):
        return render(request, self.template_name, {})

    def post(self, request):
        # Getting data
        data = request.POST
        username = data['username']
        password = data['password']

        context = {}
        context['content'] = {
            'username': username,
        }

        # Error checking
        error = []

        input_name = ['Username', 'Password']
        input_content = [username, password]

        for i in range(len(input_content)):
            if input_content[i] == '':
                error.append(f"{input_name[i]} can't be blank.")

        if len(error) > 0:
            context['error'] = error
            return render(request, self.template_name, context)

        # Attempt to authenticate user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse('index'))
        else:
            error.append('Invalid username and/or password.')
            context['error'] = error
            return render(request, self.template_name, context)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('landing'))
