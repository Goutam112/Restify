from django.contrib.contenttypes.models import ContentType
from rest_framework import generics, status
from rest_framework.response import Response

from accounts.models import User
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
    pagination_class = PropertyCommentPaginator
    serializer_class = PropertyThreadSerializer

    def get_queryset(self):
        threads = Review.objects.filter(
            subject_content_type=ContentType.objects.get_for_model(Property),
            subject_id=self.kwargs.get('subject_id')
        ).order_by('-post_datetime')

        return threads
