from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

import properties.models
from properties.models import Property, PriceModifier, PropertyImage, Amenity


class PriceModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceModifier
        exclude = ['property']  # Exclude the foreign key reference, we'll inject it in PropertySerializer


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        exclude = ["properties"]


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        exclude = ['property']


class CreatePropertySerializer(serializers.ModelSerializer):
    price_modifiers = PriceModifierSerializer(many=True, required=False)
    property_images = PropertyImageSerializer(many=True, required=False)
    amenities = AmenitySerializer(many=True, required=False)

    class Meta:
        model = Property
        fields = '__all__'

    def create(self, validated_data):
        # Pop "price_modifiers" from our JSON input so that all PriceModifier fields are removed
        # "price_modifiers" is an array of dictionaries mapping month to price_modifier
        price_modifiers = validated_data.pop("price_modifiers")
        property_images = validated_data.pop("property_images")
        amenities = validated_data.pop("amenities")

        # Because we popped "price_modifiers", only fields related to Property are left in validated_data
        property = Property.objects.create(**validated_data)

        i = 0
        for price_modifier in price_modifiers:
            if i > 12:
                break
            PriceModifier.objects.create(property=property, month=price_modifier["month"],
                                         price_modifier=price_modifier["price_modifier"])
            i += 1

        # Ensure that each month has a price modifier

        if len(price_modifiers) < 12:
            for i in range(1, 13):
                if len(PriceModifier.objects.filter(property=property, month=i)) == 0:
                    PriceModifier.objects.create(property=property, month=i, price_modifier=1.0)

        i = 0
        for image in property_images:
            # Don't create more than NUM IMAGES images, even if more is supplied
            if i > properties.models.NUM_IMAGES:
                break
            PropertyImage.objects.create(property=property, image=image)
            i += 1

        # If less than NUM IMAGES was passed in, pad the rest with empty images

        num_images_added = len(PropertyImage.objects.filter(property=property))

        if num_images_added < properties.models.NUM_IMAGES:
            diff = properties.models.NUM_IMAGES - num_images_added
            for _ in range(0, diff):
                PropertyImage.objects.create(property=property)

        for amenity in amenities:
            amenity_name = amenity["name"]
            try:
                added_amenity = Amenity.objects.get(name=amenity_name)
                added_amenity.properties.add(property)
            except ObjectDoesNotExist as ex:
                added_amenity = Amenity.objects.create(name=amenity_name)
                added_amenity.properties.add(property)

        return property


class PropertySerializer(CreatePropertySerializer):
    class Meta:
        model = Property
        fields = '__all__'
        read_only_fields = ["id"]

    def validate(self, attrs):
        if self.context.get("current_user") != attrs.get("owner"):
            raise ValidationError("You must be the owner of this property in order to modify it.")

        return super().validate(attrs)

    def update_all_direct_property_fields(
            self, property: properties.models.Property, owner, name, description, address, country, state,
            city, max_num_guests, num_beds, num_baths, nightly_price):
        """
        Updates all primitive fields for the given Property
        """
        property.owner = owner
        property.name = name
        property.description = description
        property.address = address
        property.country = country
        property.state = state
        property.city = city
        property.max_num_guests = max_num_guests
        property.num_beds = num_beds
        property.num_baths = num_baths
        property.nightly_price = nightly_price

    def update(self, instance, validated_data):

        property_to_update = instance

        # Pop "price_modifiers" from our JSON input so that all PriceModifier fields are removed
        # "price_modifiers" is an array of dictionaries mapping month to price_modifier
        price_modifiers = validated_data.pop("price_modifiers")
        property_images = validated_data.pop("property_images")
        amenities = validated_data.pop("amenities")

        self.update_all_direct_property_fields(property_to_update, **validated_data)

        PriceModifier.objects.filter(property=property_to_update).delete()

        for price_modifier in price_modifiers:
            PriceModifier.objects.create(property=property_to_update, month=price_modifier["month"],
                                         price_modifier=price_modifier["price_modifier"])

        PropertyImage.objects.filter(property=property_to_update).delete()

        for image in property_images:
            PropertyImage.objects.create(property=property_to_update, image=image)

        Amenity.objects.filter(properties=property_to_update).delete()

        for amenity in amenities:
            amenity_name = amenity["name"]
            try:
                added_amenity = Amenity.objects.get(name=amenity_name)
                added_amenity.properties.add(property_to_update)
            except ObjectDoesNotExist as ex:
                added_amenity = Amenity.objects.create(name=amenity_name)
                added_amenity.properties.add(property_to_update)

        property_to_update.save()

        return property_to_update
