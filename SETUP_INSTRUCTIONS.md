# Loan Management System - Setup Instructions

## Prerequisites
1. **PostgreSQL Database**
   - Install PostgreSQL 12+ on your system
   - Create database: `loan_management_db`
   - Default credentials: username=`postgres`, password=`password`
   - Port: `5432`

2. **Java Development Kit**
   - Java 17 or higher
   - Maven 3.6+

3. **Node.js**
   - Node.js 16+ and npm

## Database Setup

### Option 1: Using pgAdmin or psql
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE loan_management_db;

-- The application will auto-create tables using Hibernate
```

### Option 2: Use provided SQL script
```bash
# Navigate to backend directory
cd loan-management-backend

# Execute the database setup script
psql -U postgres -d postgres -f DATABASE_SETUP.sql
```

## Running the Application

### Method 1: Using IntelliJ IDEA (Recommended)

#### Backend:
1. Open IntelliJ IDEA
2. Open the `loan-management-backend` folder as a project
3. Wait for Maven dependencies to download
4. Ensure PostgreSQL is running
5. Right-click on `LoanManagementBackendApplication.java` → Run
6. Backend will start on `http://localhost:8080`

#### Frontend:
1. Open terminal in `loan-management-system` directory
2. Install dependencies: `npm install`
3. Start the application: `npm start`
4. Frontend will start on `http://localhost:3000`

### Method 2: Using Command Line

#### Backend:
```bash
cd loan-management-backend
mvn clean install
mvn spring-boot:run
```

#### Frontend:
```bash
cd loan-management-system
npm install
npm start
```

### Method 3: Using Provided Scripts
```bash
# From the root directory
./start-app.bat    # Windows
./start-app.ps1    # PowerShell
```

## Verification

1. **Backend Health Check:**
   - Visit: `http://localhost:8080/api/health` (if health endpoint exists)
   - Check console logs for successful startup

2. **Frontend Access:**
   - Visit: `http://localhost:3000`
   - You should see the loan management system homepage

3. **Database Connection:**
   - Check backend logs for successful database connection
   - Tables should be auto-created by Hibernate

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Loans
- POST `/api/loans/apply` - Apply for loan
- GET `/api/loans/my-loans` - Get user's loans
- POST `/api/loans/calculate-emi` - Calculate EMI

### Dashboard
- GET `/api/dashboard` - Get dashboard statistics

### Notifications
- GET `/api/notifications` - Get notifications
- PUT `/api/notifications/{id}/read` - Mark as read

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check database credentials in `application.properties`
3. Verify database `loan_management_db` exists

### Port Conflicts
- Backend (8080): Change `server.port` in `application.properties`
- Frontend (3000): Use `npm start -- --port 3001`

### CORS Issues
- Ensure `cors.allowed-origins=http://localhost:3000` in `application.properties`
- Update if frontend runs on different port

## Default Test Credentials
- Email: `john.doe@example.com`
- Password: (will be created during registration)

## Project Structure
```
final-app/
├── loan-management-backend/     # Spring Boot API
├── loan-management-system/      # React Frontend
├── start-app.bat               # Windows startup script
├── start-app.ps1               # PowerShell startup script
└── SETUP_INSTRUCTIONS.md       # This file
```
