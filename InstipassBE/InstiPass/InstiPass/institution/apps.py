from django.apps import AppConfig


class InstitutionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'institution'

    def ready(self):
        from .signals import institution_profile, institution_settings
