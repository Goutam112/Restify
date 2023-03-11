from rest_framework import generics
from rest_framework import generics
from rest_framework.generics import get_object_or_404

from properties.models import Property
from properties.serializers import PropertySerializer, TestSerializer
from properties.paginators import RetrievePropertiesPaginator


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
    """
    Retrieve all properties that belong to the requested user.
    """
    serializer_class = PropertySerializer
    pagination_class = RetrievePropertiesPaginator

    def get_queryset(self):
        owner_id = self.kwargs["owner_pk"]

        filtered_properties = Property.objects.filter(owner=owner_id)

        # sort_by = self.request.GET.get("sort_by", None)
        #
        # if sort_by == "price":
        #     filtered_properties = filtered_properties.order_by(nightly_price=)

        return filtered_properties

class CreateTestView(generics.CreateAPIView):
    serializer_class = TestSerializer
