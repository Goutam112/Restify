import datetime

import rest_framework
from django.db.models import Q

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CharField
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

import reservations.models
from reservations.models import Reservation
from rest_framework import serializers
from rest_framework.generics import get_object_or_404

import reservations.models
from reservations.models import Reservation, Status


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        exclude = ['reserver']

    def create(self, validated_data):
        validated_data.update({'reserver': self.context['request'].user})
        super().create(validated_data)

    def validate(self, attrs):
        current_user = self.context['request'].user

        if current_user == attrs["property"].owner:
            raise serializers.ValidationError(detail="You cannot reserve your own property.")

        start_date = attrs["start_date"]
        end_date = attrs["end_date"]

        # Check if any reservations on the same Property have any overlapping dates

        # Don't count denied, terminated, expired, or cancelled
        # Note that pending requests still count, so they prevent you from reserving on days that
        # a pending reservation reserves
        prohibited_statuses = {Status.DENIED, Status.TERMINATED, Status.EXPIRED, Status.CANCELLED}

        filtered_reservations = Reservation.objects \
            .exclude(status__in=prohibited_statuses) \
            .filter(property=attrs["property"])

        # filter for any reservations that overlap in this date
        filtered_reservations = filtered_reservations.filter(
            Q(start_date__gte=start_date, start_date__lte=end_date) |
            Q(start_date__lte=start_date, end_date__gte=start_date))

        if len(filtered_reservations) > 0:
            raise ValidationError(detail="Your reservation date range overlaps with an existing reservation.")

        return super().validate(attrs)


class ReservationActionSerializer(serializers.ModelSerializer):
    """
    A serializer that dDoes the heavy-lifting validation when trying to modify a Reservation's status.
    """

    class Meta:
        model = Reservation
        fields = ["status"]
        read_only_fields = ["status"]  # Return the new status without needing it as a required input

    def update(self, instance, validated_data):
        reservation = instance
        status = self.context["new_status"]
        reservation.status = status
        reservation.save()
        return reservation

    def get_user(self):
        """Return the current user."""
        return self.context['request'].user

    def get_reservation_to_update(self):
        """Return the Reservation that we want to modify the status of."""
        return get_object_or_404(Reservation, pk=self.context["reservation_id"])

    def set_status_error_string(self):
        """
        The error string returned upon a ValidationError for not having a valid current status.
        Override this to customize it.
        """
        return f"You are trying to modify the status of a reservation with an incompatible existing status." \
               f" The reservation should have a status in {self.context['allowed_statuses']} but your" \
               f" reservation currently has status {self.get_reservation_to_update().status}."

    def validate(self, attrs):
        """
        Validates that the current status of the reservation is one of the allowed statuses in order
        to change the status to a different status, which is controlled by the "allowed_statuses" list in
        this serializer's context.
        """
        current_user = self.get_user()

        reservation_to_update = self.get_reservation_to_update()

        if reservation_to_update.status not in self.context['allowed_statuses']:
            raise serializers.ValidationError(
                detail=self.set_status_error_string())

        return super().validate(attrs)


class ReservationActionHostSerializer(ReservationActionSerializer):
    """
    Subclass to perform validation on Reservation actions that only hosts can perform.
    For example, this class ensures that the user that wants to modify this Reservation is the owner of its Property.
    """

    def validate(self, attrs):
        current_user = self.get_user()

        reservation_to_update = self.get_reservation_to_update()

        # TODO: UNCOMMENT THIS
        # if current_user != reservation_to_update.property.owner:
        #     raise serializers.ValidationError(detail="You can only modify your own property's reservations.")

        return super().validate(attrs)


class ReservationApprovalSerializer(ReservationActionHostSerializer):

    def set_status_error_string(self):
        return f"You tried to approve a non-pending reservation. The " \
               f"reservation currently has status {self.get_reservation_to_update().status}."


class ReservationDenySerializer(ReservationActionHostSerializer):

    def set_status_error_string(self):
        return f"You tried to deny a non-pending reservation. The " \
               f"reservation currently has status {self.get_reservation_to_update().status}."


class ReservationCompleteSerializer(ReservationActionHostSerializer):

    def set_status_error_string(self):
        return f"You tried to complete a non-approved reservation. The " \
               f"reservation currently has status {self.get_reservation_to_update().status}."

    def validate(self, attrs):
        """
        Contains additional validation to ensure that you cannot complete a Reservation before it is past
        its end date.
        """
        current_user = self.get_user()

        reservation_to_update = self.get_reservation_to_update()

        if datetime.date.today() < reservation_to_update.end_date:
            raise serializers.ValidationError(detail=f"You tried to complete a reservation before its end date. "
                                                     f"Today is {datetime.date.today()} while its end date is "
                                                     f"{reservation_to_update.end_date}.")

        return super().validate(attrs)


class ReservationCancellationRequestSerializer(ReservationActionSerializer):

    def set_status_error_string(self):
        return f"You tried to request a cancellation for a non-pending or non-approved reservation. The " \
               f"reservation currently has status {self.get_reservation_to_update().status}."


class ReservationCancelSerializer(ReservationActionHostSerializer):
    def set_status_error_string(self):
        return f"You tried to cancel a reservation that wasn't requested to be canceled. The " \
               f"reservation currently has status {self.get_reservation_to_update().status}."


class ReservationTerminateSerializer(ReservationActionHostSerializer):
    def set_status_error_string(self):
        return f"You tried to terminate a reservation that wasn't approved." \
               f" The reservation currently has status {self.get_reservation_to_update().status}."
