from django.dispatch import receiver
from .models import *
from Id.models import IdOnQueue
from django.db.models.signals import post_save,post_delete
from django.utils import timezone
from django.core.mail import send_mail
from logs.models import IdprogressLog,AdminActionsLog
from logs.middleware import get_current_request
@receiver(post_save,sender=Student,dispatch_uid="update_status")
def application_received(sender,instance,created,**kwargs):
    if created:
        Student.objects.filter(id=instance.id).update(status="application_received")
        IdOnQueue.objects.create(student = Student.objects.get(id=instance.id))
        IdprogressLog.objects.create(Id=IdOnQueue.objects.get(student=instance),queued_on=timezone.now())
        send_mail(
                "We have received your application. Hang tight as we work on it",
                "It will be ready in no time.",
                "admin@django.com",
                [instance.email],
                fail_silently=False
            )
    else:
        send_mail(
                "Your profile has been updated successfully",
                "Your profile has been updated. If you did not make this change, please contact us",
                "admin@django.com",
                [instance.email],
                fail_silently=False
            )
@receiver(post_delete,sender=Student,dispatch_uid="student_deleted")
def delete_student(sender,instance,**kwargs):
    request = get_current_request()
    user = request.user if request else None
    AdminActionsLog.objects.create(
        action = "DELETE",
        admin = user,
        victim_type= "STUDENT",
        victim = f"{instance.id} {instance.first_name} {instance.last_name} "

    )
