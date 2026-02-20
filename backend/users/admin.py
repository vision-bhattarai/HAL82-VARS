from django.contrib import admin
from .models import GeneralUser, Startup


@admin.register(GeneralUser)
class GeneralUserAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number', 'citizenship_number', 'total_donated', 'created_at']
    search_fields = ['user__username', 'phone_number', 'citizenship_number']
    readonly_fields = ['created_at', 'updated_at', 'total_donated']


@admin.register(Startup)
class StartupAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'category', 'total_requested', 'total_raised', 'is_verified', 'created_at']
    search_fields = ['company_name', 'user__username']
    list_filter = ['category', 'is_verified', 'created_at']
    readonly_fields = ['created_at', 'updated_at', 'total_raised']
