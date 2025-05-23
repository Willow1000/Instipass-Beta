from rest_framework import viewsets
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .serializers import EmailTokenObtainPairSerializer
from .serializers import UserSerializer
from .models import User
class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(role="student")
    http_method_names = ['get','post','put','patch','delete']
   
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if 'student' in self.request.path:
            context['role'] = 'student'
        elif 'institution' in self.request.path:
            context['role'] = 'institution'
        return context

class InstitutionViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.filter(role="institution")
    http_method_names = ['get','post','put','patch','delete']
   
    def get_serializer_context(self):
        context = super().get_serializer_context()
        if 'student' in self.request.path:
            context['role'] = 'student'
        elif 'institution' in self.request.path:
            context['role'] = 'institution'
        return context


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
  
