from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)
    # phone_regex = RegexValidator(
    #   regex=r'^\+?1?\d{9,15}$',
    #   message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    # phone = models.CharField(validators=[
    #   phone_regex], max_length=17, blank=False, null=False, unique=True)  # validators should be a list
    #
    # USERNAME_FIELD = 'phone'

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
