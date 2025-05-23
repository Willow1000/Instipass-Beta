from django.db import models
from django.core.validators import MinValueValidator,MaxValueValidator
from django.utils.timezone import now
# from accounts.models import User

# Create your models here.
class Institution(models.Model):
    REGION_CHOICES = [
    ("Central", "Central"),
    ("Coast", "Coast"),
    ("Eastern", "Eastern"),
    ("Nairobi", "Nairobi"),
    ("North Eastern", "North Eastern"),
    ("Nyanza", "Nyanza"),
    ("Rift Valley", "Rift Valley"),
    ("Western", "Western"),
]

    COUNTY_CHOICES = [
    ("Mombasa", "Mombasa"),
    ("Kwale", "Kwale"),
    ("Kilifi", "Kilifi"),
    ("Tana River", "Tana River"),
    ("Lamu", "Lamu"),
    ("Taita Taveta", "Taita Taveta"),
    ("Garissa", "Garissa"),
    ("Wajir", "Wajir"),
    ("Mandera", "Mandera"),
    ("Marsabit", "Marsabit"),
    ("Isiolo", "Isiolo"),
    ("Meru", "Meru"),
    ("Tharaka-Nithi", "Tharaka-Nithi"),
    ("Embu", "Embu"),
    ("Kitui", "Kitui"),
    ("Machakos", "Machakos"),
    ("Makueni", "Makueni"),
    ("Nyandarua", "Nyandarua"),
    ("Nyeri", "Nyeri"),
    ("Kirinyaga", "Kirinyaga"),
    ("Murang'a", "Murang'a"),
    ("Kiambu", "Kiambu"),
    ("Turkana", "Turkana"),
    ("West Pokot", "West Pokot"),
    ("Samburu", "Samburu"),
    ("Trans Nzoia", "Trans Nzoia"),
    ("Uasin Gishu (Eldoret)", "Uasin Gishu (Eldoret)"),
    ("Elgeyo Marakwet", "Elgeyo Marakwet"),
    ("Nandi", "Nandi"),
    ("Baringo", "Baringo"),
    ("Laikipia", "Laikipia"),
    ("Nakuru", "Nakuru"),
    ("Narok", "Narok"),
    ("Kajiado", "Kajiado"),
    ("Kericho", "Kericho"),
    ("Bomet", "Bomet"),
    ("Kakamega", "Kakamega"),
    ("Vihiga", "Vihiga"),
    ("Bungoma", "Bungoma"),
    ("Busia", "Busia"),
    ("Siaya", "Siaya"),
    ("Kisumu", "Kisumu"),
    ("Homa Bay", "Homa Bay"),
    ("Migori", "Migori"),
    ("Kisii", "Kisii"),
    ("Nyamira", "Nyamira"),
    ("Nairobi", "Nairobi"),
]

    name = models.CharField(max_length=100)
    region = models.CharField(max_length=100,choices=REGION_CHOICES)
    county = models.CharField(max_length=100,choices=COUNTY_CHOICES)
    address = models.CharField(max_length=100)
    email = models.EmailField()
    web_url = models.URLField(max_length=100,blank=True,null=True)
    admin_email=models.EmailField(max_length=100,unique=True)
    admin_tell = models.CharField(max_length=70,unique=True)
    tel = models.CharField(max_length=70)
    # admin = models.ForeignKey(User,on_delete=models.CASCADE,related_name="institution_admin",null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    

class InstitutionSettings(models.Model):
    NOTIFICATION_CHOICES = [
    ("email", "Email"),
    ("sms", "SMS"),
    ("both","Both")
]
    qrcode = models.BooleanField()
    barcode = models.BooleanField(default=True)
    institution = models.OneToOneField(Institution,on_delete=models.CASCADE)  
    min_admission_year = models.IntegerField(validators=[MinValueValidator(2020),MaxValueValidator(now().year)])
    notification_pref = models.CharField(choices=NOTIFICATION_CHOICES,max_length=100)
    template = models.ImageField(upload_to="institution_template")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Notifications(models.Model):
    recipient = models.ForeignKey(Institution,on_delete = models.CASCADE)
    message = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.message} to {self.recipient.email}" 