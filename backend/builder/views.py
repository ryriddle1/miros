from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from .models import Build
from .serializers import BuildSerializer
from products.models import Product
from products.serializers import ProductSerializer
from orders.models import CartItem
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .recommender import recommend
from .serializers import BuildSerializer
from products.serializers import ProductSerializer

# Простая проверка совместимости (можно вынести в отдельный модуль)
def check_compatibility(component_ids):
    # Простейшая заглушка, вернём всегда True, пока не реализована логика
    return True, []

class ComponentListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class CheckCompatibilityView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        component_ids = request.data.get('components', [])
        if not component_ids:
            return Response({'error': 'Список компонентов пуст'}, status=status.HTTP_400_BAD_REQUEST)

        compatible, issues = check_compatibility(component_ids)
        return Response({
            'compatible': compatible,
            'issues': issues
        })

class BuildListCreateView(generics.ListCreateAPIView):
    serializer_class = BuildSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.builds.all()

    def perform_create(self, serializer):
        with transaction.atomic():
            build = serializer.save(user=self.request.user)
            total = sum(p.cost for p in build.components.all())
            build.total_price = total
            build.save()

class BuildDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BuildSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.builds.all()

class AddBuildToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            build = request.user.builds.get(pk=pk)
        except Build.DoesNotExist:
            return Response({'error': 'Сборка не найдена'}, status=status.HTTP_404_NOT_FOUND)

        cart = request.user.cart
        for component in build.components.all():
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=component,
                defaults={'quantity': 1}
            )
            if not created:
                cart_item.quantity += 1
                cart_item.save()

        return Response({'message': f'Сборка добавлена в корзину', 'items_added': build.components.count()})

class RecommendView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        purpose = request.data.get('purpose')
        budget = request.data.get('budget')
        if budget:
            products = Product.objects.filter(cost__lte=budget)
        else:
            products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class RecommendView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        selected_ids = request.data.get('selected_ids', [])
        purpose = request.data.get('purpose', 'gaming')
        budget = request.data.get('budget')

        try:
            if budget:
                budget = float(budget)
        except (TypeError, ValueError):
            budget = None

        result = recommend(selected_ids, purpose, budget)
        serializer = ProductSerializer(result['recommended'], many=True)
        return Response({
            'recommended_components': serializer.data,
            'message': result['message']
        }, status=status.HTTP_200_OK)


class CheckCompatibilityView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        component_ids = request.data.get('components', [])
        if not component_ids:
            return Response({'error': 'Список компонентов пуст'}, status=status.HTTP_400_BAD_REQUEST)

        compatible, issues = check_compatibility(component_ids)
        return Response({
            'compatible': compatible,
            'issues': issues
        })        