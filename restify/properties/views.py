from rest_framework import generics
from rest_framework import generics
from rest_framework.generics import get_object_or_404

from properties.models import Property
from properties.serializers import PropertySerializer, TestSerializer


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


class RetrievePropertiesView(generics.ListAPIView):
    serializer_class = PropertySerializer

    def get_queryset(self):
        owner_id = self.kwargs["owner_pk"]
        return Property.objects.filter(owner=owner_id)


class CreateTestView(generics.CreateAPIView):
    serializer_class = TestSerializer
