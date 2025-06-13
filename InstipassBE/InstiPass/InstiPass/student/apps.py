from django.apps import AppConfig


class StudentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'student'

    def ready(self):
        from .signals import application_received,delete_student, update_student