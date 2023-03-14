from django.contrib import admin
from django.urls import path

from reservations.views import CreateReservationRequestView, RetrieveReservationsView, UpdateReservationView, \
    ApproveReservationView, DenyReservationView, CompleteReservationView, RequestReservationCancelView, \
    ConfirmReservationCancelRequestView, TerminateReservationView, DenyReservationCancellationRequestView

app_name = "reservations"
urlpatterns = [
    path('admin/', admin.site.urls),
    path('create/', CreateReservationRequestView.as_view(), name='create_reservation'),
    path('retrieve/all/', RetrieveReservationsView.as_view(), name='retrieve_reservations'),
    # path('retrieve/all/<int:user_id>/', RetrieveReservationsView.as_view(), name='retrieve_reservations'),
    path('update/<int:reservation_id>/', UpdateReservationView.as_view(), name='update_reservation'),
    path('approve/<int:reservation_id>/', ApproveReservationView.as_view(), name='approve_reservation'),
    path('deny/<int:reservation_id>/', DenyReservationView.as_view(), name='deny_reservation'),
    path('complete/<int:reservation_id>/', CompleteReservationView.as_view(), name='complete_reservation'),
    path('req_cancellation/<int:reservation_id>/', RequestReservationCancelView.as_view(), name='req_cancellation_reservation'),
    path('cancel/<int:reservation_id>/', ConfirmReservationCancelRequestView.as_view(), name='cancel_reservation'),
    path('deny_cancellation_req/<int:reservation_id>/', DenyReservationCancellationRequestView.as_view(), name='deny_cancel_reservation'),
    path('terminate/<int:reservation_id>/', TerminateReservationView.as_view(), name='terminate_reservation'),
]