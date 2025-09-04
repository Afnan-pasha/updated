# Loan Management System - Complete Application Startup Script
# This script starts both backend and frontend applications

Write-Host "🚀 Starting Loan Management System..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

# Check if required tools are installed
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found. Please install Java 17+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check Maven
try {
    $mvnVersion = mvn --version | Select-String "Apache Maven"
    Write-Host "✅ Maven: $mvnVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven not found. Please install Maven" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Starting applications..." -ForegroundColor Yellow

# Start Backend (Spring Boot)
Write-Host "🌐 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'loan-management-backend'; Write-Host '🚀 Starting Spring Boot Backend...' -ForegroundColor Green; mvn spring-boot:run"

# Wait a bit for backend to start
Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Frontend (React)
Write-Host "🎨 Starting Frontend Application..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'loan-management-system'; Write-Host '🚀 Starting React Frontend...' -ForegroundColor Green; npm start"

Write-Host "`n✅ Applications are starting up!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "🌐 Backend API: http://localhost:8080" -ForegroundColor Yellow
Write-Host "🎨 Frontend App: http://localhost:3000" -ForegroundColor Yellow
Write-Host "📚 API Documentation: http://localhost:8080/swagger-ui.html" -ForegroundColor Yellow
Write-Host "`n📋 Test the application:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Apply for a loan through the UI" -ForegroundColor White
Write-Host "3. Check dashboard statistics" -ForegroundColor White
Write-Host "4. Upload documents" -ForegroundColor White
Write-Host "5. View notifications" -ForegroundColor White
Write-Host "`n🛑 To stop: Close both PowerShell windows" -ForegroundColor Red
Write-Host "=================================" -ForegroundColor Cyan

# Keep this window open
Write-Host "`nPress any key to exit this startup script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
