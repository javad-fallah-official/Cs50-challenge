from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect

class CustomLoginRequiredMixin(LoginRequiredMixin):
    login_url = '/userservices/login/'
