from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserChangeForm, PasswordChangeForm
from django.contrib import messages

from .models import CustomUser


class UserRegisterForm(forms.ModelForm):
    password = forms.CharField()

    class Meta:
        model = CustomUser
        fields = ['email', 'password']

    def save(self, commit=True):
        user = super(UserRegisterForm, self).save(commit=False)  # what is super?
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserLoginForm(AuthenticationForm):

    pass


class EditUserProfileForm(UserChangeForm):
    password = None
    email = forms.EmailField(widget=forms.EmailInput(attrs={
      'class': 'form-control',
      'placeholder': 'Enter your new email'
    }))
    username = forms.CharField(max_length=15, widget=forms.TextInput(attrs={
      'class': 'form-control',
      'placeholder': 'Enter your new Username'
    }))
    first_name = forms.CharField(widget=forms.TextInput(attrs={
      'class': 'form-control',
      'placeholder': 'Enter your new first name'
    }))
    last_name = forms.CharField(widget=forms.TextInput(attrs={
      'class': 'form-control',
      'placeholder': 'Enter your new last name'
    }))

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name']


class ChangeUserPasswordForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={
      'class': 'form-control', 'placeholder': 'Old Password'
    }))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={
      'class': 'form-control', 'placeholder': 'New Password'
    }))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={
      'class': 'form-control', 'placeholder': 'Confirm New Password'
    }))

    class Meta:
        model = CustomUser
        fields = ['old_password', 'new_password1', 'new_password2']
