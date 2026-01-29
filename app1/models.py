from django.db import models
import io
from PIL import Image
from django.core.files.base import ContentFile
from django.core.validators import FileExtensionValidator, MinValueValidator, MaxValueValidator
from accaunts.models import CustomUser


class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name
    class Meta:
        verbose_name_plural = "Kategoriyalar"

class Book(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='books')
    description = models.TextField()
    author = models.CharField(max_length=100)
    image = models.ImageField(upload_to='books/images/', validators=[FileExtensionValidator(allowed_extensions=['jpg', 'png', 'jpeg', 'bmp'])])
    book_file = models.FileField(upload_to='books/files/', validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx', 'txt'])])
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    likes = models.ManyToManyField(CustomUser, blank=True, related_name='likes')
    favorites = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        img = Image.open(self.image)
        img.thumbnail((800,800))
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=70)
        output.seek(0)
        self.image = ContentFile(output.read(), name=self.image.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['name', 'author']),
        ]

class Comment(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.username} - {self.book.name}"

    class Meta:
        verbose_name_plural = "Izohlar"
        ordering = ['-created_at']

class Rating(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    stars = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    class Meta:
        unique_together = (('book', 'author'),)

    def __str__(self):
        return f"{self.user.first_name} - {self.stars} stars"