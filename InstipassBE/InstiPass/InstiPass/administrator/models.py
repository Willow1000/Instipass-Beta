from django.db import models

class Notifications(models.Model):
    message = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.channel} to {self.recepient_phone_number or self.recepient_email}" 

class ContactUs(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    message = models.CharField(max_length=300)

    def __str__(self):
        return f"{self.email}" 
