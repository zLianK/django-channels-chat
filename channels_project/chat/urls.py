from django.urls import path

from . import views

urlpatterns = [
    path('', views.LandingView.as_view(), name='landing'),
    path('home', views.IndexView.as_view(), name='index'),
    path('signup', views.SignUpView.as_view(), name='signup'),
    path('login', views.LogInView.as_view(), name='login'),
    path('logout', views.logout_view, name='logout'),
]
