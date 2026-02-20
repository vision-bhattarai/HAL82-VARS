from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class GeneralUser(models.Model):
    """Extended general user profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='general_user')
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    citizenship_number = models.CharField(max_length=50, null=True, blank=True)
    citizenship_document = models.FileField(upload_to='citizenship_docs/', null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    total_donated = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - General User"


class Startup(models.Model):
    """Startup profile built on top of GeneralUser"""
    CATEGORY_CHOICES = [
        ('tech', 'Technology'),
        ('health', 'Healthcare'),
        ('finance', 'Finance'),
        ('education', 'Education'),
        ('ecommerce', 'E-commerce'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='startup')
    general_user = models.OneToOneField(GeneralUser, on_delete=models.CASCADE, related_name='startup_profile')
    company_name = models.CharField(max_length=255, unique=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField()
    logo = models.ImageField(upload_to='startup_logos/', null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    total_requested = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    total_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name

    class Meta:
        ordering = ['-created_at']
