from django.contrib import admin
from .models import *
# Register your models here.

class StudentAdmin(admin.ModelAdmin):
    list_display = ('id','email','institution')
    list_filter = ('institution','email','id')
    search_field = ('institution','email')

class NotificationsAdmin(admin.ModelAdmin):
    list_filter = ("recipient",'created_at')
    list_display = ("recipient",'created_at')
    search_field = ("recipient",'created_at')

admin.site.register(Student,StudentAdmin)
admin.site.register(Notifications,NotificationsAdmin)    


