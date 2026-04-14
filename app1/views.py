from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, View, DeleteView, TemplateView, UpdateView
from django.views.generic.edit import FormMixin
from .forms import BookCreateForm, CommentForm
from app1.models import Book, Category, Rating, Comment
from django.db.models import Q, Avg, Count
from django.shortcuts import get_object_or_404
from accaunts.models import CustomUser

class HomePageView(TemplateView):
    template_name = 'home.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['latest_books'] = Book.objects.order_by('-id')[:4]
        return context

    def get_queryset(self):
        query = self.request.GET.get('search')
        result = Book.objects.filter(Q(name__icontains=query) | Q(author__icontains=query))
        return result

class BookListView(ListView):
    model = Book
    context_object_name = 'books'
    template_name = 'app1/book_list.html'
    paginate_by = 3

    def get_queryset(self):
        query = self.request.GET.get('q')
        category_id = self.request.GET.get('category')
        result = Book.objects.select_related('category').annotate(total_likes=Count('likes')).distinct()

        if category_id:
            result = result.filter(category__id=category_id)
        if query:
            result = result.filter(Q(name__icontains=query) | Q(author__icontains=query))

        return result

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        context['avg_rating'] = Rating.objects.aggregate(Avg('stars'))['stars__avg'] or 0
        context['user_count'] = CustomUser.objects.count()
        # context['book_rating'] =

        return context


class BookDetailView(DetailView,FormMixin):
    model = Book
    context_object_name = 'book'
    template_name = 'app1/book_detail.html'
    form_class = CommentForm

    def post(self, request, *args, **kwargs):

        if not request.user.is_authenticated:
            return redirect('login')

        self.object = self.get_object()

        if "stars" in request.POST and "submit_rating" in request.POST:
            stars = request.POST.get('stars')
            Rating.objects.update_or_create(
                book=self.object,
                author=request.user,
                defaults={'stars': int(stars)}
            )
            return redirect('book-detail', pk=self.object.pk)

        form = self.get_form()
        if form.is_valid():
            comment = form.save(commit=False)
            comment.author = request.user
            comment.book = self.object
            comment.save()
            return redirect('book-detail', pk=self.object.pk)

        return self.render_to_response(self.get_context_data(form=form))
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        avg_data = self.object.ratings.aggregate(Avg('stars'))
        context['avg_rating'] = avg_data['stars__avg'] or 0
        context['rating_count'] = self.object.ratings.count()

        if self.request.user.is_authenticated:
            user_rating_obj = Rating.objects.filter(book=self.object, author=self.request.user).first()
            context['user_ratings'] = user_rating_obj.stars if user_rating_obj else 0
        return context

class BookCreateView(CreateView):
    model = Book
    form_class = BookCreateForm
    template_name = 'app1/book_create.html'
    success_url = reverse_lazy('book-list')

    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super().form_valid(form)

    def form_invalid(self, form):
        print("Formada xatolik bor:", form.errors)
        return super().form_invalid(form)

class BookDeleteView(DeleteView):
    model = Book
    success_url = reverse_lazy('book-list')

    def get(self, request, *args, **kwargs):
        return self.post(request, *args, **kwargs)

class BookUpdateView(UpdateView):
    model = Book
    form_class = BookCreateForm
    template_name = 'app1/book_update.html'
    success_url = reverse_lazy('book-list')
    def form_valid(self, form):
        form.instance.creator = self.request.user
        return super().form_valid(form)


def add_category(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        if name:
            category = Category.objects.create(name=name)
            return JsonResponse({'id': category.id, 'name': category.name}, status=200)
    return JsonResponse({'error': 'Xatolik yuz berdi'}, status=400)

class CommentDeleteView(DeleteView):
    model = Comment

    def get(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)

    def get_success_url(self):
        return reverse_lazy('book-detail', kwargs={'pk': self.object.book.id})


class BookLikeView(View):
    model = Book
    context_object_name = 'book_like'

    def post(self, request, *args, **kwargs):

        book = get_object_or_404(Book, pk=kwargs['pk'])
        user = request.user

        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Login talab qilinadi'}, status=401)

        if book.likes.filter(id=user.id).exists():
            book.likes.remove(user)
            liked = False
        else:
            book.likes.add(user)
            liked = True

        return JsonResponse({
            'liked': liked,
            'likes_count': book.likes.count(),
            'book_id': book.pk
        })

class FavouriteBookView(ListView):
    model = Book
    template_name = 'app1/favourite_books.html'
    context_object_name = 'favourite_books'

    def get_queryset(self):
        # print(self.request.user.favourites.all())
        return self.request.user.favourites.all()

def create_favourite_book(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.user.is_authenticated:
        if request.method == 'POST':
            if book.favourites.filter(id=request.user.id).exists():
                book.favourites.remove(request.user)
            else:
                book.favourites.add(request.user)
    return redirect('book-detail', pk=pk)