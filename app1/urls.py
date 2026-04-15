from django.urls import path
from .views import BookListView, BookDetailView, BookCreateView, add_category, CommentDeleteView, BookLikeView, \
    FavouriteBookView, create_favourite_book, BookUpdateView, BookDeleteView


urlpatterns = [
    path('', BookListView.as_view(), name='book-list'),
    path('create/', BookCreateView.as_view(), name='book-create'),
    path('<slug:slug>/', BookDetailView.as_view(), name='book-detail'),
    path('category/add/fast/', add_category, name='fast_category_add'),
    path('comment/delete/<int:pk>/', CommentDeleteView.as_view(), name='comment_delete'),
    path('books/<slug:slug>/like/', BookLikeView.as_view(), name='book_like'),
    path('favorites/', FavouriteBookView.as_view(), name='favourites'),
    path('favorite/create/<int:pk>/', create_favourite_book, name='create_favourite_book'),
    path('delete/<slug:slug>/', BookDeleteView.as_view(), name='book-delete'),
    path('update/<slug:slug>/', BookUpdateView.as_view(), name='book-update'),
]

