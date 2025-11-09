@echo off
echo 🚀 MentorTrack AI - Manual Setup (No Docker)
echo ==================================================

echo 📝 Creating .env files...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo ✅ Backend .env created
)
if not exist web-app\.env (
    copy web-app\.env.example web-app\.env
    echo ✅ Web-app .env created
)

echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend npm install failed
    pause
    exit /b 1
)

echo 🐍 Installing AI Service Dependencies...
cd ..\ai-service
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ AI Service pip install failed
    pause
    exit /b 1
)

echo ⚛️ Installing Web App Dependencies...
cd ..\web-app
call npm install
if %errorlevel% neq 0 (
    echo ❌ Web App npm install failed
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 Manual setup completed!
echo ==================================================
echo 📋 Next Steps:
echo.
echo 1. Start MongoDB (port 27017)
echo 2. Start Redis (port 6379) - Optional
echo 3. Run services manually:
echo.
echo    Backend:    cd backend && npm run dev
echo    AI Service: cd ai-service && python src/main.py
echo    Web App:    cd web-app && npm run dev
echo.
echo 🌐 Access URLs:
echo    • Web App: http://localhost:5173
echo    • Backend: http://localhost:5000
echo    • AI Service: http://localhost:8000
echo.
echo 💡 Tip: Open 3 separate terminals to run each service
echo ==================================================
pause