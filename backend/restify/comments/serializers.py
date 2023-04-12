from rest_framework import serializers

from accounts.models import User
from accounts.serializers import UserSerializer
from comments.models import RatingInfo
from comments.models import Review, Reply
from properties.models import Property
from reservations.models import Reservation, Status


class UserReviewCreationSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(required=False)

    class Meta:
        model = Review
        fields = ['id', 'content', 'rating', 'post_datetime', 'commenter']
        extra_kwargs = {'id': {'read_only': True}, 'commenter': {'read_only': True}, 'post_datetime': {'read_only': True}}

    def validate(self, attrs):
        user_id = self.context.get('subject_id')
        commenter = self.context.get('commenter')

        if attrs.get('rating') < 1 or attrs.get('rating') > 5:
            raise serializers.ValidationError({'rating': 'Can only be between 1-5.'})

        if not User.objects.filter(id=user_id).exists():
            raise serializers.ValidationError({'subject_id': 'Invalid user provided to review.'})

        commenter_hosted_subject = Reservation.objects.filter(reserver=user_id,
                                                              status=Status.COMPLETED,
                                                              property__owner=commenter)

        if not commenter_hosted_subject.exists():
            raise serializers.ValidationError(
                {'commenter': 'You cannot create reviews on users who have not completed stays at any of your properties.'}
            )

        # NOTE: hosts can leave as many reviews as they'd like on users

        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.update({'subject_content_type': self.context.get('subject_content_type')})
        validated_data.update({'subject_id': self.context.get('subject_id')})
        validated_data.update({'commenter': self.context.get('commenter')})
        return super().create(validated_data)


class UserReviewSerializer(serializers.ModelSerializer):
    commenter = UserSerializer()

    class Meta:
        model = Review
        fields = ['content', 'post_datetime', 'rating', 'commenter']


class PropertyReviewCreationSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(required=False)
    replies = []

    class Meta:
        model = Review
        fields = ['id', 'content', 'post_datetime', 'rating', 'commenter', 'replies']
        extra_kwargs = {
            'id': {'read_only': True},
            'commenter': {'read_only': True},
            'replies': {'read_only': True}
        }

    def validate(self, attrs):
        commenter = self.context.get('commenter')
        property_id = self.context.get('subject_id')

        if commenter is None:
            raise serializers.ValidationError({'commenter': 'No commenter found!'})

        if property_id is None:
            raise serializers.ValidationError({'subject_id': 'No property specified to review.'})

        if attrs.get('rating') < 1 or attrs.get('rating') > 5:
            raise serializers.ValidationError({'rating': 'Can only be between 1-5.'})

        if not Property.objects.filter(id=property_id).exists():
            raise serializers.ValidationError({'subject_id': 'Invalid property ID provided.'})

        commenter_completed_or_terminated_property = Reservation.objects.filter(
            reserver=commenter,
            status__in=[Status.COMPLETED, Status.TERMINATED]
        ).exists()

        commenter_already_left_review = Review.objects.filter(
            commenter=commenter,
            subject_id=property_id
        ).exists()

        # TODO: host is allowed to review their own property - should this be allowed?
        if not commenter_completed_or_terminated_property:
            raise serializers.ValidationError(
                {'commenter': 'You may only leave a review after you have completed a stay, or if your reservation was '
                              'terminated by the host.'})

        if commenter_already_left_review:
            raise serializers.ValidationError(
                {'commenter': 'You have already left a review on this property.'}
            )

        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.update({'subject_content_type': self.context.get('subject_content_type')})
        validated_data.update({'subject_id': self.context.get('subject_id')})
        validated_data.update({'commenter': self.context.get('commenter')})
        return super().create(validated_data)


class PropertyReplyCreationSerializer(serializers.ModelSerializer):
    commenter = UserSerializer(required=False)

    class Meta:
        model = Reply
        fields = ['id', 'content', 'post_datetime', 'reply_to', 'commenter']
        extra_kwargs = {
            'id': {'read_only': True},
            'commenter': {'read_only': True},
            'reply_to': {'write_only': True}
        }

    def validate(self, attrs):
        reply_to = attrs.get('reply_to')
        property_id = self.context.get('subject_id')
        commenter = self.context.get('commenter')

        if reply_to is None or not Review.objects.filter(id=reply_to.id).exists():
            raise serializers.ValidationError({'reply_to': 'No specified comment exists to reply to.'})

        property_filter = Property.objects.filter(id=property_id)
        if not property_filter.exists():
            raise serializers.ValidationError({'subject_id': 'Invalid property ID provided.'})

        prop = property_filter.get()
        if prop != reply_to.subject:
            raise serializers.ValidationError({'subject_id': 'Cannot reply to comment on a different property.'})

        if commenter is None:
            raise serializers.ValidationError({'commenter': 'No commenter found!'})

        if commenter != prop.owner and commenter != reply_to.commenter:
            raise serializers.ValidationError({'commenter': 'You are not allowed to reply!'})

        # Check if user is allowed to reply
        most_recent_reply = Reply.objects.filter(reply_to=reply_to.id).order_by('-post_datetime')
        host = prop.owner
        client = reply_to.commenter
        print('client:' + client.email)

        if not most_recent_reply.exists():
            # this is the first reply, so only host is allowed to reply
            if commenter != host:
                raise serializers.ValidationError({'commenter': 'Only the host may reply!'})
        else:
            most_recent_reply = most_recent_reply.first()
            print(most_recent_reply.id)
            if most_recent_reply.commenter == host:
                if commenter != client:
                    raise serializers.ValidationError({'commenter': 'Only the client may reply!'})
            elif most_recent_reply.commenter == client:
                if commenter != host:
                    raise serializers.ValidationError({'commenter': 'Only the host may reply!'})
            else:
                raise serializers.ValidationError({'commenter': 'You are not allowed to reply!'})

        return super().validate(attrs)

    def create(self, validated_data):
        validated_data.update({'subject_content_type': self.context.get('subject_content_type')})
        validated_data.update({'subject_id': self.context.get('subject_id')})
        validated_data.update({'commenter': self.context.get('commenter')})
        return super().create(validated_data)


class PropertyReplySerializer(serializers.ModelSerializer):
    commenter = UserSerializer()

    class Meta:
        model = Reply
        fields = ['id', 'content', 'post_datetime', 'commenter']
        extra_kwargs = {
            'id': {'read_only': True}
        }


class PropertyThreadSerializer(serializers.ModelSerializer):
    commenter = UserSerializer()
    replies = PropertyReplySerializer(many=True, read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'content', 'post_datetime', 'rating', 'commenter', 'replies']
        extra_kwargs = {
            'id': {'read_only': True}
        }

    def to_representation(self, instance):
        """The thread's replies should be in chronological order."""
        response = super().to_representation(instance)
        response['replies'] = sorted(response['replies'], key=lambda reply: reply['post_datetime'])
        return response


class PropertyRatingInfoSerializer(serializers.Serializer):
    avg_rating = serializers.FloatField()
    num_ratings = serializers.IntegerField()
