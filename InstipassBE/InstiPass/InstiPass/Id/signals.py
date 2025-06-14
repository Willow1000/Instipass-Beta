from django.dispatch import receiver
from student.models import *
from django.core.mail import send_mail
from .models import IdInProcess,IdReady
from django.db.models.signals import post_save
from logs.models import IdprogressLog
from django.utils.timezone import now
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.utils.timezone import now
import uuid
from datetime import datetime, timedelta

@receiver(post_save,sender=IdInProcess,dispatch_uid = 'notify_student_and_update_process_status')
def send_id_processing_update(sender,instance,created,**kwargs):
    # Email subject
    subject = "Your ID is in the processing stage"
    
    # Get the student email
    student_email = instance.Id.student.email
    
    # Get student name or use a default
    student_name = getattr(instance.Id.student, 'name', 
                  getattr(instance.Id.student, 'full_name', 
                  getattr(instance.Id.student, 'username', '')))
    
    # Get ID reference number
    id_reference = getattr(instance.Id, 'id_number', str(uuid.uuid4())[:6].upper())
    
    # Get processing start time
    processing_started = getattr(instance, 'started_processing', now())
    if hasattr(processing_started, 'strftime'):
        processing_started_str = processing_started.strftime('%B %d, %Y at %I:%M %p')
    else:
        processing_started_str = str(processing_started)
    
    # Get request date
    request_date = getattr(instance.Id, 'created_at', 
                  getattr(instance.Id, 'request_date', ''))
    if hasattr(request_date, 'strftime'):
        request_date_str = request_date.strftime('%B %d, %Y')
    else:
        request_date_str = str(request_date)
    
    # Context data for the template
    context = {
        'student_name': student_name,
        'id_number': 'ID-',
        'id_reference': id_reference,
        'estimated_days': '3-5',
        'request_date': request_date_str,
        'institution_name': getattr(instance.Id.student, 'institution', 'Your Institution'),
        'id_type': getattr(instance.Id, 'id_type', 'Student ID'),
        'processing_started': processing_started_str
    }
    
    # Render the HTML template with context
    template_name = 'id_processing.html'
    html_message = render_to_string(template_name, context)
    
    # Create a plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send the email with both HTML and plain text versions
    return send_mail(
        subject=subject,
        message=plain_message,  # Plain text version
        from_email="notifications@instipass.com",  # Updated from admin@django.com for branding consistency
        recipient_list=[student_email],
        html_message=html_message,  # HTML version
        fail_silently=False
    )
    
@receiver(post_save,sender=IdReady,dispatch_uid = 'notify_student_and_update_ready_status')
def send_id_ready_notification(sender,instance,created, **kwargs):

    # Email subject
    subject = "Your ID is ready"
    
    # Get the student email
    student_email = instance.Id.Id.student.email
    
    # Get student name or use a default
    student_name = getattr(instance.Id.Id.student, 'name', 
                  getattr(instance.Id.Id.student, 'full_name', 
                  getattr(instance.Id.Id.student, 'username', '')))
    
    # Get ID reference number
    id_reference = getattr(instance.Id.Id, 'id', str(uuid.uuid4())[:6].upper())
    
    # Get processing finished time
    processing_finished = getattr(instance, 'finished_processing', now())
    if hasattr(processing_finished, 'strftime'):
        processing_finished_str = processing_finished.strftime('%B %d, %Y at %I:%M %p')
    else:
        processing_finished_str = str(processing_finished)
    
    # Get request date
    request_date = getattr(instance.Id.Id, 'created_at', 
                  getattr(instance.Id.Id, 'request_date', ''))
    if hasattr(request_date, 'strftime'):
        request_date_str = request_date.strftime('%B %d, %Y')
    else:
        request_date_str = str(request_date)
    
    # Generate pickup reference
    pickup_id = str(uuid.uuid4())[:6].upper()
    
    # Calculate pickup deadline (30 days from now)
    pickup_deadline = datetime.now() + timedelta(days=30)
    pickup_deadline_str = pickup_deadline.strftime('%B %d, %Y')
    
    # Context data for the template
    context = {
        'student_name': student_name,
        'id_number': 'ID-',
        'id_reference': id_reference,
        'request_date': request_date_str,
        'institution_name': getattr(instance.Id.Id.student, 'institution', 'Your Institution'),
        'id_type': getattr(instance.Id.Id, 'id_type', 'Student ID'),
        'processing_finished': processing_finished_str,
        'pickup_location': 'Student Services Center, Room 101',  # Customize as needed
        'pickup_hours': 'Monday-Friday, 9:00 AM - 5:00 PM',      # Customize as needed
        'available_from': 'Immediately',
        'required_documents': 'Government-issued photo ID (driver\'s license, passport, etc.)',
        'pickup_reference': 'PICKUP-',
        'pickup_id': pickup_id,
        'pickup_deadline_days': '30',
        'pickup_deadline': pickup_deadline_str
    }
    
    # Render the HTML template with context
    template_name = 'id_ready_notification.html'
    html_message = render_to_string(template_name, context)
    
    # Create a plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send the email with both HTML and plain text versions
    return send_mail(
        subject=subject,
        message=plain_message,  # Plain text version
        from_email="notifications@instipass.com",  # Updated from admin@django.com for branding consistency
        recipient_list=[student_email],
        html_message=html_message,  # HTML version
        fail_silently=False
    )
    



