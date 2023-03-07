from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    """A custom User model for ease of customization."""
    phone_number = models.CharField(max_length=10)
    avatar = models.ImageField(default='default_avatar.png')
