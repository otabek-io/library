from django import forms
from app1.models import Book, Comment, Rating


class BookCreateForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['name','author', 'category', 'description', 'image', 'book_file', 'url']

        error_messages = {
            'book_file': {
                'required': "Kitob faylini yuklang.",
                'invalid_extension': "Kechirasiz, faqat .pdf, .doc, .docx, .txt formatlari qabul qilinadi.",
            },
            'title': {
                'required': "Kitob nomini kiritish majburiy.",
            },
            'image': {
                'required': "Kitob rasmini yuklang.",
                'invalid_extension': "Faqat rasm yuklang!",
            }
        }

        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'author': forms.TextInput(attrs={'class': 'form-control'}),
            'category': forms.Select(attrs={'class': 'form-control'}),
            'description': forms.Textarea(attrs={'class': 'form-control'}),
            'image': forms.FileInput(attrs={'class': 'form-control'}),
            'book_file': forms.FileInput(attrs={'class': 'form-control'}),
            'url': forms.URLInput(attrs={'class': 'form-control'}),
        }
class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['comment']



# class AddRatingForm(forms.ModelForm):
#     class Meta:
#         model = Rating
#         fields = ['stars']