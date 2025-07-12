from student.serializers import StudentSerializer
from student.models import Student

from rest_framework.permissions import IsAuthenticated,IsAdminUser

from .models import *
from Id.models import *


from rest_framework.views import APIView

from .serializers import *
from django.shortcuts import get_object_or_404,redirect
import requests

import json
from django.contrib import messages

from rest_framework.parsers import MultiPartParser
from accounts.models import InstitutionSignupToken

from rest_framework import viewsets, status,parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import DemoBooking
from administrator.models import DemoBookingTracker, ContactUsTracker
from .utils import decode_application_token,generate_signup_token

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

class InstitutionsViewSet(viewsets.ModelViewSet):
    serializer_class = InstitutionSerializer
    http_method_names = ['get']
    queryset = Institution.objects.all()

class InstitutionViewSet(viewsets.ModelViewSet):
    serializer_class = InstitutionSerializer
    http_method_names = ['get','post','put','patch','delete','options']
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        institution = Institution.objects.filter(email = self.request.user.email)
        return institution

    # @method_decorator(ensure_csrf_cookie)
    # # def list(self, request):
    # #     # Optionally list all students (or just forbid)
    # #     return Response({"detail": "Method not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @method_decorator(ensure_csrf_cookie)
    def create(self, request):
        fingerprint = request.data.get('fingerprint')
        cookie_flag = request.COOKIES.get('form_submitted')

        # Block if fingerprint already submitted
        if fingerprint and RegistrationTracker.objects.filter(fingerprint=fingerprint).exists():
            messages
            return Response({"detail": "Already submitted with this device."}, status=status.HTTP_403_FORBIDDEN)

        # Block if no fingerprint but cookie exists
        if not fingerprint and cookie_flag:
            return Response({"detail": "Already submitted (cookie detected)."}, status=status.HTTP_403_FORBIDDEN)

        serializer = InstitutionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Log submission tracker
            RegistrationTracker.objects.create(
                user = request.user,
                fingerprint=fingerprint or None,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )

            response = Response({"detail": "registration successful."}, status=status.HTTP_201_CREATED)
            response.set_cookie('form_submitted', 'true', max_age=60 * 60 * 24 * 365, httponly=True)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     

class InstitutionSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = InstitutionSettingsSerializer    
    http_method_names = ['get','post','put','patch','delete','options']
    parser_classes = [parsers.MultiPartParser, parsers.FormParser,parsers.JSONParser]
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        institution = get_object_or_404(Institution,email = self.request.user.email)
        settings=InstitutionSettings.objects.filter(institution = institution)
    
        return settings

class InstitutionStudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def get_queryset(self):
        institution = get_object_or_404(Institution,email = self.request.user.email)
        students = Student.objects.filter(institution=institution)
        return students

class IdProcessStatsAPIView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, *args, **kwargs):
        email=self.request.GET.get("q")
        institution = get_object_or_404(Institution,email = email)
        data = {
            "registered_students": Student.objects.filter(institution=institution).count(),
            "Ids_being_processed": Student.objects.filter(institution=institution,status='id_processing').count(),
            "Ids_ready": Student.objects.filter(institution=institution,status='id_ready').count(),
        }
        
        return Response(data=data)

