import enum

from django.conf import settings
from django.db import models

from properties.models import Property


# Create your models here.


class Status(models.TextChoices):
    PENDING = "Pending"
    DENIED = "Denied"
    EXPIRED = "Expired"
    APPROVED = "Approved"
    CANCELLED = "Cancelled"
    TERMINATED = "Terminated"
    COMPLETED = "Completed"
    CANCELLATION_REQUESTED = "CancellationRequested"


class Reservation(models.Model):
    reserver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(choices=Status.choices, max_length=32, default=Status.PENDING)

    def __str__(self):
        return f" {self.pk} | Reservation at {self.property.name} by {self.reserver.email} on {self.start_date}"
