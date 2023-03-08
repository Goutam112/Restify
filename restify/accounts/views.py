from rest_framework.generics import CreateAPIView

from accounts.models import User
from accounts.serializers import UserCreationSerializer


# Create your views here.
class CreateUser(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreationSerializer



