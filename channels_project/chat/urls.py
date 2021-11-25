from django.urls import path

from . import views
from . import api_views

urlpatterns = [
    path('', views.LandingView.as_view(), name='landing'),
    path('home', views.IndexView.as_view(), name='index'),
    path('signup', views.SignUpView.as_view(), name='signup'),
    path('login', views.LogInView.as_view(), name='login'),
    path('logout', views.logout_view, name='logout'),
    path('chat/<str:username>', views.ChatView.as_view(), name='chat'),

    # api urls
    path('api/search', api_views.SearchList.as_view(), name='api-search'),
    path('api/send-message', api_views.PostMessage.as_view(), name='api-send'),
    path('api/messages', api_views.GetMessages.as_view(), name='api-messages'),
]
