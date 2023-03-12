from django.urls import path
from .views import ListNotifications, ReadNotification, CreateNotification, DeleteNotification

app_name = 'notifications'

urlpatterns = [
    path('list/', ListNotifications.as_view(), name='list'),
    path('<int:pk>/', ReadNotification.as_view(), name='read'),
    path('create/', CreateNotification.as_view(), name='create'),
    path('clear/<int:pk>/', DeleteNotification.as_view(), name='clear')
]
