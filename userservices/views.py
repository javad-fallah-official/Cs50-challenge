from django.shortcuts import render, redirect
from .forms import UserRegisterForm, UserLoginForm, EditUserProfileForm, ChangeUserPasswordForm
from django.urls import reverse, reverse_lazy
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView
from django.views.generic.detail import DetailView
from django.contrib.auth.views import LoginView, LogoutView, PasswordChangeView
from django.views import generic
from django.contrib import messages
from .models import CustomUser


class RegisterView(SuccessMessageMixin, CreateView):
    template_name = 'userservices/users_register.html'
    form_class = UserRegisterForm
    success_url = reverse_lazy('userservices:register')
    success_message = "%(email)s was created successfully"


class CustomLoginView(SuccessMessageMixin, LoginView):
    template_name = 'userservices/users_login.html'
    form_class = UserLoginForm
    success_url = reverse_lazy('userservices:profile')

    def form_valid(self, form):
        user = form.get_user()
        messages.success(self.request, f'{user} is login successfully')
        return super().form_valid(form)


class CustomLogoutView(LogoutView):
    template_name = 'userservices/logout.html'


class UserProfileView(LoginRequiredMixin, DetailView):
    login_url = '/userservices/login/'
    redirect_field_name = 'redirect_to'
    template_name = 'userservices/users_profile.html'

    def get_object(self):
        return self.request.user


class UpdateUserView(UpdateView):
    form_class = EditUserProfileForm
    template_name = 'userservices/edit_user_profile.html'
    success_url = reverse_lazy('userservices:profile')

    def get_object(self):
        return self.request.user


class ChangeUserPasswordView(SuccessMessageMixin, PasswordChangeView):
    form_class = ChangeUserPasswordForm
    success_url = reverse_lazy('userservices:login')
    success_message = "Password Changed Successfully You Should Login Again!"
    template_name = 'userservices/change_password.html'


# def password_success(request):
#     return render(request, template_name='users/password_change_success.html')

#TODO specify errors for incorrect passwords in change password
