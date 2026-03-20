from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ServiceRequest, MasterCall
from .serializers import ServiceRequestSerializer, MasterCallSerializer
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .models import ServiceRequest, MasterCall
from .serializers import ServiceRequestSerializer, MasterCallSerializer

class UserServiceRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.service_requests.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserServiceRequestDetailView(generics.RetrieveAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.service_requests.all()

class UserMasterCallListCreateView(generics.ListCreateAPIView):
    serializer_class = MasterCallSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.master_calls.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserMasterCallDetailView(generics.RetrieveAPIView):
    serializer_class = MasterCallSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.master_calls.all()

class EmployeeServiceRequestListView(generics.ListAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAdminUser]

class EmployeeServiceRequestUpdateView(generics.UpdateAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['patch']

class EmployeeMasterCallListView(generics.ListAPIView):
    queryset = MasterCall.objects.all()
    serializer_class = MasterCallSerializer
    permission_classes = [IsAdminUser]

class EmployeeMasterCallUpdateView(generics.UpdateAPIView):
    queryset = MasterCall.objects.all()
    serializer_class = MasterCallSerializer
    permission_classes = [IsAdminUser]
    http_method_names = ['patch']


    