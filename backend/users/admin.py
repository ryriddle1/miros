from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'phone_number', 'is_staff')
    list_filter = ('is_staff', 'is_superuser')
    search_fields = ('username', 'email')