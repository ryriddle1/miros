from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product

class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = request.user.cart
        serializer = CartSerializer(cart)
        return Response(serializer.data)

class CartItemCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = request.user.cart
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class CartItemUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return CartItem.objects.get(pk=pk, cart__user=self.request.user)
        except CartItem.DoesNotExist:
            return None

    def put(self, request, pk):
        cart_item = self.get_object(pk)
        if not cart_item:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        quantity = request.data.get('quantity')
        if quantity is not None:
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartItemSerializer(cart_item)
        return Response(serializer.data)

    def delete(self, request, pk):
        cart_item = self.get_object(pk)
        if not cart_item:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CartClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        cart = request.user.cart
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)