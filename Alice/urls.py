from django.urls import path
from .views import HomeView

app_name = 'Alice'

urlpatterns = [
    path('', HomeView.as_view(), name="home"),
    #path('login/', views.login,name="login"),
]
