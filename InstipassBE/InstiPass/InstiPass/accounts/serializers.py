from rest_framework import serializers
from .models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied 
from django.middleware.csrf import get_token


class UserSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password1= serializers.CharField(write_only = True,min_length = 8)
    password = serializers.CharField(write_only =False ,min_length = 8)

       

    def validate(self,data):
        if data['password'] != data['password1']:
            raise serializers.ValidationError("Passwords do not match")
        if User.objects.filter(email=data['email']):
            raise serializers.ValidationError("User with email already exists")     
        return data    
        
    def create(self,validated_data):

        role = self.context.get('role')
        user=User.objects.create_user(username=validated_data["username"],email=validated_data['email'],password = validated_data['password1'],role=role)
     
        return user
        



class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }
        user = authenticate(request=self.context['request'], **credentials)
        if user is None:
            raise serializers.ValidationError("Invalid email or password")

        user_obj = get_object_or_404(User, email=getattr(user, 'email', None))
        if user_obj.role != 'student' and "student" in self.context['request'].path.lower():
            raise PermissionDenied("Only students can access this endpoint.")
        elif user_obj.role != 'institution' and "institution" in self.context['request'].path.lower():
            raise PermissionDenied("Only Institutions can access this endpoint.")

        data = super().validate(attrs)
        csrf_token = get_token(self.context['request'])
        data['user'] = {
            'id': user.id,
            'email': user.email,
            'username': user.username
        }
        data['csrf_token'] = csrf_token
        return data
