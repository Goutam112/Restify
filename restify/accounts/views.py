from rest_framework import generics

from accounts.models import User
from accounts.serializers import UserCreationSerializer, UserSerializer


# Create your views here.
class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreationSerializer


class ViewProfile(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer




