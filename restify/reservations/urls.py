from django.contrib import admin
from django.urls import path

from reservations.views import CreateReservationView

app_name = "reservations"
urlpatterns = [
    path('admin/', admin.site.urls),
    path('create/', CreateReservationView.as_view(), name='create_reservation'),
]