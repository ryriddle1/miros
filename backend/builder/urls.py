from django.urls import path
from . import views

urlpatterns = [
    path('components/', views.ComponentListView.as_view(), name='components'),
    path('check-compatibility/', views.CheckCompatibilityView.as_view(), name='check-compatibility'),
    path('builds/', views.BuildListCreateView.as_view(), name='build-list-create'),
    path('builds/<int:pk>/', views.BuildDetailView.as_view(), name='build-detail'),
    path('builds/<int:pk>/add-to-cart/', views.AddBuildToCartView.as_view(), name='add-build-to-cart'),
    path('recommend/', views.RecommendView.as_view(), name='recommend'),
    path('check-compatibility/', views.CheckCompatibilityView.as_view(), name='check-compatibility'),
]