from django.contrib import admin
from .models import NewsLetter
# Register your models here.
class NewsLetterAdmin(admin.ModelAdmin):
    list_filter = ["email"]
    list_display = ["email"]
    search_field = ["email"]

admin.site.register(NewsLetter,NewsLetterAdmin)