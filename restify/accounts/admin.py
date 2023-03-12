from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from accounts.models import User
from notifications.models import Notification

# Register your models here.
admin.site.register(User)
admin.site.register(Notification)
