from rest_framework import serializers
from accounts.models import User


class UserCreationSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'repeat_password', 'phone_number', 'avatar']
        extra_kwargs = {
            'id': {'read_only': True}, 'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs.get('repeat_password') != attrs.get('password'):
            raise serializers.ValidationError({'password': 'Passwords must match.'})

        cleaned_phone_number = _clean_phone_number(attrs.get('phone_number'))

        if len(cleaned_phone_number) != 10 or not cleaned_phone_number.isnumeric():
            raise serializers.ValidationError({'phone_number': 'Phone number is invalid.'})

        attrs.update({'phone_number': cleaned_phone_number})

        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.pop('repeat_password')

        return super().create(validated_data)


class UserEditSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'avatar']
        extra_kwargs = {
            'id': {'read_only': True}
        }

    def validate(self, attrs):
        if attrs.get('phone_number') is not None:
            cleaned_phone_number = _clean_phone_number(attrs.get('phone_number'))

            if len(cleaned_phone_number) != 10 or not cleaned_phone_number.isnumeric():
                raise serializers.ValidationError({'phone_number': 'Phone number is invalid.'})

            attrs.update({'phone_number': cleaned_phone_number})

        return super().validate(attrs)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'avatar']


def _clean_phone_number(phone_number: str) -> str:
    symbols_to_remove = ('(', ')', ' ', '-')
    cleaned_phone_number = []
    for char in phone_number:
        if char not in symbols_to_remove:
            cleaned_phone_number.append(char)
    print(cleaned_phone_number)
    return "".join(cleaned_phone_number)
