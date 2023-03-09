import rest_framework.response
from django.db import IntegrityError
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import serializers, generics
from rest_framework.generics import get_object_or_404
from rest_framework.status import HTTP_400_BAD_REQUEST

from properties.serializers import PropertySerializer, TestSerializer, TestPriceModifierSerializer
from properties.models import PriceModifier, Property, TestModel


# Create your views here.

class CreatePropertyView(generics.CreateAPIView):
    serializer_class = PropertySerializer


class UpdatePropertyView(generics.RetrieveUpdateAPIView):
    serializer_class = PropertySerializer

    def get_object(self):
        """
        Return the Property with the given ID passed in the URL's kwargs.
        """
        property_id = self.kwargs["pk"]
        return get_object_or_404(Property, pk=property_id)


class DeletePropertyView(generics.DestroyAPIView):
    serializer_class = PropertySerializer

    def get_object(self):
        property_id = self.kwargs["pk"]
        return get_object_or_404(Property, pk=property_id)


class RetrievePropertyView(generics.RetrieveAPIView):
    serializer_class = PropertySerializer

    def get_object(self):
        property_id = self.kwargs["pk"]
        return get_object_or_404(Property, pk=property_id)


class CreateTestView(generics.CreateAPIView):
    serializer_class = TestSerializer
