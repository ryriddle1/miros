from django.db import models
import json

class Product(models.Model):
    name = models.CharField('Название', max_length=255)
    cost = models.DecimalField('Цена', max_digits=10, decimal_places=2)
    picture = models.ImageField('Изображение', upload_to='products/', null=True, blank=True)
    features = models.JSONField('Характеристики', default=dict)  # будет хранить JSON

    def __str__(self):
        return self.name