from django.apps import AppConfig


class InstitutionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'institution'

    def ready(self):
        from .signals import send_institution_registration_email,send_admin_registration_email,send_institution_profile_update_email,send_admin_profile_update_notification,send_institution_settings_received_email,send_admin_settings_received_email,send_institution_settings_update_email,send_admin_settings_update_notification,send_student_registration_link,delete_institution,send_newsletter_signup_confirmation