from rest_framework import pagination


class UserCommentPaginator(pagination.PageNumberPagination):
    page_size = 5


class PropertyCommentPaginator(pagination.PageNumberPagination):
    page_size = 3
