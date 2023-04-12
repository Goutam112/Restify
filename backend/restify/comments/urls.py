from django.urls import path

from . import views

app_name = 'comments'

urlpatterns = [
    path('user/<int:subject_id>/review/create/', views.CreateUserReview.as_view(), name='create_user_review'),
    path('user/<int:subject_id>/review/', views.ListUserReviews.as_view(), name='list_user_reviews'),
    path('user/<int:subject_id>/review/cancreate/', views.CanLeaveUserReviews.as_view(), name='can_create_user_review'),
    path('property/<int:subject_id>/review/', views.ListPropertyReviews.as_view(), name='list_property_reviews'),
    path('property/<int:subject_id>/review/create/', views.CreatePropertyReview.as_view(), name='create_property_review'),
    path('property/<int:property_id>/review/cancreate/', views.CanLeavePropertyReview.as_view(), name='can_create_property_review'),
    path('property/<int:subject_id>/reply/create/', views.CreatePropertyReply.as_view(), name='create_property_reply'),
    path('property/<int:property_id>/reply/<int:reply_to_id>/cancreate/', views.CanLeavePropertyReply.as_view(), name='can_create_user_reply'),
    path('property/<int:property_id>/ratinginfo/', views.RetrieveRatingInfo.as_view(), name='retrieve_rating_info')
]
