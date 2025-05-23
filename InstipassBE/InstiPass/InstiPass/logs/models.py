from django.db import models
import uuid
from accounts.models import User
from Id.models import *

# Create your models here.

    

class APIAccessLog(models.Model):
    REQUEST_METHOD_CHOICES = [
        ("GET",'GET'),
        ("POST","POST"),
        ('DELETE','DELETE'),
        ("PUT","PUT"),
        ("PATCH","PATCH")
    ]    

    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    endpoint = models.CharField(max_length=255)
    request_method = models.CharField(max_length=10,choices=REQUEST_METHOD_CHOICES)
    user_id = models.CharField(max_length=36)
    status_code = models.IntegerField(null=True,blank=True)
    ip_address = models.GenericIPAddressField(null=True,blank=True)
    request_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_id} {self.endpoint} {self.ip_address} {self.status_code}"

    
class IdprogressLog(models.Model):
    Id = models.OneToOneField(IdOnQueue,on_delete=models.CASCADE)
    queued_on = models.DateTimeField(null=True,blank=True)
    started_processing = models.DateTimeField(null=True,blank=True)
    finished_processing = models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return f"{self.Id}"

class AdminActionsLog(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    action = models.CharField(max_length=20)
    admin = models.ForeignKey(User,on_delete = models.CASCADE,null=True)
    victim_type = models.CharField(max_length=20)
    victim = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)