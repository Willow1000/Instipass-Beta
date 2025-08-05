from django.db import models

class Notifications(models.Model):
    message = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.channel} to {self.recepient_phone_number or self.recepient_email}" 



 



class ContactUsTracker(models.Model):
    fingerprint = models.CharField(max_length=64, blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True) 

class DemoBookingTracker(models.Model):
    fingerprint = models.CharField(max_length=64, blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)            

