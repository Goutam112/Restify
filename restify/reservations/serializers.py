from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.generics import get_object_or_404
from reservations.models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