class InstitutionTokenAPIView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self, request, *args, **kwargs):
        # Step 1: Extract token from the JSON body
        token = request.data.get('token')

        if not token:
            return Response({'detail': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Decode the token
        response = decode_application_token(token)

        # Step 3: Handle different cases
        if response == 'Token expired':
            return Response({'detail': 'Token has expired.'}, status=status.HTTP_401_UNAUTHORIZED)

        elif response == 'Token invalid':
            return Response({'detail': 'Token is invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

        elif type(response) == dict and response.get('valid'):
            # Assume the decoded response contains institution_id or some valid payload
            institution_id = response.get('institution_id')
            if institution_id:
                return Response({'institution_id': institution_id,'institution':institution}, status=status.HTTP_200_OK) 
            else:
                return  Response({'detail':"Token is valid"}, status=status.HTTP_200_OK) 

        else:
            return Response({'detail': 'Token is invalid. mwisho'}, status=status.HTTP_400_BAD_REQUEST)

class CreateSignupTokenAPIView(APIView):
    # permission_classes=[IsAuthenticated]
    def post(self,request, *args, **kwargs):
        email = request.data.get('email')            
        if not email:
            return Response({'detail': 'email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Decode the token
        token_obj = generate_signup_token(email)
        token = token_obj.get('token')
        InstitutionSignupToken.objects.create(
            email=email,
            token = token
        )
        
        response = Response({'detail': 'Token created sucssessfully.'}, status=status.HTTP_201_CREATED)
        return response

# class DecodeSignupTokenAPIView(APIView):
#     permission_classes=[IsAuthenticated]
#     def post(self,request, *args, **kwargs):
        # Step 1: Extract token from the JSON body
        token = request.data.get('token')

        if not token:
            return Response({'detail': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Decode the token
        response = decode_application_token(token)

        # Step 3: Handle different cases
        if response == 'Token expired':
            return Response({'detail': 'Token has expired.'}, status=status.HTTP_401_UNAUTHORIZED)

        elif response == 'Token invalid':
            return Response({'detail': 'Token is invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

        elif type(response) == 'dict':
            # Assume the decoded response contains institution_id or some valid payload
            institution_id = response.get('institution_id')
            return Response({'institution_id': institution_id,'institution':institution}, status=status.HTTP_200_OK)   
        else:
            return Response({'detail': 'Token is invalid.'}, status=status.HTTP_400_BAD_REQUEST)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    http_method_names = ['get','post']
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        institution = get_object_or_404(Institution,email = self.request.user.email)
        return Notifications.objects.filter(recipient = institution)
    
class ConfirmDemo(APIView):
    def get(self, request, *args, **kwargs):
        id = self.request.GET.get("pk")  
        if not id:
            return Response({'detail':'pk is required'},status=status.HTTP_400_BAD_REQUEST)
        demo = DemoBooking.objects.filter(id = id)    
        if demo.exists():
            demo_obj = demo.last()
            if demo_obj.status == 'CONFIRMED':
                return Response({'detail':'session is already confirmed'},status=status.HTTP_409_CONFLICT)
            demo_obj.status = 'CONFIRMED' 
            demo_obj.save()
            return Response({'detail':"Demo session confirmed"}, status=status.HTTP_200_OK)
        else:
            message.warning(self.request,"record does not exist")
            return Response({'detail':'Demo session does not exist'},status=status.HTTP_404_NOT_FOUND)    

class NewsLetterViewSet(viewsets.ModelViewSet):
    queryset = NewsLetter.objects.all()
    serializer_class = NewsLetterSerializer
    http_method_names = ['post']

class NotificationsViewSet(viewsets.ModelViewSet):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    http_method_names = ['post']
    @method_decorator(ensure_csrf_cookie)
    def create(self, request):
        fingerprint = request.data.get('fingerprint')
        ip_address = get_client_ip(request)

        # Block if fingerprint already submitted
        if fingerprint and ContactUsTracker.objects.filter(fingerprint=fingerprint).count() >= 5 or ContactUsTracker.objects.filter(ip_address=ip_address).count()>=5:
            messages
            return Response({"detail": "Limit reached"}, status=status.HTTP_403_FORBIDDEN)

        # Block if no fingerprint but cookie exists
        

        serializer = ContactUsSerializer(data=request.data)
        if serializer.is_valid():
            print(serializer.is_valid())
            serializer.save()
            # Log submission tracker
            ContactUsTracker.objects.create(
                fingerprint=fingerprint or None,
                ip_address=ip_address,
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            response = Response({"detail": "Message successfully."}, status=status.HTTP_201_CREATED)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)     
       

class DemoBookingViewSet(viewsets.ModelViewSet):
    queryset = DemoBooking.objects.all()
    serializer_class = DemoBookingSerializer
    http_method_names=['post','get']
    @method_decorator(ensure_csrf_cookie)
    def create(self, request):
        fingerprint = request.data.get('fingerprint')
        ip_address = get_client_ip(request)

        # Block if fingerprint already submitted
        if fingerprint and DemoBookingTracker.objects.filter(fingerprint=fingerprint).count() >= 5 or DemoBookingTracker.objects.filter(ip_address=ip_address).count()>=5:
            messages
            return Response({"detail": "Limit reached"}, status=status.HTTP_403_FORBIDDEN)

        # Block if no fingerprint but cookie exists
        

        serializer = DemoBookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            # Log submission tracker
            DemoBookingTracker.objects.create(
                fingerprint=fingerprint or None,
                ip_address=ip_address,
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )

            response = Response({"detail": "Demo sessioin booked successfuly"}, status=status.HTTP_201_CREATED)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    
