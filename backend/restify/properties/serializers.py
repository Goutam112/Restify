from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

import properties
import properties.models
from accounts.serializers import UserSerializer
from properties.models import Property, PriceModifier, PropertyImage, Amenity, MonthAvailability


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


class MonthAvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthAvailability
        exclude = ['property']


class CreatePropertySerializer(serializers.ModelSerializer):
    price_modifiers = PriceModifierSerializer(many=True, required=False)
    property_images = PropertyImageSerializer(many=True, required=False)
    amenities = AmenitySerializer(many=True, required=False)
    month_availabilities = MonthAvailabilitySerializer(many=True, required=False)

    class Meta:
        model = Property
        fields = '__all__'
        # fields = [field.name for field in model._meta.fields]
        # fields.append("price_modifiers")
        # fields.append("amenities")
        # fields.append("property_images")

    def create(self, validated_data):
        # Pop "price_modifiers" from our JSON input so that all PriceModifier fields are removed
        # "price_modifiers" is an array of dictionaries mapping month to price_modifier
        # print(validated_data)
        # print(self.initial_data)
        # price_modifiers = self.initial_data["price_modifiers"]
        # print(price_modifiers)
        # print(price_modifiers[0])
        print("VALIDATED DATA: " + str(validated_data))
        price_modifiers = validated_data.pop("price_modifiers")
        property_images = validated_data.pop("property_images")
        amenities = validated_data.pop("amenities")
        month_availabilities = validated_data.pop("month_availabilities")

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

        print("GOT HERE 1")

        i = 0
        for property_image_dict in property_images:
            # Don't create more than NUM IMAGES images, even if more is supplied
            if i > properties.models.NUM_IMAGES:
                break
            PropertyImage.objects.create(property=property, image=property_image_dict.get("image"))
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

        for month_availability in month_availabilities:
            MonthAvailability.objects.create(property=property, month=month_availability["month"],
                                             is_available=month_availability["is_available"])

        if len(month_availabilities) < 12:
            for i in range(1, 13):
                if len(MonthAvailability.objects.filter(property=property, month=i)) == 0:
                    MonthAvailability.objects.create(property=property, month=i, is_available=True)

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
        month_availabilities = validated_data.pop("month_availabilities")

        # print(month_availabilities)

        self.update_all_direct_property_fields(property_to_update, **validated_data)

        PriceModifier.objects.filter(property=property_to_update).delete()

        for price_modifier in price_modifiers:
            PriceModifier.objects.create(property=property_to_update, month=price_modifier["month"],
                                         price_modifier=price_modifier["price_modifier"])

        PropertyImage.objects.filter(property=property_to_update).delete()

        i = 0
        for property_image_dict in property_images:
            # Don't create more than NUM IMAGES images, even if more is supplied
            if i > properties.models.NUM_IMAGES:
                break
            PropertyImage.objects.create(property=property_to_update, image=property_image_dict.get("image"))
            i += 1

        num_images_added = len(PropertyImage.objects.filter(property=property_to_update))

        if num_images_added < properties.models.NUM_IMAGES:
            diff = properties.models.NUM_IMAGES - num_images_added
            for _ in range(0, diff):
                PropertyImage.objects.create(property=property_to_update)

        Amenity.objects.filter(properties=property_to_update).delete()

        for amenity in amenities:
            amenity_name = amenity["name"]
            try:
                added_amenity = Amenity.objects.get(name=amenity_name)
                added_amenity.properties.add(property_to_update)
            except ObjectDoesNotExist as ex:
                added_amenity = Amenity.objects.create(name=amenity_name)
                added_amenity.properties.add(property_to_update)

        MonthAvailability.objects.filter(property=property_to_update).delete()

        for month_availability in month_availabilities:
            MonthAvailability.objects.create(property=property_to_update, month=month_availability["month"],
                                             is_available=month_availability["is_available"])

        print("Created month availabilities")

        if len(month_availabilities) < 12:
            for i in range(1, 13):
                if len(MonthAvailability.objects.filter(property=property_to_update, month=i)) == 0:
                    MonthAvailability.objects.create(property=property_to_update, month=i, is_available=True)

        property_to_update.save()

        return property_to_update


class PropertySerializerWithUserSerializer(PropertySerializer):
    owner = UserSerializer()
