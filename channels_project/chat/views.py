from django.shortcuts import render
from django.views.generic import TemplateView


class SignUpView(TemplateView):
    template_name = 'chat/signup.html'


class LogInView(TemplateView):
    template_name = 'chat/login.html'
