from django.db import models
from django.core.validators import MinValueValidator
from users.models import GeneralUser, Startup
from campaign.models import Campaign

class Wallet(models.Model):
    """User wallet for managing balance"""
    user = models.OneToOneField(GeneralUser, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, validators=[MinValueValidator(0)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.user.username} - Balance: {self.balance}"


class Transaction(models.Model):
    """Transaction model for donations and fund transfers"""
    TRANSACTION_TYPE = [
        ('donation', 'Donation'),
        ('refund', 'Refund'),
        ('withdrawal', 'Withdrawal'),
        ('deposit', 'Deposit'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(GeneralUser, on_delete=models.CASCADE, related_name='transactions')
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    description = models.CharField(max_length=255, null=True, blank=True)
    transaction_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.user.username} - {self.transaction_type} - {self.amount}"

    class Meta:
        ordering = ['-created_at']
