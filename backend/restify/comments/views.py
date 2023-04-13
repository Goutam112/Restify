from django.contrib.contenttypes.models import ContentType
from rest_framework import generics, status
from rest_framework.response import Response

from accounts.models import User
from comments.models import RatingInfo
from comments.serializers import PropertyRatingInfoSerializer
from comments.models import Reply
from reservations.models import Status
from comments.models import Review
from comments.serializers import UserReviewCreationSerializer, UserReviewSerializer, PropertyThreadSerializer, \
    PropertyReviewCreationSerializer, PropertyReplyCreationSerializer
from comments.paginators import UserCommentPaginator, PropertyCommentPaginator
from notifications.models import Notification
from properties.models import Property
from reservations.models import Reservation


# Create your views here.
class CreateUserReview(generics.CreateAPIView):
    serializer_class = UserReviewCreationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['subject_id'] = self.kwargs.get('subject_id')
        context['subject_content_type'] = ContentType.objects.get_for_model(model=User)
        context['commenter'] = self.request.user
        return context


class ListUserReviews(generics.ListAPIView):
    pagination_class = UserCommentPaginator
    serializer_class = UserReviewSerializer

    def get(self, request, *args, **kwargs):
        current_user = self.request.user
        subject_id = self.kwargs.get('subject_id')

        if not User.objects.filter(id=subject_id).exists():
            return Response({'subject_id': 'Cannot find specified user to review.'},
                            status=status.HTTP_400_BAD_REQUEST)

        current_user_hosted_subject = Reservation.objects.filter(reserver=subject_id,
                                                                 property__owner=current_user)

        if not current_user_hosted_subject.exists():
            return Response({'error': 'You cannot see reviews of users who have not stayed at any of your properties.'},
                            status=status.HTTP_403_FORBIDDEN)

        return self.list(request, *args, **kwargs)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['current_user'] = self.request.user
        return context

    def get_queryset(self):
        return Review.objects.filter(
            subject_content_type=ContentType.objects.get_for_model(User),
            subject_id=self.kwargs.get('subject_id')
        ).order_by(
            '-post_datetime'
        )


class CanLeaveUserReviews(generics.RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):
        host = self.request.user

        user_id = self.kwargs.get('subject_id')

        if not User.objects.filter(id=user_id).exists():
            return Response({'error': 'No such user exists.'}, status=status.HTTP_404_NOT_FOUND)

        user_completed_stay_on_host_properties = Reservation.objects.filter(reserver=user_id, 
                                                                            status=Status.COMPLETED, 
                                                                            property__owner=host)

        return Response({'can_leave_review': user_completed_stay_on_host_properties.exists()})


class CanLeavePropertyReview(generics.RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):
        commenter = self.request.user

        property_id = self.kwargs.get('property_id')

        if not Property.objects.filter(id=property_id).exists():
            return Response({'error': 'No such property exists.'}, status=status.HTTP_404_NOT_FOUND)

        commenter_completed_or_terminated_property = Reservation.objects.filter(
            reserver=commenter,
            property__id=property_id,
            status__in=[Status.COMPLETED, Status.TERMINATED]
        ).exists()

        commenter_already_left_review = Review.objects.filter(
            commenter=commenter,
            subject_id=property_id
        ).exists()

        can_leave_review = True

        if not commenter_completed_or_terminated_property or commenter_already_left_review:
            can_leave_review = False

        return Response({'can_leave_review': can_leave_review})


class CanLeavePropertyReply(generics.RetrieveAPIView):

    def retrieve(self, request, *args, **kwargs):
        reply_to_id = self.kwargs.get('reply_to_id')
        property_id = self.kwargs.get('property_id')
        commenter = self.request.user

        if not Review.objects.filter(id=reply_to_id).exists():
            return Response({'error': 'No specified comment exists to reply to.'})

        reply_to = Review.objects.filter(id=reply_to_id).get()

        property_filter = Property.objects.filter(id=property_id)
        if not property_filter.exists():
            return Response({'error': 'No specified property exists to reply to.'})

        prop = property_filter.get()
        if prop != reply_to.subject:
            return Response({'can_leave_review': False})

        if commenter != prop.owner and commenter != reply_to.commenter:
            return Response({'can_leave_review': False})

        # Check if user is allowed to reply
        most_recent_reply = Reply.objects.filter(reply_to=reply_to.id).order_by('-post_datetime')
        host = prop.owner
        client = reply_to.commenter

        if not most_recent_reply.exists():
            # this is the first reply, so only host is allowed to reply
            if commenter != host:
                return Response({'can_leave_review': False})
        else:
            most_recent_reply = most_recent_reply.first()
            if most_recent_reply.commenter == host:
                if commenter != client:
                    return Response({'can_leave_review': False})
            elif most_recent_reply.commenter == client:
                if commenter != host:
                    return Response({'can_leave_review': False})
            else:
                return Response({'can_leave_review': False})

        return Response({'can_leave_review': True})


class CreatePropertyReview(generics.CreateAPIView):
    serializer_class = PropertyReviewCreationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['subject_id'] = self.kwargs.get('subject_id')
        context['subject_content_type'] = ContentType.objects.get_for_model(model=Property)
        context['commenter'] = self.request.user
        return context

    def perform_create(self, serializer):
        super().perform_create(serializer)

        prop = Property.objects.get(pk=self.kwargs.get('subject_id'))

        Notification.objects.create(content='host_property_new_comment',
                                    receiver=prop.owner
                                    )


class CreatePropertyReply(generics.CreateAPIView):
    serializer_class = PropertyReplyCreationSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['subject_id'] = self.kwargs.get('subject_id')
        context['subject_content_type'] = ContentType.objects.get_for_model(model=Property)
        context['commenter'] = self.request.user
        return context


class ListPropertyReviews(generics.ListAPIView):
    permission_classes = []

    pagination_class = PropertyCommentPaginator
    serializer_class = PropertyThreadSerializer

    def get_queryset(self):
        threads = Review.objects.filter(
            subject_content_type=ContentType.objects.get_for_model(Property),
            subject_id=self.kwargs.get('subject_id')
        ).order_by('-post_datetime')

        return threads

class RetrieveRatingInfo(generics.RetrieveAPIView):
    permission_classes = []

    serializer_class = PropertyRatingInfoSerializer

    def get_object(self):
        property_id = self.kwargs.get('property_id')
        reviews = Review.objects.filter(subject_id=property_id)

        avg_rating = 0
        for review in reviews:
            avg_rating += review.rating

        if len(reviews) == 0:
            avg_rating = 0
        else:
            avg_rating = round(avg_rating / len(reviews), 2)

        return RatingInfo(avg_rating=avg_rating, num_ratings=len(reviews))
