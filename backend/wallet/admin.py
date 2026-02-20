from django.contrib import admin
from .models import Wallet, Transaction


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ['user', 'balance', 'created_at', 'updated_at']
    search_fields = ['user__user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'campaign', 'amount', 'transaction_type', 'status', 'created_at']
    search_fields = ['user__user__username', 'transaction_id']
    list_filter = ['transaction_type', 'status', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'transaction_id']
