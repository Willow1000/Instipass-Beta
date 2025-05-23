from django.db.models.signals import post_save
from .models import *
from django.dispatch import receiver
from django.core.mail import send_mail


@receiver(post_save,sender=User,dispatch_uid = "send_welcome_email")
def welcome_mail(sender,instance,created,**kwargs):
    if created:

        if 'university' or "institute" or 'institution' in instance.username.lower():
            send_mail(
                subject="Welcome",
                message=(
                    f"Thank you {instance.username} for signing up!\n\n"
                    "Please log in to your account using the following link:\n"
                    "http://127.0.0.1:8000/login/?next=/institution/"
                ),
                from_email="admin@django.com",
                recipient_list=[instance.email],
                fail_silently=False,
            )
            # User.objects.get(email = instance.email).update(role = "institution")
        else:
            send_mail(
                subject="Welcome",
                message=(
                    f"Thank you {instance.username} for signing up!\n\n"
                    "Please log in to your account using the following link:\n"
                    "http://127.0.0.1:8000/login/?next=/student/"
                ),
                from_email="admin@django.com",
                recipient_list=[instance.email],
                fail_silently=False,
            )
            # User.objects.get(email = instance.email).update(role = "student")
