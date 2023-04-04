from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('signup/', views.CreateUser.as_view(), name='signup'),
    path('profile/view/<pk>/', views.ViewProfile.as_view(), name='view_profile'),
    path('profile/edit/', views.EditProfile.as_view(), name='edit_profile'),
    path('currentuser/', views.GetLoggedInUser.as_view(), name='current_user')
]
