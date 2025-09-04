@echo off
echo 🚀 Starting Loan Management System...
echo =================================

echo 📋 Starting Backend Server...
start "Backend Server" cmd /k "cd loan-management-backend && mvn spring-boot:run"

echo ⏳ Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo 🎨 Installing Frontend Dependencies...
cd loan-management-system
if not exist node_modules (
    echo Installing npm packages...
    npm install
)

echo 🎨 Starting Frontend Application...
start "Frontend App" cmd /k "npm start"
cd ..

echo.
echo ✅ Applications are starting up!
echo =================================
echo 🌐 Backend API: http://localhost:8080
echo 🎨 Frontend App: http://localhost:3000
echo.
echo 📋 Test the application:
echo 1. Open http://localhost:3000 in your browser
echo 2. Apply for a loan through the UI
echo 3. Check dashboard statistics
echo 4. Upload documents
echo 5. View notifications
echo.
echo 🛑 To stop: Close both command windows
echo =================================

pause
