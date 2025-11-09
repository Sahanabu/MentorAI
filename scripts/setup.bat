@echo off
echo 🚀 Setting up MentorTrack AI - Academic Mentoring ^& Performance Tracking Platform
echo ==================================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist logs mkdir logs
if not exist uploads mkdir uploads
if not exist nginx\ssl mkdir nginx\ssl

REM Build and start services
echo 🐳 Building and starting Docker containers...
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Seed the database
echo 🌱 Seeding database with sample data...
docker-compose exec -T backend npm run seed

REM Display service status
echo.
echo 🎉 MentorTrack AI setup completed successfully!
echo ==================================================================
echo 📊 Service URLs:
echo    • Web Application: http://localhost:3000
echo    • Backend API: http://localhost:5000
echo    • AI Service: http://localhost:8000
echo    • MongoDB: mongodb://localhost:27017
echo    • Redis: redis://localhost:6379
echo.
echo 👥 Default Login Credentials:
echo    • HOD (CS): hod.cs@college.edu / password123
echo    • Mentor: mentor1@college.edu / password123
echo    • Teacher: teacher1@college.edu / password123
echo    • Student: student1@college.edu / password123
echo.
echo 🔧 Useful Commands:
echo    • View logs: docker-compose logs -f [service-name]
echo    • Stop services: docker-compose down
echo    • Restart services: docker-compose restart
echo    • Seed database: docker-compose exec backend npm run seed
echo.
echo 📚 Documentation: Check the docs/ folder for detailed guides
echo ==================================================================
pause