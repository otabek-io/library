from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.contrib import messages
from .forms import LoginForm, CustomUserCreateForm, UpdateProfileForm
from django.views.generic import CreateView, DetailView, UpdateView

from .models import CustomUser


# Create your views here.
class SignUpView(CreateView):
    form_class = CustomUserCreateForm
    template_name = 'registration/sign_up.html'
    success_url = reverse_lazy('login')

class Login(LoginView):
    template_name = 'registration/login.html'
    form_class = LoginForm
    success_url = reverse_lazy('home')

    def form_valid(self, form):
        messages.success(self.request, 'Tizimga muvafaqiyatli kirildi' + self.request.user.username)
        return super().form_valid(form)

class ProfileView(DetailView):
    model = CustomUser
    template_name = 'registration/profile.html'
    context_object_name = 'profile'

class ProfileUpdate(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = CustomUser
    form_class = UpdateProfileForm
    template_name = 'registration/profile_update.html'

    def get_object(self, queryset=None):
        return self.request.user

    def test_func(self):
        return self.get_object() == self.request.user

    def get_success_url(self):
        return reverse_lazy('profile', kwargs={'pk': self.object.pk})

    def form_valid(self, form):
        messages.success(self.request, 'Profile muvafaqiyatli yangilandi!')
        return super().form_valid(form)