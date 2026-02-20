from django.contrib.auth.models import User
from users.models import GeneralUser, Startup
from wallet.models import Wallet

# Create superuser if doesn't exist
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser('admin', 'admin@startezz.com', 'startezz123')
    print(f"✓ Admin user created: admin / startezz123")
else:
    print("Admin user already exists")
    user = User.objects.get(username='admin')

# Create GeneralUser profile if doesn't exist
if not GeneralUser.objects.filter(user=user).exists():
    general_user = GeneralUser.objects.create(user=user)
    print(f"✓ GeneralUser profile created")
else:
    general_user = GeneralUser.objects.get(user=user)

# Create Wallet if doesn't exist
if not Wallet.objects.filter(user=general_user).exists():
    wallet = Wallet.objects.create(user=general_user)
    print(f"✓ Wallet created")

print("\n✓ Setup complete!")
print(f"Admin credentials:")
print(f"  Username: admin")
print(f"  Password: startezz123")
print(f"  Admin URL: http://localhost:8000/admin")
