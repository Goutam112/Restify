from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from accounts.models import User
from properties.models import Property
from properties.serializers import CreatePropertySerializer, PropertySerializer
from properties.paginators import RetrievePropertiesPaginator


# Create your views here.


class PropertyView(generics.GenericAPIView):
    """
    An abstract class meant for views that work with one single property.
    """
    serializer_class = PropertySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["current_user"] = self.request.user
        return context

    def get_object(self):
        """
        Return the Property with the given ID passed in the URL's kwargs.
        """
        property_id = self.kwargs["pk"]
        return get_object_or_404(Property, pk=property_id)


class CreatePropertyView(PropertyView, generics.CreateAPIView):
    serializer_class = CreatePropertySerializer


class UpdatePropertyView(PropertyView, generics.RetrieveUpdateAPIView):
    serializer_class = PropertySerializer


class DeletePropertyView(PropertyView, generics.DestroyAPIView):
    serializer_class = PropertySerializer

    def destroy(self, request, *args, **kwargs):
        property = self.get_object()
        if self.request.user != property.owner:
            return Response(data={'error': "You cannot delete a property that you don't own."},
                            status=status.HTTP_400_BAD_REQUEST)
        self.perform_destroy(property)
        return Response(status=status.HTTP_204_NO_CONTENT)


class RetrievePropertyView(PropertyView, generics.RetrieveAPIView):
    serializer_class = PropertySerializer
    permission_classes = []  # Doesn't require login to access this view


class RetrieveAllPropertiesView(PropertyView, generics.ListAPIView):
    """
    Retrieve all properties.
    """
    serializer_class = PropertySerializer
    pagination_class = RetrievePropertiesPaginator
    permission_classes = []  # Doesn't require login to access this view

    def get_queryset(self):
        filtered_properties = Property.objects.all()

        return filtered_properties


class RetrieveUserPropertiesView(PropertyView, generics.ListAPIView):
    """
    Retrieve all properties that belong to the requested user.
    """
    serializer_class = PropertySerializer
    pagination_class = RetrievePropertiesPaginator

    def get_queryset(self):
        filtered_properties = Property.objects.filter(owner=self.request.user)

        return filtered_properties
