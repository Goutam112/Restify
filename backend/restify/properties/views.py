from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from django import forms

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
        properties = Property.objects.all()

        # FILTERING PROPERTIES DATA
        country_filter = forms.CharField(required=False, initial='').clean(self.request.GET.get('country', None))
        min_price_filter = forms.IntegerField(required=False).clean(self.request.GET.get('minPrice', None))
        max_price_filter = forms.IntegerField(required=False).clean(self.request.GET.get('maxPrice', None))
        num_guests_filter = forms.IntegerField(required=False).clean(self.request.GET.get('minGuests', None))

        if country_filter != '':
            properties = properties.filter(country__iexact=country_filter)
        if min_price_filter is not None and max_price_filter is not None and min_price_filter > max_price_filter:
            raise ValidationError("minPrice not lte maxPrice", code=400)
        else:
            if min_price_filter is not None:
                properties = properties.filter(nightly_price__gte=min_price_filter)
            if max_price_filter is not None:
                properties = properties.filter(nightly_price__lte=int(max_price_filter))
        if num_guests_filter is not None:
            if num_guests_filter <= 0:
                raise ValidationError("minGuests has to be greater than 0", code=400)
            else:
                properties = properties.filter(max_num_guests__gte=int(num_guests_filter))

        # ORDERING PROPERTIES DATA
        order_list = [('priceasc', 'priceasc'), ('pricedesc', 'pricedesc'), ('bedsasc', 'bedsasc'),
                      ('bedsdesc', 'bedsdesc')]
        order_by = forms.ChoiceField(required=False, initial='', choices=order_list).clean(
            self.request.GET.get('orderBy', '').lower())

        if order_by != '':
            if order_by == order_list[0][0]:
                properties = properties.order_by('nightly_price')
            elif order_by == order_list[1][0]:
                properties = properties.order_by('-nightly_price')
            elif order_by == order_list[2][0]:
                properties = properties.order_by('num_beds')
            elif order_by == order_list[3][0]:
                properties = properties.order_by('-num_beds')
            else:
                raise ValidationError("Invalid orderBy choice: Choose [ priceASC / priceDESC / bedsASC / bedDESC ]",
                                      code=400)

        return properties


class RetrieveUserPropertiesView(PropertyView, generics.ListAPIView):
    """
    Retrieve all properties that belong to the requested user.
    """
    serializer_class = PropertySerializer
    pagination_class = RetrievePropertiesPaginator

    def get_queryset(self):
        filtered_properties = Property.objects.filter(owner=self.request.user)

        return filtered_properties
