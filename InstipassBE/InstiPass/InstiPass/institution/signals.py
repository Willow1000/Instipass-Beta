from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save,post_delete
from django.utils import timezone
from .models import *
from django.utils.html import strip_tags
from django.utils.timezone import now
from django.template.loader import render_to_string
from accounts.models import *
from .utils import generate_institution_application_token
from logs.middleware import get_current_request
from logs.models import AdminActionsLog
from django.template.loader import render_to_string
import uuid
from datetime import datetime, timedelta,timezone
from InstiPass.utils import send_email as sendmail


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

@receiver(post_save,sender=NewsLetter,dispatch_uid = 'notify_user_they_signed_up_for_newsletter')
def send_newsletter_signup_confirmation(sender,instance,created,**kwargs):

    # Email subject
    subject = "Thank you for signing up for InstiPass newsletter service"
    
    # Context data for the template
    context = {
        'user_name': getattr(instance, 'name', getattr(instance, 'username', '')),
    }
    
    # Render the HTML template with context
    template_name = 'administrator/newsletter_signup_conf.html'
    html_message = render_to_string(template_name, context)
    
    # Create a plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send the email with both HTML and plain text versions
    return send_mail(
        subject=subject,
        message=plain_message,  # Plain text version
        from_email="admin@instipass.com",  # Updated from admin@django.com for branding consistency
        recipient_list=[instance.email],
        html_message=html_message,  # HTML version
        fail_silently=False
    )

@receiver(post_save,sender=ContactUs,dispatch_uid = 'message_received')
def send_contact_confirmation(sender,instance,created,**kwargs):

    # Email subject
    subject = "Thank you for contacting InstiPass"
    
    # Generate a unique ticket ID for reference
    ticket_id = str(uuid.uuid4())[:8].upper()
    
    # Context data for the template
    context = {
        'user_name': getattr(instance, 'name'),
        'ticket_id': ticket_id,
        'reference_number': 'CONTACT-',
        'message_preview': getattr(instance, 'message', '')
    }
    
    # Render the HTML template with context
    template_name = 'administrator/contact_confirmation.html'
    html_message = render_to_string(template_name, context)
    
    # Create a plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send the email with both HTML and plain text versions
    return send_mail(
        subject=subject,
        message=plain_message,  # Plain text version
        from_email="support@instipass.com",  # Updated from admin@django.com for branding consistency
        recipient_list=[instance.email],
        html_message=html_message,  # HTML version
        fail_silently=False
    )
    # return sendmail(to = instance.email,subject=subject,context=context,from_email="noreply@instipass.com",template_name=template_name)

def to_google_calendar_format(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    else:
        dt = dt.astimezone(timezone.utc)
    return dt.strftime('%Y%m%dT%H%M%SZ')

@receiver(post_save,sender=DemoBooking,dispatch_uid = 'notify_user_they_signed_up_for_newsletter')
def send_demo_booking_confirmation(sender,instance,created,**kwargs):
    demo_date = getattr(instance,'date','')
    demo_time = getattr(instance,'time','')
    # date_obj = datetime.strptime(demo_date, "%Y-%m-%d").date()
    time_obj = date_obj = datetime.strptime(demo_time, "%H:%M").time()
    combined_dt = datetime.combine(demo_date,time_obj)
    end_dt = combined_dt + timedelta(minutes=30)
    start_google_format = to_google_calendar_format(combined_dt)
    end_google_format = to_google_calendar_format(end_dt)
    if created:

        # Email subject
        subject = "Thank you for booking a demo session with InstiPass"
        
        # Generate a unique booking ID for reference
        booking_id = str(uuid.uuid4())[:6].upper()
        
        # Get demo details from instance or use placeholders
        # In a real implementation, these would come from your booking model
        timezone_name =  'EAT'
        
        
        # Format date and time for display
        demo_date = getattr(instance,'date','')
        demo_time = getattr(instance,'time','')
        # date_obj = datetime.strptime(demo_date, "%Y-%m-%d").date()
        time_obj = date_obj = datetime.strptime(demo_time, "%H:%M").time()
        combined_dt = datetime.combine(demo_date,time_obj)
        end_dt = combined_dt + timedelta(minutes=30)
        start_google_format = to_google_calendar_format(combined_dt)
        end_google_format = to_google_calendar_format(end_dt)

        # Context data for the template
        context1 = {
            'user_name': getattr(instance, 'name', getattr(instance, 'username', '')),
            'booking_id': booking_id,
            'booking_reference': 'DEMO-',
            'demo_date': demo_date,
            'demo_time': demo_time,
            'timezone': timezone_name,
            'presenter_name': getattr(instance, 'presenter_name', 'An InstiPass Specialist'),
            'platform': getattr(instance, 'platform', 'Zoom Meeting'),
            'meeting_link': getattr(instance, 'meeting_link', ''),
            'meeting_id': getattr(instance, 'meeting_id', ''),
            'passcode': getattr(instance, 'passcode', ''),
            'calendar_link': f"https://calendar.google.com/calendar/render?action=TEMPLATE&text=Instipass+DemoSession&dates={start_google_format}/{end_google_format}&details=Prepare+as+many+questions+as+you+can&location=zoom",
            'ics_link': getattr(instance, 'ics_link', '#')
        }
        
        # Render the HTML template with context
        template_name1 = 'administrator/demo_booking_confirmation.html'
        html_message1 = render_to_string(template_name1, context1)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message1 = strip_tags(html_message1)
        
        # Send the email with both HTML and plain text versions
        context = {
        'institution': instance.institution,
    }
    
        # Add optional fields if they exist
        optional_fields = ['date', 'time', 'contact_person', 'email', 'phone']
        for field in optional_fields:
            if hasattr(instance, field):
                context[field] = getattr(instance, field)
        
        # Render HTML content
        template_name = 'emailtemplates/new_demo_booked.html'
        html_message = render_to_string(template_name, context)
        
        # Create plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send email with both HTML and plain text versions
        send_mail(
            subject='New Demo Has Been Booked',
            message=plain_message,
            from_email='demos@instipass.com',
            recipient_list=['wilkinsondari7@gmail.com'],
            fail_silently=False,
            html_message=html_message,
    )
        return send_mail(
            subject=subject,
            message=plain_message1,  # Plain text version
            from_email="demos@instipass.com",  # Updated from admin@django.com for branding consistency
            recipient_list=[instance.email],
            html_message=html_message1,  # HTML version
            fail_silently=False
        )  
    elif not created and instance.status == 'CONFIRMED':
        print('CONFIRMED')
        return
    context = {
        'date': instance.date,
        'time': instance.time,
        'calendar_link': f"https://calendar.google.com/calendar/render?action=TEMPLATE&text=Instipass+DemoSession&dates={start_google_format}/{end_google_format}&details=Prepare+as+many+questions+as+you+can&location=zoom"
    }
    
    # Render HTML content
    template_name = 'emailtemplates/demo_reschedule.html'
    html_message = render_to_string(template_name, context)
    
    # Create plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send email with both HTML and plain text versions
    send_mail(
        subject='Demo Session Rescheduled',
        message=plain_message,
        from_email='demos@instipass.com',
        recipient_list=[instance.email],
        fail_silently=False,
        html_message=html_message,
    ) 