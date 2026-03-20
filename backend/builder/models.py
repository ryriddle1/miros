from django.db import models
from users.models import User
from products.models import Product

class Build(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='builds')
    name = models.CharField('Название сборки', max_length=100)
    components = models.ManyToManyField(Product, related_name='builds')
    total_price = models.DecimalField('Общая стоимость', max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (by {self.user.username})"

class PopularBuild(models.Model):
    name = models.CharField('Название сборки', max_length=100)
    components = models.ManyToManyField(Product, related_name='popular_builds')
    total_price = models.DecimalField('Общая стоимость', max_digits=10, decimal_places=2, default=0)
    purpose = models.CharField('Назначение', max_length=50, blank=True)  # gaming, office, graphics
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name