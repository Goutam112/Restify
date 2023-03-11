from django.shortcuts import render
from rest_framework import generics

from reservations.serializers import ReservationSerializer


# Create your views here.

class CreateReservationView(generics.CreateAPIView):
    serializer_class = ReservationSerializer

