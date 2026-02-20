#!/bin/bash
# StartEzz Quick Start Script

echo "🚀 StartEzz - Startup Fundraising Platform"
echo "=========================================="
echo ""

# Get OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    OS="windows"
else
    OS="unix"
fi

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

if [ "$OS" = "windows" ]; then
    python -m venv venv
    call venv\Scripts\activate.bat
else
    python3 -m venv venv
    source venv/bin/activate
fi

pip install -r requirements.txt
echo "✅ Backend dependencies installed"

echo "🗄️  Running migrations..."
python manage.py makemigrations
python manage.py migrate
echo "✅ Database migrations completed"

echo ""
echo "👤 Creating superuser account..."
echo "Please enter superuser credentials:"
python manage.py createsuperuser

echo ""
echo "📝 Backend setup complete!"
echo "Start backend with: python manage.py runserver"
echo ""

# Frontend Setup
echo "⚛️  Setting up Frontend..."
cd ../frontend

if command -v npm &> /dev/null; then
    npm install
    echo "✅ Frontend dependencies installed"
else
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "Backend:"
echo "  cd backend"
if [ "$OS" = "windows" ]; then
    echo "  venv\Scripts\activate.bat"
else
    echo "  source venv/bin/activate"
fi
echo "  python manage.py runserver"
echo ""
echo "Frontend (new terminal):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Access the app at: http://localhost:3000"
echo "Admin panel: http://localhost:8000/admin"
echo ""
