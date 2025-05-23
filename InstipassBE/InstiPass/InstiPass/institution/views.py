
from rest_framework import viewsets, parsers

from rest_framework.permissions import IsAuthenticated,IsAdminUser

from .models import *
from Id.models import *
from rest_framework.response import Response

from rest_framework.views import APIView

from .serializers import *
from django.shortcuts import get_object_or_404,redirect
import requests

import json
from django.contrib import messages


class InstitutionViewSet(viewsets.ModelViewSet):
    serializer_class = InstitutionSerializer
    http_method_names = ['get','post','put','patch','delete']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        institution = Institution.objects.filter(email = self.request.user.email)
        return institution

class InstitutionSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = InstitutionSettingsSerializer    
    http_method_names = ['get','post','put','patch','delete']
    parser_classes = [parsers.MultiPartParser, parsers.FormParser,parsers.JSONParser]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        institution = get_object_or_404(Institution,email = self.request.user.email)
        return InstitutionSettings.objects.filter(institution = institution)

 

class IdProcessStatsAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, *args, **kwargs):
        email=self.request.GET.get("q")
        institution = get_object_or_404(Institution,email = email)
        data = {
            "registered_students": Student.objects.filter(institution=institution).count(),
            "Ids_in_Queue":len([id for id in IdOnQueue.objects.all() if id.student.institution==institution]),
            "Ids_being_processed": len([id for id in IdInProcess.objects.all() if id.Id.student.institution==institution]),
            "Ids_ready": len([id for id in IdReady.objects.all() if id.Id.Id.student.institution==institution]),
        }
        
        return Response(data=data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        institution = get_object_or_404(Institution,email = self.request.user.email)
        return Notifications.objects.filter(recipient = institution)
    
