from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    """A custom User model for ease of customization."""
    username = None
    first_name = models.CharField("first name", max_length=150)
    last_name = models.CharField("last name", max_length=150)
    email = models.EmailField("email address", unique=True)
    phone_number = models.CharField(max_length=20)
    avatar = models.ImageField(default='default_avatar.png')

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
