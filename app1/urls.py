from django.urls import path
from .views import BookListView, BookDetailView, BookCreateView, add_category, CommentDeleteView, BookLikeView

urlpatterns = [
    path('', BookListView.as_view(), name='book-list'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('create/', BookCreateView.as_view(), name='book-create'),
    path('category/add/fast/', add_category, name='fast_category_add'),
    path('comment/delete/<int:pk>/', CommentDeleteView.as_view(), name='comment_delete'),
    path('books/<int:pk>/like', BookLikeView.as_view(), name='book_like'),
]