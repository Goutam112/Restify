from django.db import models
from accounts.models import User

CONTENT = [
    ('HOST', (
        ('host_new_reservation', 'New reservation'),
        ('host_cancellation_request', 'Cancellation Request')
    )),
    ('GUEST', (
        ('guest_approved_reservation', 'Approved reservation'),
        ('guest_cancellation_request', 'Cancellation Request')
    ))
]
class Notification(models.Model):
    content = models.CharField(choices=CONTENT, max_length=200) # simplify the description
    created_when = models.DateTimeField(auto_now_add=True) # auto_now vs auto_now_add (use auto_now_add for defaulting to created datetime)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE) 

    def __str__(self):
        return f"{self.receiver}-{self.category}: {self.content}"