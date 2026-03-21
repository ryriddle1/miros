from django.contrib import admin
from .models import ServiceRequest, MasterCall

admin.site.register(ServiceRequest)
admin.site.register(MasterCall)