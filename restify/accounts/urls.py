from django.urls import path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('signup/', views.CreateUser.as_view(), name='signup'),
    path('view/<pk>', views.ViewProfile.as_view(), name='view'),
]