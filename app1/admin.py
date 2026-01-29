from django.contrib import admin
from .models import Book, Category, Comment
# Register your models here.
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('name','author', 'category', 'creator')
    exclude = ('creator',)

    def save_model(self, request, obj, form, change):
        if not obj.creator:
            obj.creator = request.user
        super().save_model(request, obj, form, change)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    exclude = ('creator',)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('book','author','comment')
    exclude = ('creator',)
