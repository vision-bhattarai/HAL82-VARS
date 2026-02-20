from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

from users.models import GeneralUser, Startup
from campaign.models import Campaign


class Command(BaseCommand):
    help = 'Seed sample startups and campaigns into the database'

    def handle(self, *args, **options):
        now = timezone.now()

        startups_data = [
            {
                'username': 'startup_alpha',
                'email': 'alpha@example.com',
                'company_name': 'Alpha Innovations',
                'category': 'tech',
                'description': 'Building smart home IoT devices for everyone.',
            },
            {
                'username': 'startup_bloom',
                'email': 'bloom@example.com',
                'company_name': 'Bloom Health',
                'category': 'health',
                'description': 'Affordable health-tracking wearables.',
            },
            {
                'username': 'startup_cart',
                'email': 'cart@example.com',
                'company_name': 'Cartify',
                'category': 'ecommerce',
                'description': 'A platform to simplify online storefronts.',
            },
        ]

        campaigns_data = [
            {
                'product_name': 'Smart Thermostat X',
                'product_type': 'physical',
                'description': 'An energy-saving smart thermostat.',
                'detailed_description': 'Smart Thermostat X learns your schedule and saves energy automatically.',
                'goal_amount': 25000.00,
                'current_amount': 8200.00,
                'early_access_price': 129.99,
                'days_to_end': 25,
                'status': 'active',
                'backer_count': 120,
            },
            {
                'product_name': 'BloomBand Pro',
                'product_type': 'physical',
                'description': 'A compact health band with clinical-grade sensors.',
                'detailed_description': 'BloomBand Pro measures heart rate variability, SpO2 and sleep stages.',
                'goal_amount': 40000.00,
                'current_amount': 15000.00,
                'early_access_price': 79.99,
                'days_to_end': 40,
                'status': 'active',
                'backer_count': 300,
            },
            {
                'product_name': 'StoreKit Pro',
                'product_type': 'digital',
                'description': 'E-commerce toolkit for small sellers.',
                'detailed_description': 'StoreKit Pro gives sellers tools to manage inventory, payments and analytics.',
                'goal_amount': 15000.00,
                'current_amount': 15000.00,
                'early_access_price': 29.00,
                'days_to_end': -5,
                'status': 'completed',
                'backer_count': 520,
            },
        ]

        created_count = 0

        for i, sdata in enumerate(startups_data):
            user, u_created = User.objects.get_or_create(
                username=sdata['username'],
                defaults={'email': sdata['email']}
            )
            if u_created:
                user.set_password('password')
                user.save()

            general, _ = GeneralUser.objects.get_or_create(
                user=user,
                defaults={'phone_number': '', 'citizenship_number': '', 'address': '', 'city': '', 'country': ''}
            )

            startup, st_created = Startup.objects.get_or_create(
                user=user,
                defaults={
                    'general_user': general,
                    'company_name': sdata['company_name'],
                    'category': sdata['category'],
                    'description': sdata['description'],
                    'total_requested': 0.00,
                    'total_raised': 0.00,
                }
            )

            # assign campaigns (one or more per startup)
            # rotate campaigns_data so each startup gets at least one
            cdata = campaigns_data[i % len(campaigns_data)].copy()
            # compute dates
            end_date = now + timedelta(days=cdata.pop('days_to_end'))
            estimated_delivery = (now + timedelta(days=90)).date()

            campaign, c_created = Campaign.objects.get_or_create(
                product_name=cdata['product_name'],
                startup=startup,
                defaults={
                    'product_type': cdata['product_type'],
                    'description': cdata['description'],
                    'detailed_description': cdata.get('detailed_description', ''),
                    'goal_amount': cdata['goal_amount'],
                    'current_amount': cdata['current_amount'],
                    'early_access_price': cdata['early_access_price'],
                    'estimated_delivery': estimated_delivery,
                    'status': cdata.get('status', 'active'),
                    'backer_count': cdata.get('backer_count', 0),
                    'end_date': end_date,
                }
            )

            if c_created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f'Seeded {created_count} campaigns and {len(startups_data)} startups (users created with password "password").'))
