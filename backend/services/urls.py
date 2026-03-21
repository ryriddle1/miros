from django.urls import path
from . import views

urlpatterns = [
    path('service-requests/', views.UserServiceRequestListCreateView.as_view(), name='user-service-requests'),
    path('service-requests/<int:pk>/', views.UserServiceRequestDetailView.as_view(), name='user-service-request-detail'),
    path('call-master/', views.UserMasterCallListCreateView.as_view(), name='user-master-calls'),
    path('call-master/<int:pk>/', views.UserMasterCallDetailView.as_view(), name='user-master-call-detail'),
    # Эндпоинты для сотрудников (по желанию)
    path('employee/service-requests/', views.EmployeeServiceRequestListView.as_view(), name='employee-service-requests'),
    path('employee/service-requests/<int:pk>/', views.EmployeeServiceRequestUpdateView.as_view(), name='employee-service-request-update'),
    path('employee/call-master/', views.EmployeeMasterCallListView.as_view(), name='employee-master-calls'),
    path('employee/call-master/<int:pk>/', views.EmployeeMasterCallUpdateView.as_view(), name='employee-master-call-update'),
]