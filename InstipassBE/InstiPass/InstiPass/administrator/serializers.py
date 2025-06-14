from rest_framework import serializers
from .models import ContactUs,NewsLetter,DemoBooking

class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = "__all__"

class NewsLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model=NewsLetter
        fields = "__all__"

class DemoBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemoBooking
        exclude = ['status']