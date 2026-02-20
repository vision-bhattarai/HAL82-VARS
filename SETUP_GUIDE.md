# StartEzz - Startup Fundraising Platform

A modern web platform that connects startups seeking funding with backers who want to support innovative ideas and get early access to amazing products.

## 🎯 Features

- **User Authentication**: Secure login and registration system
- **Two User Types**: General users (backers) and Startups (fundraisers)
- **Campaign Management**: Create, view, and manage fundraising campaigns
- **Real-Time Progress**: Track campaign funding progress with progress bars
- **Donation System**: Support campaigns with flexible donation amounts
- **Transaction Tracking**: Complete history of all transactions and donations
- **Responsive Design**: Mobile-friendly design for all devices

## 🏗️ Project Structure

```
HAL82-VARS/
├── backend/               # Django REST API
│   ├── users/            # User management and authentication
│   ├── campaign/         # Campaign management
│   ├── wallet/           # Transactions and donations
│   └── config/           # Django configuration
├── frontend/             # React web application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── public/           # Static files
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- pip or conda

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers pillow
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create a superuser account**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Start the development server**:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

Admin panel: `http://localhost:8000/admin`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 💻 API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/me/` - Get current user info

### Users & Startups
- `POST /api/users/startup/register/` - Upgrade to startup status
- `GET /api/users/startups/` - Get all verified startups
- `GET /api/users/startups/{id}/` - Get startup details
- `GET /api/users/startups/my_startup/` - Get current user's startup
- `GET /api/users/startups/stats/` - Get platform statistics

### Campaigns
- `GET /api/campaigns/` - Get all active campaigns
- `POST /api/campaigns/` - Create new campaign
- `GET /api/campaigns/{id}/` - Get campaign details
- `PUT /api/campaigns/{id}/` - Update campaign
- `DELETE /api/campaigns/{id}/` - Cancel campaign
- `GET /api/campaigns/trending/` - Get trending campaigns
- `GET /api/campaigns/popular/` - Get most funded campaigns
- `GET /api/campaigns/my_campaigns/` - Get user's campaigns

### Wallet & Donations
- `GET /api/wallet/wallets/my_wallet/` - Get user's wallet
- `POST /api/wallet/donate/` - Make a donation
- `GET /api/wallet/transactions/` - Get transaction history
- `GET /api/wallet/transactions/my_transactions/` - Get user's transactions

## 👥 User Types

### General User
- Register with basic information
- Browse and support campaigns
- Donate to projects
- Track donation history
- Upgrade to startup status anytime

### Startup
- Built on top of general user account
- Create and manage campaigns
- Set funding goals
- Track campaign progress
- Receive donations

## 🔄 How It Works

1. **Sign Up**: Create a general user account
2. **Browse Campaigns**: Explore active campaigns on the dashboard
3. **Support Projects**: Donate to campaigns you believe in
4. **Track Progress**: Watch real-time campaign progress
5. **Become a Startup**: Upgrade to startup status
6. **Create Campaign**: Launch your own fundraising campaign
7. **Manage**: Track your campaign's progress and donations

## 📊 Database Models

### User Models
- **GeneralUser**: Profile for all users (funders)
- **Startup**: Extended profile for fundraising

### Campaign Model
- Product details
- Funding goals and current progress
- Campaign status management
- Early access pricing

### Transaction Models
- **Wallet**: User balance management
- **Transaction**: Record of all donations and fund transfers

## 🎨 Frontend Technology Stack

- **React 18**: UI framework
- **React Router v6**: Navigation
- **Axios**: HTTP client
- **CSS3**: Styling (no dependencies)

## 🔐 Security Features

- CORS enabled for secure API communication
- User authentication with session management
- Two-factor user type system
- Verified startup accounts
- Secure password hashing

## 🚧 Future Enhancements

- Email verification
- Payment gateway integration
- Advanced analytics dashboard
- User messaging system
- Campaign rewards tier system
- Social media integration
- Video uploads for campaigns

## 📝 Environment Variables

Create a `.env` file in the backend directory (optional):
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🐛 Troubleshooting

### Port Already in Use
- Backend (8000): `python manage.py runserver 8001`
- Frontend (3000): `PORT=3001 npm start`

### CORS Issues
- Make sure backend is running on port 8000
- Check CORS settings in `backend/config/settings.py`

### Module Not Found
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- For frontend: `npm install`

## 📧 Support

For issues or questions, please reach out to the development team.

## 📄 License

This project is part of the HAL82-VARS initiative for startup fundraising.

---

**StartEzz** - Empowering Startups Through Community Funding 🚀
