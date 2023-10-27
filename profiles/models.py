from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class User(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=25)
    last_name = models.CharField(max_length=25)
    age = models.IntegerField(max_length=3)
    email = models.EmailField(max_length=100)
    phone_number = models.IntegerField(max_length=25)
    national_id = models.IntegerField(max_length=25)
    birth_date = models.DateField()

    def __repr__(self):
        return self.first_name


class User_skills(models.Model):
    user_id = models.IntegerField()
    skill_id = models.CharField(max_length=20)


class Skills(models.Model):
    name = models.CharField(max_length=25)
    skill_id = models.IntegerField(primary_key=True)
    
    
    
    
class Room(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=25)
    user_id = models.IntegerField()



class User_Room(models.Model):
    user_id = models.IntegerField()
    room_id = models.CharField(max_length=25)


    def __repr__(self):
        return self.name