@echo off
echo 🚀 Setting up MentorTrack AI System...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating directories...
if not exist logs mkdir logs
if not exist ai-service\data\models mkdir ai-service\data\models
if not exist ai-service\data\training mkdir ai-service\data\training
if not exist uploads mkdir uploads

REM Copy environment file
if not exist .env (
    echo 📝 Creating environment file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your configuration before running the application
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install web app dependencies
echo 🌐 Installing web app dependencies...
cd web-app
call npm install
cd ..

REM Build Docker images
echo 🐳 Building Docker images...
docker-compose build

echo ✅ Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit .env file with your configuration
echo 2. Run 'docker-compose up -d' to start the application
echo 3. Access the web app at http://localhost:3000
echo 4. Access the API at http://localhost:5000
echo 5. Access the AI service at http://localhost:8000
echo.
echo For development:
echo - Backend: cd backend ^&^& npm run dev
echo - AI Service: cd ai-service ^&^& python src/main.py
echo - Web App: cd web-app ^&^& npm run dev

pause