from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db.models.signals import post_save,post_delete
from logs.middleware import get_current_request
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import User as user
from .models import InstitutionSignupToken
from logs.models import AdminActionsLog

@receiver(post_save, sender=User, dispatch_uid="send_welcome_email")
def welcome_mail(sender, instance, created, **kwargs):
    
    # Determine if institution or student based on username
    is_institution = any(keyword in instance.username.lower() for keyword in 
                        ['university', 'institute', 'institution', 'polytechnic'])
    
    if is_institution:
        # Institution welcome email
        template_name = 'emailtemplates/welcome_institution.html'
        login_url = "http://127.0.0.1:8000/login/?next=/institution/"
    # else:
    #     # Student welcome email
    #     template_name = 'emailwelcome_student.html'
    #     login_url = "http://127.0.0.1:8000/login/?next=/student/"
    
    # Context for the email template
    context = {
        'username': instance.username,
        'login_url': login_url
    }
    
    # Render HTML content
    html_message = render_to_string(template_name, context)
    # Create plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send email with both HTML and plain text versions
    send_mail(
        subject="Welcome to InstiPass",
        message=plain_message,
        from_email="admin@django.com",
        recipient_list=[instance.email],
        fail_silently=False,
        html_message=html_message,
    )

@receiver(post_save, sender=InstitutionSignupToken, dispatch_uid="send_signup_link")
def send_signup_link(sender, instance, created, **kwargs):
   
    # Context for the email template
    context = {
        'signup_url': f"http://127.0.0.1:3000/institution/signup/?token={instance.token}"
    }
    
    # Render HTML content
    template_name = 'emailtemplates/signup_link.html'
    html_message = render_to_string(template_name, context)
    # Create plain text version for email clients that don't support HTML
    plain_message = strip_tags(html_message)
    
    # Send email with both HTML and plain text versions
    send_mail(
        subject="InstiPass Institution Registration",
        message=plain_message,
        from_email="admin@django.com",
        recipient_list=[instance.email],
        fail_silently=False,
        html_message=html_message,
    )

@receiver(post_delete,sender=user,dispatch_uid="log_user_delete")
def log_user_delete(sender,instance,**kwargs):
    request = get_current_request()
    user = request.user if request else None
    AdminActionsLog.objects.create(
        action = "DELETE",
        admin = user,
        victim_type= "USER",
        victim = f"{instance.id} {instance.email} {instance.role}"

    )
