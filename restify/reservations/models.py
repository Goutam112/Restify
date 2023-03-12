import enum

from django.conf import settings
from django.db import models

from properties.models import Property


# Create your models here.

class ReservationType(enum.Enum):
    INCOMING = 1
    OUTGOING = 1


class Status(models.TextChoices):
    PENDING = "PND"
    DENIED = "DND"
    EXPIRED = "EXP"
    APPROVED = "APR"
    CANCELLED = "CAN"
    TERMINATED = "TRM"
    COMPLETED = "CMP"
    CANCELLATION_REQUESTED = "CRQ"


class Reservation(models.Model):
    reserver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(choices=Status.choices, max_length=3, default=Status.PENDING)

    def __str__(self):
        return f"Reservation at {self.property.name} by {self.reserver.email} on {self.start_date}"
