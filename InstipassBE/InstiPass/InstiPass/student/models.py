from django.db import models
from institution.models import Institution
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator,MaxValueValidator
from django.utils import timezone
# Create your models here.
class Student(models.Model):
    STATUS_CHOICES = (('application_received',"Applicated has been received"),("id_processing","Your ID is being Processed"),("id_ready","Your ID is ready"))
    NOTIFICATION_CHOICES = [
    ("email", "Email"),
    ("sms", "SMS"),
    ("both","Both")
    ]
    institution = models.ForeignKey(Institution,on_delete=models.CASCADE,related_name='student_institution')
    reg_no = models.CharField(max_length=50,unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    course = models.CharField(max_length=100)
    notification_pref = models.CharField(max_length=10,choices=NOTIFICATION_CHOICES)
    admission_year = models.IntegerField(validators=[
        MinValueValidator(2020), 
        MaxValueValidator(2025)  # Correct way to get dynamic year
    ])
    email = models.EmailField(max_length=100,unique=True)
    phone_number = models.CharField(max_length=100,unique=True)
    photo = models.ImageField(upload_to='student_photo')
    status = models.CharField(choices=STATUS_CHOICES,max_length=100,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    

    def __str__(self):
        return f"{self.institution}:{self.pk}"

class Notifications(models.Model):
    recipient = models.ForeignKey(Student,on_delete = models.CASCADE)
    message = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.message} to {self.recipient.email}" 