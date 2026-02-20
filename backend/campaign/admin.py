from django.contrib import admin
from .models import Campaign


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['product_name', 'startup', 'goal_amount', 'current_amount', 'status', 'backer_count', 'created_at']
    search_fields = ['product_name', 'startup__company_name']
    list_filter = ['status', 'product_type', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'current_amount', 'backer_count']
    fieldsets = (
        ('Campaign Info', {
            'fields': ('startup', 'product_name', 'product_type', 'status')
        }),
        ('Description', {
            'fields': ('description', 'detailed_description', 'image')
        }),
        ('Funding', {
            'fields': ('goal_amount', 'current_amount', 'early_access_price', 'backer_count')
        }),
        ('Timeline', {
            'fields': ('estimated_delivery', 'end_date', 'created_at', 'updated_at')
        }),
    )
