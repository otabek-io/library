from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from accaunts.models import CustomUser

class CustomUserCreateForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name', 'last_name')
        error_messages = {
            'email': {
                'unique': 'Bu email allaqachon ro\'yxatdan o\'tgan!'
            }
        }

        def save(self, commit=True):
            user = super().save(commit=False)
            user.username = user.email
            if commit:
                user.save()
            return user
    first_name = forms.CharField(
        label='Ism',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First Name',
        })
    )
    last_name = forms.CharField(
        label='Familiya',
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last Name',
        })
    )
    email = forms.EmailField(
        label='Elektron pochta',
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email',

        })
    )
    password1 = forms.CharField(
        label='Parol',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password',
            'autocomplete': 'off',
        })
    )
    password2 = forms.CharField(
        label='Parolni takrorlang',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Repeat Password',
            'autocomplete': 'off',
        })
    )

class LoginForm(AuthenticationForm):

    username = forms.EmailField(
        label='Elektron pochta',
        widget = forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Elektron pochta kiriting',
        })
    )
    password = forms.CharField(
        label='Parol',
        widget = forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Parol',
            'autocomplete': 'off',
        })
    )

class UpdateProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name')