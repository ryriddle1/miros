from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Поля first_name, last_name, email, password уже есть в AbstractUser
    phone_number = models.CharField('Телефон', max_length=20, unique=True)
    shopping_cart = models.TextField('Корзина', blank=True, default='[]')   # храним JSON-список ID товаров
    constructor_history = models.TextField('История конструктора', blank=True, default='[]')
    purchase_history = models.TextField('История покупок', blank=True, default='[]')

    # Чтобы логин был уникальным и использовался как username
    username = models.CharField('Логин', max_length=150, unique=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.username