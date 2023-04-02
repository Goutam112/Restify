from django.contrib import admin
from properties.models import *

# Register your models here.
admin.site.register(Property)
admin.site.register(PriceModifier)
admin.site.register(PropertyImage)
admin.site.register(Amenity)