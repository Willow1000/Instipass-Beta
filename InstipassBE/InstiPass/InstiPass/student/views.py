from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

# Create your views here.

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    arser_classes = (MultiPartParser)
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Student.objects.filter(email = self.request.user.email)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        student = get_object_or_404(Student,email = self.request.user.email)
        return Notifications.objects.filter(recipient = student)    




