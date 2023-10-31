from django.urls import path
from .views import RegisterView, CustomLoginView, UserProfileView, CustomLogoutView, UpdateUserView,\
  ChangeUserPasswordView

app_name = 'userservices'


urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', CustomLoginView.as_view(), name="login"),
    path('profile/me/', UserProfileView.as_view(), name="profile"),
    path('logout/', CustomLogoutView.as_view(), name='logout'),
    path('edit_profile/', UpdateUserView.as_view(), name='edit_user'),
    path('change_password', ChangeUserPasswordView.as_view(), name='change-password')
]
