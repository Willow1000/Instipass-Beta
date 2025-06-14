from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save,post_delete
from django.utils import timezone
from .models import *
import uuid
from django.utils.html import strip_tags
from django.utils.timezone import now
from django.template.loader import render_to_string
from accounts.models import *
from .utils import generate_institution_application_token
from logs.middleware import get_current_request
from logs.models import AdminActionsLog


# Institution Profile Update Signals
@receiver(post_save, sender=Institution, dispatch_uid="institution_profile_update")
def send_institution_profile_update_email(sender, instance, created, **kwargs):
    if not created:
        # Email subject
        subject = "Your profile has been updated successfully"
        
        # Context data for the template
        context = {
            'institution_name': instance.name,
            'update_date': now().strftime('%B %d, %Y'),
            'updated_fields': getattr(instance, 'updated_fields', None)
        }
        
        # Render the HTML template with context
        template_name = 'institution/institution_profile_update.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send institution profile update email: {e}")


@receiver(post_save, sender=Institution, dispatch_uid="admin_profile_update_notification")
def send_admin_profile_update_notification(sender, instance, created, **kwargs):
    if not created:
        # Email subject
        subject = f"{instance.name}'s profile has been updated successfully"
        
        # Get admin name if available, otherwise use a default
        admin_name = getattr(instance, 'admin_name', 'Administrator')
        
        # Context data for the template
        context = {
            'admin_name': admin_name,
            'institution_name': instance.name,
            'update_date': now().strftime('%B %d, %Y'),
            'updated_fields': getattr(instance, 'updated_fields', None)
        }
        
        # Render the HTML template with context
        template_name = 'administrator/admin_profile_update_notification.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.admin_email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send admin profile update notification: {e}")


# Institution Registration Signals
@receiver(post_save, sender=Institution, dispatch_uid="institution_registration")
def send_institution_registration_email(sender, instance, created, **kwargs):
    if created:
        # Email subject
        subject = f"{instance.name} has been successfully registered to InstiPass"
        
        # Generate a unique institution ID for reference
        institution_id = str(uuid.uuid4())[:6].upper()
        
        # Context data for the template
        context = {
            'institution_name': instance.name,
            'account_id': 'INST-',
            'institution_id': institution_id,
            'registration_date': now().strftime('%B %d, %Y')
        }
        
        # Render the HTML template with context
        template_name = 'institution/institution_registration.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send institution registration email: {e}")


@receiver(post_save, sender=Institution, dispatch_uid="admin_registration_notification")
def send_admin_registration_email(sender, instance, created, **kwargs):
    if created:
        # Email subject
        subject = f"You have been selected as the admin for {instance.name} InstiPass"
        
        # Generate a unique institution ID for reference
        institution_id = str(uuid.uuid4())[:6].upper()
        
        # Get admin name if available, otherwise use a default
        admin_name = getattr(instance, 'admin_name', 'Administrator')
        
        # Context data for the template
        context = {
            'admin_name': admin_name,
            'institution_name': instance.name,
            'account_id': 'INST-',
            'institution_id': institution_id,
            'registration_date': now().strftime('%B %d, %Y')
        }
        
        # Render the HTML template with context
        template_name = 'institution/institution_admin_notification.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.admin_email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send admin registration notification: {e}")


# Institution Settings Signals
@receiver(post_save, sender=InstitutionSettings, dispatch_uid="institution_settings_received")
def send_institution_settings_received_email(sender, instance, created, **kwargs):
    if created:
        # Email subject
        subject = f"{instance.institution.name}, Your preferences have been successfully received."
        
        # Context data for the template
        context = {
            'institution_name': instance.institution.name,
            'submission_date': now().strftime('%B %d, %Y'),
        }
        
        # Render the HTML template with context
        template_name = 'institution/institution_settings_received.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.institution.email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send institution settings received email: {e}")


@receiver(post_save, sender=InstitutionSettings, dispatch_uid="admin_settings_received")
def send_admin_settings_received_email(sender, instance, created, **kwargs):
    if created:
        # Email subject
        subject = f"{instance.institution.name}'s preferences have been successfully received."
        
        # Get admin name if available, otherwise use a default
        admin_name = getattr(instance.institution, 'admin_name', 'Administrator')
        
        # Context data for the template
        context = {
            'admin_name': admin_name,
            'institution_name': instance.institution.name,
            'submission_date': now().strftime('%B %d, %Y'),
        }
        
        # Render the HTML template with context
        template_name = 'administrator/admin_settings_received.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.institution.admin_email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send admin settings received notification: {e}")


@receiver(post_save, sender=InstitutionSettings, dispatch_uid="institution_settings_update")
def send_institution_settings_update_email(sender, instance, created, **kwargs):
    if not created:
        # Email subject
        subject = "Your institution settings have been updated successfully"
        
        # Context data for the template
        context = {
            'institution_name': instance.institution.name,
            'update_date': now().strftime('%B %d, %Y'),
        }
        
        # Render the HTML template with context
        template_name = 'institution/institution_settings_update.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.institution.email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send institution settings update email: {e}")


@receiver(post_save, sender=InstitutionSettings, dispatch_uid="admin_settings_update")
def send_admin_settings_update_notification(sender, instance, created, **kwargs):
    if not created:
        # Email subject
        subject = f"{instance.institution.name}'s settings have been updated successfully"
        
        # Get admin name if available, otherwise use a default
        admin_name = getattr(instance.institution, 'admin_name', 'Administrator')
        
        # Context data for the template
        context = {
            'admin_name': admin_name,
            'institution_name': instance.institution.name,
            'update_date': now().strftime('%B %d, %Y'),
        }
        
        # Render the HTML template with context
        template_name = 'administrator/admin_settings_update.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email="notifications@instipass.com",
                recipient_list=[instance.institution.admin_email],
                html_message=html_message,
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send admin settings update notification: {e}")

@receiver(post_save, sender=InstitutionSettings, dispatch_uid="student_registration_link")
def send_student_registration_link(sender, instance, created, **kwargs):
    if created:
        token_obj = generate_institution_application_token(instance)
        token = token_obj.get('token')
        lifetime = token_obj.get("lifetime")
        exp = token_obj.get('expiry_date')
        InstitutionToken.objects.create(institution=instance,token=token,lifetime=lifetime,expiry_date=exp)

        try:
            send_mail(
                subject='Student REgistration link',
                message=f'students can register for their Ids using this link http://127.0.0.1:3000/students?token={token} , desclaimer: a device can only register one student',
                from_email="notifications@instipass.com",
                recipient_list=[instance.admin_email],
                fail_silently=False
            )
            send_mail(
                subject='Student REgistration link',
                message=f'students can register for their Ids using this link http://127.0.0.1:3000/students?token={token} , desclaimer: a device can only register one student',
                from_email="notifications@instipass.com",
                recipient_list=[instance.email],
                fail_silently=False
            )
        except Exception as e:
            print(f"Failed to send admin settings update notification: {e}")

@receiver(post_delete,sender=Institution,dispatch_uid="institution_deleted")
def delete_institution(sender,instance,**kwargs):
    request = get_current_request()
    user = request.user if request else None
    AdminActionsLog.objects.create(
        action = "DELETE",
        admin = user,
        victim_type= "INSTITUTION",
        victim = f"{instance.id} {instance.name}"

    )