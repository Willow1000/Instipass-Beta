from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .models import NewsLetter,DemoBooking, ContactUs
import uuid
from datetime import datetime, timedelta
from logs.middleware import get_current_request
from logs.models import AdminActionsLog


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


@receiver(post_save,sender=DemoBooking,dispatch_uid = 'notify_user_they_signed_up_for_newsletter')
def send_demo_booking_confirmation(sender,instance,created,**kwargs):

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
        
        # Context data for the template
        context = {
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
            'calendar_link': getattr(instance, 'calendar_link', '#'),
            'ics_link': getattr(instance, 'ics_link', '#')
        }
        
        # Render the HTML template with context
        template_name = 'administrator/demo_booking_confirmation.html'
        html_message = render_to_string(template_name, context)
        
        # Create a plain text version for email clients that don't support HTML
        plain_message = strip_tags(html_message)
        
        # Send the email with both HTML and plain text versions
        send_mail(
            subject = "New demo has been booked",
            message = f"{instance.institution} just booked a demo session",
            from_email = "demos@instipass.com",
            recipient_list = ["wilkinsondari7@gmail.com"],
            fail_silently = False
        )
        return send_mail(
            subject=subject,
            message=plain_message,  # Plain text version
            from_email="demos@instipass.com",  # Updated from admin@django.com for branding consistency
            recipient_list=[instance.email],
            html_message=html_message,  # HTML version
            fail_silently=False
        )  
    context = {
        'date': instance.date,
        'time': instance.time
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

@receiver(post_delete,sender=DemoBooking,dispatch_uid="demobooking_deleted")
def delete_demobooking(sender,instance,**kwargs):
    request = get_current_request()
    user = request.user if request else None
    AdminActionsLog.objects.create(
        action = "DELETE",
        admin = user,
        victim_type= "DEMOBOOKING",
        victim = f"{instance.id} {instance.institution} {instance.email} ")