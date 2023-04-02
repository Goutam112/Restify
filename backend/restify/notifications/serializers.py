from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    receiver = serializers.SerializerMethodField()
    class Meta:
        model = Notification
        fields = '__all__'

    def get_receiver(self, obj):
        return obj.receiver.email

class NotificationCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        extra_kwargs = {'id': {'read_only': True}}
