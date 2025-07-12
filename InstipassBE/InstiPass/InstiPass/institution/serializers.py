from rest_framework import serializers
from .models import *

class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = "__all__"

class InstitutionSettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = InstitutionSettings
        fields = "__all__"        

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ['message','created_at']

class NewsLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model=NewsLetter
        fields = "__all__"     

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = "__all__"



class DemoBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        exclude = ['status']           