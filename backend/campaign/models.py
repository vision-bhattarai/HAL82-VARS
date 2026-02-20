from django.db import models
from django.core.validators import MinValueValidator
from users.models import Startup

class Campaign(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('paused', 'Paused'),
    ]

    PRODUCT_TYPE_CHOICES = [
        ('physical', 'Physical Product'),
        ('digital', 'Digital Product'),
        ('service', 'Service'),
    ]

    startup = models.ForeignKey(Startup, on_delete=models.CASCADE, related_name='campaigns')
    product_name = models.CharField(max_length=255)
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    description = models.TextField()
    detailed_description = models.TextField(null=True, blank=True)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    early_access_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    estimated_delivery = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='campaign_images/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    backer_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def get_progress_percentage(self):
        """Calculate progress as a percentage"""
        if self.goal_amount == 0:
            return 0
        return min((self.current_amount / self.goal_amount) * 100, 100)

    def __str__(self):
        return f"{self.product_name} - {self.startup.company_name}"

    class Meta:
        ordering = ['-created_at']
