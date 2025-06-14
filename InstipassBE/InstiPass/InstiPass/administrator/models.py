from django.db import models

class Notifications(models.Model):
    message = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.channel} to {self.recepient_phone_number or self.recepient_email}" 

class ContactUs(models.Model):
    name = models.CharField(max_length=50)
    email = models.EmailField()
    message = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True,null=True)

    def __str__(self):
        return f"{self.email}" 

class NewsLetter(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add = True,null=True,blank=True)

    def __str__(self):
        return f"{self.email}"        

class DemoBooking(models.Model):
    # Status choices for tracking the demo booking
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    # Personal information
    name = models.CharField(max_length=255, help_text="Full name of the person booking the demo")
    email = models.EmailField(help_text="Email address for communication")
    phone_number = models.CharField(max_length=20, help_text="Contact phone number")
    
    # Institution information
    institution = models.CharField(max_length=255, help_text="Name of the institution")
    size = models.CharField(max_length=50, help_text="Size of the institution")
    
    # Scheduling information
    date = models.DateField(help_text="Preferred date for the demo")
    time = models.CharField(max_length=25, help_text="Preferred time for the demo")
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        help_text="Current status of the demo booking",
        null=True,
        blank=True
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, help_text="When the booking was created")
    updated_at = models.DateTimeField(auto_now=True, help_text="When the booking was last updated")
    
    def __str__(self):
        return f"{self.name} - {self.institution} ({self.date})"
    
    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = "Demo Booking"
        verbose_name_plural = "Demo Bookings"        
