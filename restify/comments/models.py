from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from accounts.models import User


# Create your models here.
class Comment(models.Model):
    content = models.TextField(blank=False)
    post_datetime = models.DateTimeField(auto_now_add=True)
    commenter = models.ForeignKey(to=User, on_delete=models.RESTRICT)

    # Content-Types
    subject_content_type = models.ForeignKey(to=ContentType, on_delete=models.RESTRICT)
    subject_id = models.PositiveIntegerField()
    """What the comment is reviewing --- either a user or a property."""
    subject = GenericForeignKey('subject_content_type', 'subject_id')


class Review(Comment):
    rating = models.IntegerField()


class Reply(Comment):
    reply_to = models.ForeignKey(to=Review, on_delete=models.CASCADE, related_name='replies')
