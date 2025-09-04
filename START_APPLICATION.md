# 🚀 Loan Management System - Complete Application Startup Guide

## Prerequisites
- Java 17+ installed
- Node.js installed
- PostgreSQL database running
- Maven installed

## Step 1: Start Backend (Spring Boot)

### Option A: Using Maven
```bash
cd loan-management-backend
mvn clean install
mvn spring-boot:run
```

### Option B: Using IDE
1. Open IntelliJ IDEA
2. Open the `loan-management-backend` project
3. Run `LoanManagementBackendApplication.java`

### Backend will start on: http://localhost:8080

## Step 2: Start Frontend (React)

```bash
cd loan-management-system
npm install
npm start
```

### Frontend will start on: http://localhost:3000

## Step 3: Test the Application

### Backend API Endpoints (Test with Postman):
- `GET http://localhost:8080/api/dashboard` - Dashboard stats
- `POST http://localhost:8080/api/loans/apply` - Apply for loan
- `GET http://localhost:8080/api/loans/my-loans` - Get all loans
- `PUT http://localhost:8080/api/loans/{id}/status` - Update loan status
- `DELETE http://localhost:8080/api/loans/{id}` - Delete loan
- `GET http://localhost:8080/api/notifications` - Get notifications
- `POST http://localhost:8080/api/documents/upload/{loanId}` - Upload documents

### Frontend Features:
- Apply for loans
- View loan status
- Dashboard with statistics
- Document upload
- Notifications
- Admin/Checker loan management

## Database Configuration
Make sure PostgreSQL is running and update `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/loan_management
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Troubleshooting
1. **Backend won't start**: Check Java version and PostgreSQL connection
2. **Frontend API errors**: Ensure backend is running on port 8080
3. **CORS issues**: Backend is configured to allow all origins
4. **Database errors**: Check PostgreSQL service and credentials

## Complete Workflow Test:
1. Open http://localhost:3000
2. Apply for a loan
3. Check dashboard statistics
4. Upload documents
5. View notifications
6. Test admin features (loan approval/rejection)

The application is now fully connected and ready to use!
