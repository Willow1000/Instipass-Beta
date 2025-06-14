from django.db import models
from django.contrib.auth.models import AbstractUser,Group,Permission
from django.contrib.auth.base_user import BaseUserManager
# from institution.models import Institution
# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Creates and returns a regular user with the given email and password."""
        if not email:
            raise ValueError("The Email field must be set")
        
        email = self.normalize_email(email)  # Normalize email (lowercase)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # Hash password
        user.save(using=self._db)  # Save to database
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Creates and returns a superuser with all permissions."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)
    

class User(AbstractUser):
    email = models.EmailField(unique=True)  
    # username = models.CharField(unique=False,max_length=50)# <--- This is the key line
    role = models.CharField(max_length=20)
    permissions = models.ManyToManyField(Permission, related_name="student_user_permissions")
    groups = models.ManyToManyField(Group, related_name="student_user_groups")
    
    objects = UserManager()
    # USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

class SignupTracker(models.Model):
    fingerprint = models.CharField(max_length=64, unique=True, blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fingerprint} {self.ip_address}"


class InstitutionSignupToken(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)    
    
    def __str__(self):
        return f"{self.email}"

    

    
