@echo off
REM StartEzz Quick Start Script for Windows

echo.
echo 🚀 StartEzz - Startup Fundraising Platform
echo ==========================================
echo.

REM Backend Setup
echo 📦 Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt
echo ✅ Backend dependencies installed

echo.
echo 🗄️  Running migrations...
python manage.py makemigrations
python manage.py migrate
echo ✅ Database migrations completed

echo.
echo 👤 Creating superuser account...
echo Please enter superuser credentials:
python manage.py createsuperuser

echo.
echo 📝 Backend setup complete!
echo Start backend with: python manage.py runserver
echo.

REM Frontend Setup
echo ⚛️  Setting up Frontend...
cd ..\frontend

echo Installing frontend dependencies...
call npm install
echo ✅ Frontend dependencies installed

echo.
echo 🎉 Setup Complete!
echo.
echo To start the application:
echo.
echo Backend (Terminal 1):
echo   cd backend
echo   venv\Scripts\activate.bat
echo   python manage.py runserver
echo.
echo Frontend (Terminal 2):
echo   cd frontend
echo   npm start
echo.
echo Access the app at: http://localhost:3000
echo Admin panel: http://localhost:8000/admin
echo.

pause
