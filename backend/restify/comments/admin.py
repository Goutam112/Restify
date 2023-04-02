from django.contrib import admin

from comments.models import Comment, Review, Reply

# Register your models here.
admin.site.register(Comment)
admin.site.register(Review)
admin.site.register(Reply)
