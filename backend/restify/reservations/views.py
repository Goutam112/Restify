from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

from accounts.serializers import UserSerializer
from notifications.models import Notification
from properties.serializers import PropertySerializerWithUserSerializer
from reservations.models import Reservation
from reservations.models import Status
from reservations.paginators import RetrieveReservationsPaginator
from reservations.serializers import ReservationSerializerWithPropertySerializer, ReservationApprovalSerializer, \
    ReservationDenySerializer, \
    ReservationCompleteSerializer, ReservationCancellationRequestSerializer, ReservationCancelSerializer, \
    ReservationTerminateSerializer, ReservationDenyCancellationRequestSerializer, ReservationSerializer


# Create your views here.

class CreateReservationRequestView(generics.CreateAPIView):
    """
    Create a new Reservation, with status "Pending", meaning that by default,
    this Reservation is an unapproved reservation request.
    """
    serializer_class = ReservationSerializer

    def perform_create(self, serializer):
        Notification.objects.create(content="host_new_reservation",
                                    receiver=serializer.validated_data.get("property").owner)
        print("Host notified of new reservation request")
        return super().perform_create(serializer)


class UpdateReservationView(generics.RetrieveUpdateAPIView):
    """
    A view for updating a reservation.

    Not likely to be used.
    """
    serializer_class = ReservationSerializerWithPropertySerializer

    def get_object(self):
        return get_object_or_404(Reservation, pk=self.kwargs["reservation_id"])


class ReservationActionView(generics.UpdateAPIView):
    """
    A class for views that involve changing the Status of a Reservation.
    Assumes that the URL endpoint has a "reservation_id" to find a Reservation with,
    and has a "new_status" attribute to be overriden that matches with a Status which
    will be used by subclasses to set the new Status for the Reservation.

    """

    new_status = None
    allowed_statuses = []

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(
            {"current_user": self.request.user, "reservation_id": self.kwargs.get("reservation_id"),
             "new_status": self.new_status, "allowed_statuses": self.allowed_statuses
             })
        return context

    def get_object(self):
        return get_object_or_404(Reservation, pk=self.kwargs.get("reservation_id"))


class ApproveReservationView(ReservationActionView):
    new_status = Status.APPROVED

    allowed_statuses = [Status.PENDING]

    serializer_class = ReservationApprovalSerializer

    def perform_update(self, serializer):
        super().perform_update(serializer)
        reservation = Reservation.objects.get(pk=self.kwargs.get("reservation_id"))
        reserver = reservation.reserver
        Notification.objects.create(content="guest_approved_reservation", receiver=reserver)
        print("Guest notified of new reservation request approval")


class DenyReservationView(ReservationActionView):
    new_status = Status.DENIED

    allowed_statuses = [Status.PENDING]

    serializer_class = ReservationDenySerializer


class CompleteReservationView(ReservationActionView):
    new_status = Status.COMPLETED

    allowed_statuses = [Status.APPROVED]

    serializer_class = ReservationCompleteSerializer


class RequestReservationCancelView(ReservationActionView):
    new_status = Status.CANCELLATION_REQUESTED

    allowed_statuses = [Status.PENDING, Status.APPROVED]

    serializer_class = ReservationCancellationRequestSerializer

    def perform_update(self, serializer):
        super().perform_update(serializer)
        reservation = Reservation.objects.get(pk=self.kwargs.get("reservation_id"))
        owner = reservation.property.owner
        Notification.objects.create(content="host_cancellation_request", receiver=owner)
        print("Host notified of new cancellation request")


class DenyReservationCancellationRequestView(ReservationActionView):
    new_status = Status.APPROVED

    allowed_statuses = [Status.CANCELLATION_REQUESTED]

    serializer_class = ReservationDenyCancellationRequestSerializer


class ConfirmReservationCancelRequestView(ReservationActionView):
    new_status = Status.CANCELLED

    allowed_statuses = [Status.CANCELLATION_REQUESTED]

    serializer_class = ReservationCancelSerializer

    def perform_update(self, serializer):
        super().perform_update(serializer)
        reservation = Reservation.objects.get(pk=self.kwargs.get("reservation_id"))
        reserver = reservation.reserver
        Notification.objects.create(content="guest_cancellation_request", receiver=reserver)
        print("Guest notified of reservation cancel request confirmed")


class TerminateReservationView(ReservationActionView):
    new_status = Status.TERMINATED

    allowed_statuses = [Status.APPROVED]

    serializer_class = ReservationTerminateSerializer


class DeleteReservationView(generics.DestroyAPIView):
    serializer_class = ReservationSerializerWithPropertySerializer


class RetrieveReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializerWithPropertySerializer
    property = PropertySerializerWithUserSerializer()
    pagination_class = RetrieveReservationsPaginator

    def get_queryset(self):
        user = self.request.user

        requested_status = self.request.GET.get("status", None)

        filtered_reservations = Reservation.objects.all()

        if requested_status is not None:
            statuses = [Status.choices[i][0].lower() for i in range(0, len(Status.choices))]

            if requested_status.lower() in statuses:
                filtered_reservations = filtered_reservations.filter(status__iexact=requested_status)
            else:
                raise ValidationError("The filtered status doesn't exist.")

        reservation_type = self.request.GET.get("type", None)

        # If the reservation type filter is "incoming", then show only reservation requests to ones concerning the
        # user's property.
        # If the reservation type filter is "outgoing", then show only reservation requests to ones
        # concerning properties where the user is trying to reserve.
        if reservation_type == "incoming":
            filtered_reservations = filtered_reservations.filter(property__owner=user)
        elif reservation_type == "outgoing":
            filtered_reservations = filtered_reservations.filter(reserver=user)
        else:
            # For safety, don't show all reservations if the params get bypassed
            # filtered_reservations = filtered_reservations.filter(property__owner=user)
            raise ValidationError("You must specify to filter for incoming or outgoing reservation requests.")

        return filtered_reservations
