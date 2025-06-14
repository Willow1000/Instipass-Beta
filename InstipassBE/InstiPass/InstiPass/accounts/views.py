from rest_framework import viewsets, status
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .serializers import EmailTokenObtainPairSerializer
from .serializers import UserSerializer
from .models import User,SignupTracker
from django.views.generic import TemplateView
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
# Translation (for `_("Password reset")`)
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_protect

from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from institution.utils import decode_application_token
from rest_framework.response import Response



def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# Your password reset form (custom)
 # Adjust the import path based on your project

# Optional: Mixin for password reset views (only if used in your base view)
from django.contrib.auth.views import PasswordContextMixin
from django.views.generic.edit import FormView
from accounts.forms import PasswordResetForm
class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(role="student")
    http_method_names = ['get','post','put','patch','delete']
   
    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     if 'student' in self.request.path:
    #         context['role'] = 'student'
    #     elif 'institution' in self.request.path:
    #         context['role'] = 'institution'
    #     return context

class InstitutionViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(role='institution')
    http_method_names = ['get','post','put','patch','delete']
   
    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     if 'student' in self.request.path:
    #         context['role'] = 'student'
    #     elif 'institution' in self.request.path:
    #         context['role'] = 'institution'
    #     return context
    @method_decorator(ensure_csrf_cookie)
    def list(self, request):
        # Optionally list all students (or just forbid)
        return Response({"detail": "Method not allowed."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @method_decorator(ensure_csrf_cookie)
    def create(self, request):
        fingerprint = request.data.get('fingerprint')
        cookie_flag = request.COOKIES.get('form_submitted')

        # Block if fingerprint already submitted
        if fingerprint and SignupTracker.objects.filter(fingerprint=fingerprint).exists():
            return Response({"detail": "Already submitted with this device."}, status=status.HTTP_403_FORBIDDEN)

        # Block if no fingerprint but cookie exists
        if not fingerprint and cookie_flag:
            return Response({"detail": "Already submitted (cookie detected)."}, status=status.HTTP_403_FORBIDDEN)

        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():   
            serializer.save()

            # Log submission tracker
            SignupTracker.objects.create(
                fingerprint=fingerprint or None,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )

            response = Response({"detail": "registration successful."}, status=status.HTTP_201_CREATED)
            response.set_cookie('form_submitted', 'true', max_age=60 * 60 * 24 * 365, httponly=True)
            
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)         


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response['access_token'] = str(response.data.get('access'))
            # response['csrf_token'] = str(response.data.get("csrf_token"))
            refresh = response.data.get('refresh')

            response.set_cookie(
                key='refresh_token',
                value=refresh,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60*60*24,
            )
        return response
class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            response['access_token'] = str(response.data.get('access'))
            # response['csrf_token'] = str(response.data.get("csrf_token"))
            refresh = response.data.get('refresh')

            response.set_cookie(
                key='refresh_token',
                value=refresh,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60*60*24,
            )
        return response    


class PasswordResetView(PasswordContextMixin, FormView):
    email_template_name = "password_reset_email.html"
    extra_email_context = None
    form_class = PasswordResetForm
    from_email = None
    html_email_template_name = None
    subject_template_name = "password_reset_subject.txt"
    success_url = reverse_lazy("password_reset_done")
    template_name = "password_reset_form.html"
    title = _("Password reset")
    token_generator = default_token_generator

    @method_decorator(csrf_protect)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def form_valid(self, form):
        opts = {
            "use_https": self.request.is_secure(),
            "token_generator": self.token_generator,
            "from_email": self.from_email,
            "email_template_name": self.email_template_name,
            "subject_template_name": self.subject_template_name,
            "request": self.request,
            "html_email_template_name": self.html_email_template_name,
            "extra_email_context": self.extra_email_context,
        }
        form.save(**opts)
        return super().form_valid(form)    

class PasswordResetDoneView(TemplateView):
    template_name = 'done.html'

class PasswordResetSuccessView(TemplateView):
    template_name = "succsseful_reset.html"  

class SignupTokenAPIView(APIView):
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

        elif type(response) == 'dict':
            # Assume the decoded response contains institution_id or some valid payload
            institution_id = response.get('institution_id')
            return Response({'institution_id': institution_id,'institution':institution}, status=status.HTTP_200_OK)   
        else:
            return Response({'detail': 'Token is invalid.'}, status=status.HTTP_400_BAD_REQUEST)                  
  
