from django.conf import settings
from django.db import models


# Create your models here.

NUM_IMAGES = 6

class Property(models.Model):
    """
    A representation of a Property.

    Properties have additional Many-To-One relationships:
    - Each Property has a set of PriceModifier objects, which map {month, price_modifier} to allow
    the property have a different nightly price depending on the date.
    - Each Property has 6 PropertyImage objects

    Properties have a Many-To-Many relationship:
    - Each Property has a set of Amenity objects
    """
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False, blank=False)
    name = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField()
    address = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    max_num_guests = models.PositiveIntegerField(verbose_name="Maximum number of guests")
    num_beds = models.PositiveIntegerField(verbose_name="Number of beds")
    num_baths = models.PositiveIntegerField(verbose_name="Number of baths")
    nightly_price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.pk} | {self.name} owned by {str(self.owner)}"


class PriceModifier(models.Model):
    # The property has multiple price modifiers, so call that set "price_modifiers"
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="price_modifiers")
    month = models.PositiveIntegerField()
    price_modifier = models.DecimalField(max_digits=3, decimal_places=2)

    def __str__(self):
        return f"{self.property}: Month {self.month} at multiplier {self.price_modifier}"

    class Meta:
        unique_together = ['property', 'month', 'price_modifier']


class PropertyImage(models.Model):
    property = models.ForeignKey(Property, related_name="property_images", on_delete=models.CASCADE, null=True,
                                 blank=True)
    image = models.ImageField(default="empty_image.jpg")

    def __str__(self):
        return f"Image for Property {self.property.pk}"


class AmenityObject(models.TextChoices):
    WIFI = "WiFi"
    KITCHEN = "Kitchen"
    POOL = "Pool"
    BACKYARD = "Backyard"


class Amenity(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False)
    properties = models.ManyToManyField(Property, related_name="amenities")

    def __str__(self):
        return self.name
