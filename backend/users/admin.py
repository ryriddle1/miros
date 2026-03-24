from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'phone_number', 'is_staff')
    list_filter = ('is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'phone_number')

    # Форма редактирования (добавляем телефон и другие текстовые поля)
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительные поля', {'fields': ('phone_number', 'shopping_cart', 'constructor_history', 'purchase_history')}),
    )

    # Форма добавления (включаем все нужные поля)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'first_name', 'last_name', 'email', 'phone_number',
                'password1', 'password2', 'is_active', 'is_staff', 'is_superuser',
                'groups', 'user_permissions'
            ),
        }),
    )