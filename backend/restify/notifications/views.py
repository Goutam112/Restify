from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, DestroyAPIView
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .paginators import NotificationPagination
from .serializers import NotificationSerializer, NotificationCreationSerializer

class ListNotifications(ListAPIView):
    serializer_class = NotificationSerializer
    pagination_class = NotificationPagination

    def get_queryset(self):
        """ Returns notifications for which current_user is receiver """
        user = self.request.user
        if not user.is_authenticated:
            raise AuthenticationFailed(detail="Login required", code=401)
        return Notification.objects.all().filter(receiver=user).order_by('-created_when')
    
class ReadNotification(RetrieveAPIView):
    serializer_class = NotificationSerializer
    def get_queryset(self):
        """ Returns notifications for which current_user is receiver """
        user = self.request.user
        if not user.is_authenticated:
            raise AuthenticationFailed(detail="Login required", code=401)
        return Notification.objects.all().filter(receiver=user)

class CreateNotification(CreateAPIView):
    serializer_class = NotificationCreationSerializer
    def get_queryset(self):
        """ Returns notifications for which current_user is receiver """
        user = self.request.user
        if not user.is_staff:
            raise PermissionDenied(detail="Need to be admin to create notification", code=403)
        return Notification.objects.all().filter(receiver=user)

class DeleteNotification(DestroyAPIView):
    serializer_class = NotificationSerializer
    def get_queryset(self):
        """ Returns notifications for which current_user is receiver """
        user = self.request.user
        if not user.is_authenticated:
            raise AuthenticationFailed(detail="Login required", code=401)
        return Notification.objects.all().filter(receiver=user)