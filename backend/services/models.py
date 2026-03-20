from django.db import models
from users.models import User

class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('diagnostic', 'Диагностика'),
        ('waiting_parts', 'Ожидание запчастей'),
        ('repair', 'Ремонт'),
        ('completed', 'Готов к выдаче'),
        ('cancelled', 'Отменён'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_requests')
    device_type = models.CharField('Тип устройства', max_length=100)
    problem_description = models.TextField('Описание проблемы')
    preferred_date = models.DateField('Предпочтительная дата', null=True, blank=True)
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='pending')
    comment = models.TextField('Комментарий сотрудника', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request #{self.id} by {self.user.username}"

class MasterCall(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает обработки'),
        ('assigned', 'Назначен мастер'),
        ('in_progress', 'Выехал'),
        ('completed', 'Выполнен'),
        ('cancelled', 'Отменён'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='master_calls')
    address = models.TextField('Адрес')
    phone = models.CharField('Телефон', max_length=20)
    preferred_time = models.CharField('Предпочтительное время', max_length=100, blank=True)
    description = models.TextField('Описание проблемы')
    status = models.CharField('Статус', max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_master = models.CharField('Назначенный мастер', max_length=100, blank=True)
    comment = models.TextField('Комментарий сотрудника', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Call #{self.id} by {self.user.username}"