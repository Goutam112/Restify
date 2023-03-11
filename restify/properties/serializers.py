from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.generics import get_object_or_404

import properties.models
from properties.models import Property, TestModel, PriceModifier, TestPriceModifier, PropertyImage, Amenity


class PriceModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriceModifier
        exclude = ['property']  # Exclude the foreign key reference, we'll inject it in PropertySerializer


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        exclude = ["properties"]


class TestPriceModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestPriceModifier
        exclude = ["test_model"]  # Exclude the foreign key reference, we'll inject it in TestModelSerializer


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        exclude = ['property']


class PropertySerializer(serializers.ModelSerializer):
    price_modifiers = PriceModifierSerializer(many=True, required=False)
    property_images = PropertyImageSerializer(many=True)
    amenities = AmenitySerializer(many=True)

    class Meta:
        model = Property
        fields = '__all__'

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

    def create(self, validated_data):
        # Pop "price_modifiers" from our JSON input so that all PriceModifier fields are removed
        # "price_modifiers" is an array of dictionaries mapping month to price_modifier
        price_modifiers = validated_data.pop("price_modifiers")
        property_images = validated_data.pop("property_images")
        amenities = validated_data.pop("amenities")

        # Because we popped "price_modifiers", only fields related to Property are left in validated_data
        property = Property.objects.create(**validated_data)

        for price_modifier in price_modifiers:
            PriceModifier.objects.create(property=property, month=price_modifier["month"],
                                         price_modifier=price_modifier["price_modifier"])

        for image in property_images:
            PropertyImage.objects.create(property=property, image=image)

        for amenity in amenities:
            amenity_name = amenity["name"]
            try:
                added_amenity = Amenity.objects.get(name=amenity_name)
                added_amenity.properties.add(property)
            except ObjectDoesNotExist as ex:
                added_amenity = Amenity.objects.create(name=amenity_name)
                added_amenity.properties.add(property)

        return property


class TestSerializer(serializers.ModelSerializer):
    test_price_modifiers = TestPriceModifierSerializer(many=True)  # List of price_modifiers

    class Meta:
        model = TestModel
        # We'll take in a list of price_modifiers in our JSON input, expect they don't have any associated TestModel
        fields = ['thing', 'test_price_modifiers']

    def create(self, validated_data):
        # Pop "price_modifiers" from our JSON input so that all PriceModifier fields are removed
        test_price_modifiers = validated_data.pop("test_price_modifiers")

        # Because we popped "price_modifiers", only fields related to Property are left in validated_data
        test_model = TestModel.objects.create(**validated_data)

        # For each price_modifier object in our JSON list, serialize it and save into our database
        # while injecting the TestModel we just created into it
        for test_price_modifier in test_price_modifiers:
            TestPriceModifier.objects.create(test_model=test_model, month=test_price_modifier["month"],
                                             price_modifier=test_price_modifier["price_modifier"])

        return test_model
