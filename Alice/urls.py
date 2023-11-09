from django.urls import path
from .views import HomeView

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    #path('login/', views.login,name="login"),
]
