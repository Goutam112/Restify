from django.conf import settings
from django.db import models

from properties.models import Property


# Create your models here.

class Reservation(models.Model):

    class Status(models.TextChoices):
        PENDING = "PND"
        DENIED = "DND"
        EXPIRED = "EXP"
        APPROVED = "APR"
        CANCELLED = "CAN"
        TERMINATED = "TRM"
        COMPLETED = "CMP"

    reserver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(choices=Status.choices, max_length=3, default=Status.PENDING)

    def __str__(self):
        return f"Reservation at {self.property.name} by {self.reserver.email} on {self.start_date}"

    class Meta:
        unique_together = ["property", "start_date", "end_date"]

