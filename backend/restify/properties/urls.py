from django.contrib import admin
from django.urls import path

from properties.views import CreatePropertyView, UpdatePropertyView, DeletePropertyView, \
    RetrievePropertyView, RetrieveAllPropertiesView, RetrieveUserPropertiesView

app_name = "properties"
urlpatterns = [
    path('admin/', admin.site.urls),
    path('create/', CreatePropertyView.as_view(), name='create_property'),
    path('update/<int:pk>/', UpdatePropertyView.as_view(), name='update_property'),
    path('delete/<int:pk>/', DeletePropertyView.as_view(), name='delete_property'),
    path('retrieve/<int:pk>/', RetrievePropertyView.as_view(), name='retrieve_property'),
    path('retrieve/all/', RetrieveAllPropertiesView.as_view(), name='retrieve_properties'),
    path('retrieve/user/', RetrieveUserPropertiesView.as_view(), name='retrieve_properties'),
]