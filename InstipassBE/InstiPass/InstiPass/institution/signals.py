from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils import timezone
from .models import *
from accounts.models import *

@receiver(post_save,sender=Institution,dispatch_uid="institution_registration")
def institution_profile(sender,instance,created,**kwargs):
    # admin = User.objects.get(institution=instance,role='institution_admin')
    if created:
        send_mail(
                f"{instance.name} has been successfully registered to Instipass",
                "Ready to start onboarding students",
                "admin@django.com",
                [instance.email],
                fail_silently=False
            )
        send_mail(
                f"You have been selected as the admin for {instance.name}  Instipass",
                "Stay tuned for more updates",
                "admin@django.com",
                [instance.admin_email],
                fail_silently=False
            )

    else:
        send_mail(
                "Your profile has been updated successfully",
                "Your profile has been updated. If you did not make this change, please contact us",
                "admin@django.com",
                [instance.email],
                fail_silently=False
            )    
        send_mail(
                f"{instance.name}'s profile has been updated successfully",
                "If you did not make this change, please contact us",
                "admin@django.com",
                [instance.email],
                fail_silently=False
            )    
        
@receiver(post_save,sender=InstitutionSettings,dispatch_uid="institution_settings_update")
def institution_settings(sender,instance,created,**kwargs):
    # admin = User.objects.get(institution=instance,role='institution_admin')
    if created:
        send_mail(
                f"{instance.institution.name}, Your preferences have been successfully received.",
                "We will update you on the progress",
                "admin@django.com",
                [instance.institution.email],
                fail_silently=False
            )
        send_mail(
                f"{instance.institution.name}'s preferences have been successfully received.",
                "We will update you on the progress",
                "admin@django.com",
                [instance.institution.admin_email],
                fail_silently=False
            )
        
    else:
        send_mail(
                "Your institution settings have been updated successfully",
                "Your institution settings have been updated. If you did not make this change, please contact us",
                "admin@django.com",
                [instance.institution.email],
                fail_silently=False
            ) 
        send_mail(
                f"{instance.name}'s settings have been updated successfully",
                "Your institution's settings have been updated. If you did not make this change, please contact us",
                "admin@django.com",
                [instance.institution.admin_email],
                fail_silently=False
            ) 
