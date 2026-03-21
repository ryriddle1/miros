from django.urls import path
from .views import CartDetailView, CartItemCreateView, CartItemUpdateDeleteView, CartClearView, OrderListCreateView, OrderDetailView

urlpatterns = [
    path('', CartDetailView.as_view(), name='cart-detail'),
    path('items/', CartItemCreateView.as_view(), name='cart-item-create'),
    path('items/<int:pk>/', CartItemUpdateDeleteView.as_view(), name='cart-item-detail'),
    path('clear/', CartClearView.as_view(), name='cart-clear'),
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail')
]