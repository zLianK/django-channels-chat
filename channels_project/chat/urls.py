from django.urls import path

from . import views
from . import api_views

urlpatterns = [
    path('', views.LandingView.as_view(), name='landing'),
    path('home', views.IndexView.as_view(), name='index'),
    path('search', views.SearchView.as_view(), name='search'),
    path('signup', views.SignUpView.as_view(), name='signup'),
    path('login', views.LogInView.as_view(), name='login'),
    path('logout', views.logout_view, name='logout'),

    # api urls
    path('api/search', api_views.SearchList.as_view(), name='api-search'),
    path('api/create-group', api_views.CreateGroupView.as_view(), name='create-group')
]
