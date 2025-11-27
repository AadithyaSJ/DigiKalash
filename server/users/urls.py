from django.urls import path
from . import views
from .views import UserRegistrationView
from .views import UserProfileView
from .views import UserListView

app_name = 'users'

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/edit/', views.profile_edit_view, name='profile_edit'),
    path('all-users/', UserListView.as_view(), name='all-users'),
    path('<str:username>/verify/', views.UserVerifyView.as_view(), name='user-verify'),
    path('<str:username>/delete/', views.UserDeleteView.as_view(), name='user-delete'),
]
