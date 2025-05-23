from django.contrib import admin
from .models import *
# Register your models here.

class InstitutionAdmin(admin.ModelAdmin):
    list_filter = ("email",'id')
    list_display = ("email",'name')
    search_field = ("name","email","region")    

class InstitutionSettingsAdmin(admin.ModelAdmin):
    list_filter = ("institution",'id')
    list_display = ("institution",'id')
    search_field = ("institution") 

class NotificationsAdmin(admin.ModelAdmin):
    list_filter = ("recipient",'created_at')
    list_display = ("recipient",'created_at')
    search_field = ("recipient",'created_at')

admin.site.register(Institution,InstitutionAdmin)
admin.site.register(InstitutionSettings,InstitutionSettingsAdmin)
admin.site.register(Notifications,NotificationsAdmin)