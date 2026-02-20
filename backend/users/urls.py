from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserLogoutView, CurrentUserView,
    GeneralUserViewSet, StartupRegistrationView, StartupViewSet
)

# Manual URL routing to avoid format_suffix_patterns issue
startups_list_view = StartupViewSet.as_view({'get': 'list'})
startups_detail_view = StartupViewSet.as_view({'get': 'retrieve'})
startups_my_view = StartupViewSet.as_view({'get': 'my_startup'})
startups_stats_view = StartupViewSet.as_view({'get': 'stats'})

general_users_detail_view = GeneralUserViewSet.as_view({'get': 'retrieve'})

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('startup/register/', StartupRegistrationView.as_view(), name='startup-register'),
    path('general/<int:pk>/', general_users_detail_view, name='general-user-detail'),
    path('startups/', startups_list_view, name='startup-list'),
    path('startups/<int:pk>/', startups_detail_view, name='startup-detail'),
    path('startups/my_startup/', startups_my_view, name='startup-my-startup'),
    path('startups/stats/', startups_stats_view, name='startup-stats'),
]
