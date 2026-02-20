# StartEzz Backend API

Django REST API for the StartEzz startup fundraising platform.

## Quick Start

### Prerequisites
- Python 3.8+
- pip or conda

### Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Create superuser account:
```bash
python manage.py createsuperuser
```

4. Start development server:
```bash
python manage.py runserver
```

API available at: `http://localhost:8000/api`
Admin panel: `http://localhost:8000/admin`

## Architecture

### Apps

1. **users** - User authentication and profiles
   - GeneralUser: Base user profile for all users
   - Startup: Extended profile for fundraisers

2. **campaign** - Campaign management
   - Campaign: Fundraising campaigns
   - Progress tracking
   - Status management

3. **wallet** - Transaction management
   - Wallet: User balance tracking
   - Transaction: Donation and fund transfer records

4. **config** - Django configuration
   - Settings, URLs, WSGI

## Models

### users/models.py

**GeneralUser**
- Extends Django's User model
- Phone number, citizenship info, address
- Tracks total donated amount

**Startup**
- OneToOne relation with GeneralUser
- Company details (name, category, description)
- Funding targets and amounts raised
- Verification status

### campaign/models.py

**Campaign**
- Belongs to a Startup
- Product details (name, type, description)
- Funding goal and current amount
- Early access pricing
- Status management (active, completed, cancelled, paused)
- Tracks backer count and progress

### wallet/models.py

**Wallet**
- OneToOne with GeneralUser
- Stores user balance

**Transaction**
- Records donations
- Target campaign reference
- Amount and status
- Unique transaction ID

## API Endpoints

### Authentication

```
POST   /api/users/register/              Register new user
POST   /api/users/login/                 User login
POST   /api/users/logout/                User logout
GET    /api/users/me/                    Get current user
```

### Users & Startups

```
GET    /api/users/general/               List general users
GET    /api/users/general/{id}/          Get specific user
POST   /api/users/startup/register/      Upgrade to startup
GET    /api/users/startups/              List all startups
GET    /api/users/startups/{id}/         Get startup details
GET    /api/users/startups/my_startup/   Get current user's startup
GET    /api/users/startups/stats/        Get platform statistics
```

### Campaigns

```
GET    /api/campaigns/                   List campaigns (paginated)
POST   /api/campaigns/                   Create campaign
GET    /api/campaigns/{id}/              Get campaign details
PUT    /api/campaigns/{id}/              Update campaign
PATCH  /api/campaigns/{id}/              Partial update
DELETE /api/campaigns/{id}/              Cancel campaign
GET    /api/campaigns/trending/          Get trending campaigns
GET    /api/campaigns/popular/           Get most funded campaigns
GET    /api/campaigns/my_campaigns/      Get user's campaigns
```

Query params for campaigns:
- `status`: Filter by status (active, completed, etc.)
- `startup_id`: Filter by startup

### Wallet & Donations

```
GET    /api/wallet/wallets/my_wallet/    Get user's wallet
GET    /api/wallet/transactions/         List transactions
GET    /api/wallet/transactions/my_transactions/  Get user's transactions
POST   /api/wallet/donate/               Make a donation
```

## Authentication

The API uses session-based authentication:

1. Login via `/api/users/login/`
2. Receive session cookie
3. Include credentials in subsequent requests
4. CORS configured for frontend access

## Data Flow

### User Registration
1. User posts to `/api/users/register/`
2. GeneralUser profile created
3. Wallet created for user
4. Auto-login if credentials valid

### Becoming a Startup
1. Authenticated user posts to `/api/users/startup/register/`
2. Startup profile created (linked to GeneralUser)
3. User can now create campaigns

### Campaign Creation
1. Startup user posts to `/api/campaigns/`
2. Campaign linked to their Startup
3. Campaign status set to "active"

### Making a Donation
1. Authenticated user posts to `/api/wallet/donate/`
2. Transaction created and marked complete
3. Campaign amount increased
4. Backer count incremented
5. User's total_donated updated
6. Startup's total_raised updated

## Models Overview

```
User (Django built-in)
├── GeneralUser (1:1)
│   ├── Wallet (1:1)
│   └── Transaction (1:*)
└── Startup (1:1)
    └── Campaign (1:*)
        ├── Transaction (1:*)
        └── Backer tracking
```

## Admin Interface

Access admin panel at: `http://localhost:8000/admin`

Features:
- User management
- Campaign moderation
- Transaction tracking
- Startup verification
- Statistics viewing

## Settings Configuration

Key settings in `config/settings.py`:

```python
# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
```

## Development Tips

### Database Reset
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Migrations
```bash
python manage.py makemigrations              # Create migrations
python manage.py migrate                     # Apply migrations
python manage.py showmigrations              # Show migration status
```

### Django Shell
```bash
python manage.py shell
```

### Create Test Data
```python
from django.contrib.auth.models import User
from users.models import GeneralUser, Startup

# Create user
user = User.objects.create_user('testuser', 'test@example.com', 'password123')

# Create general user
general_user = GeneralUser.objects.create(user=user)

# Create startup
startup = Startup.objects.create(
    user=user,
    general_user=general_user,
    company_name="Test Startup",
    category="tech",
    description="A test startup",
    total_requested=50000
)
```

## Troubleshooting

### Port Already in Use
```bash
python manage.py runserver 8001
```

### CORS Errors
- Ensure frontend URL is in `CORS_ALLOWED_ORIGINS`
- Clear browser cache
- Check browser console for details

### Migration Errors
```bash
python manage.py migrate --fake-initial  # For existing databases
python manage.py makemigrations --merge  # Merge conflicting migrations
```

### Database Locked
```bash
rm db.sqlite3
python manage.py migrate
```

## Performance Optimization

- Pagination enabled (10 items per page)
- Use filtering for campaigns
- Index frequently searched fields
- Consider caching for stats endpoint

## Security

- CSRF protection enabled
- CORS configured for specific origins
- Session authentication for API
- Password validation rules enforced
- User permissions checked on modifications

## Future Enhancements

- Email verification system
- Payment gateway integration
- Campaign updates/comments
- Refund handling
- Advanced analytics
- Two-factor authentication
- API rate limiting
- Webhook support

---

**StartEzz API** - Powering Startup Fundraising 🚀
