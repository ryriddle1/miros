from rest_framework import serializers
from .models import Build
from products.models import Product
from products.serializers import ProductSerializer

class BuildSerializer(serializers.ModelSerializer):
    components = ProductSerializer(many=True, read_only=True)
    component_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Product.objects.all(), source='components', write_only=True
    )

    class Meta:
        model = Build
        fields = ['id', 'user', 'name', 'components', 'component_ids', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'total_price']