from rest_framework import serializers
from .models import ServiceRequest, MasterCall

class ServiceRequestSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = ServiceRequest
        fields = ['id', 'user', 'device_type', 'problem_description', 'preferred_date',
                  'status', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class MasterCallSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = MasterCall
        fields = ['id', 'user', 'address', 'phone', 'preferred_time', 'description',
                  'status', 'assigned_master', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']