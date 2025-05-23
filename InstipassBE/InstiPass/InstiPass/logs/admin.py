from django.contrib import admin
from .models import AdminActionsLog
# Register your models here.

class AdminActionsLogAdmin(admin.ModelAdmin):
    search_field = ("admin")
    list_display = ("admin",'victim_type')
    list_filter = ("admin","victim_type")


admin.site.register(AdminActionsLog,AdminActionsLogAdmin)
