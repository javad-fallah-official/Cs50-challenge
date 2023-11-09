from django.urls import path
from Alice import views

urlpatterns = [
    path('', views.home,name="home"),
    #path('login/', views.login,name="login"),
]
