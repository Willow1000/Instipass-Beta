from django.apps import AppConfig


class IdConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Id'

    def ready(self):
        from Id.signals import id_processing_update, id_ready_update