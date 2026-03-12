from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'cost', 'picture')  # какие поля показывать в списке
    list_filter = ('cost',)  # фильтры справа
    search_fields = ('name',)  # поиск по названию