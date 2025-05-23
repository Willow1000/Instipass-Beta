from django.contrib import admin
from .models import User
# Register your models here.

class UserAdmin(admin.ModelAdmin):
    list_display = ("id","email",'role')
    search_field = ("email",'role')
    list_filter = ("email","id")

admin.site.register(User,UserAdmin)    