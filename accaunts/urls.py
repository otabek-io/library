from django.contrib.auth.views import (
    LogoutView,
    PasswordChangeView,
    PasswordChangeDoneView,
    PasswordResetView,
    PasswordResetDoneView,
    PasswordResetConfirmView, PasswordResetCompleteView
)

from .views import Login, SignUpView, ProfileView, ProfileUpdate
from django.urls import path

urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('profile/<int:pk>/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/update/', ProfileUpdate.as_view(), name='profile-update'),
    path('password_change/', PasswordChangeView.as_view(template_name='registration/password_change.html'), name='password-change'),
    path('password_change/done/', PasswordChangeDoneView.as_view(template_name='registration/password_change_done.html'), name='password-change-done'),
    path('password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password_reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset/done/', PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('password_reset/complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]