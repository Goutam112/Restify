from rest_framework.pagination import PageNumberPagination


class RetrievePropertiesPaginator(PageNumberPagination):
    page_size = 3
