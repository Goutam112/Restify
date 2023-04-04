from rest_framework import generics

from accounts.models import User
from accounts.serializers import UserCreationSerializer, UserSerializer, UserEditSerializer


# Create your views here.
class CreateUser(generics.CreateAPIView):
    permission_classes = []

    queryset = User.objects.all()
    serializer_class = UserCreationSerializer


class ViewProfile(generics.RetrieveAPIView):
    permission_classes = []

    queryset = User.objects.all()
    serializer_class = UserSerializer


class GetLoggedInUser(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class EditProfile(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserEditSerializer

    def get_object(self):
        return self.request.user
