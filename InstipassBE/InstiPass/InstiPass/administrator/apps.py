from django.apps import AppConfig


class AdminConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'administrator'

    def ready(self):
        from .signals import send_newsletter_signup_confirmation, send_contact_confirmation,send_demo_booking_confirmation, delete_demobooking
