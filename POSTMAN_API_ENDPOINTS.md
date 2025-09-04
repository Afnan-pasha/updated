# 🚀 Loan Management System - API Endpoints for Postman Testing

**Base URL**: `http://localhost:8080/api`

## 📋 Loan Application Endpoints

### 1. Apply for Loan
**POST** `/loans/apply`
```json
{
  "loanType": "PERSONAL",
  "loanAmount": 500000,
  "interestRate": 12.5,
  "loanTermMonths": 36,
  "purpose": "Home renovation",
  "collateral": "None"
}
```

### 2. Get My Loans
**GET** `/loans/my-loans`

### 3. Get Loan Details
**GET** `/loans/{loanId}`
- Example: `/loans/1`

### 4. Update Loan Status
**PUT** `/loans/{loanId}/status`
```json
{
  "status": "APPROVED"
}
```
**Status Options**: `PENDING`, `APPROVED`, `REJECTED`, `DISBURSED`

### 5. Cancel Loan Application
**POST** `/loans/{loanId}/cancel`

### 6. Delete Loan Application
**DELETE** `/loans/{loanId}`

### 7. Calculate EMI
**POST** `/loans/calculate-emi`
```json
{
  "loanAmount": 500000,
  "interestRate": 12.5,
  "loanTermMonths": 36
}
```

## 📊 Dashboard Endpoints

### 8. Get Dashboard Statistics
**GET** `/dashboard`

## 🔔 Notification Endpoints

### 9. Get All Notifications
**GET** `/notifications`

### 10. Mark Notification as Read
**PUT** `/notifications/{notificationId}/read`
- Example: `/notifications/1/read`
- No request body required

## 📄 Document Endpoints

### 11. Upload Document
**POST** `/documents/upload/{loanApplicationId}`
- Content-Type: `multipart/form-data`
- Form Data:
  - `file`: [Select file]
  - `documentType`: `ID_PROOF` | `ADDRESS_PROOF` | `INCOME_PROOF` | `EMPLOYMENT_PROOF` | `BANK_STATEMENT`

### 12. Get Documents for Loan
**GET** `/documents/loan/{loanApplicationId}`

### 13. Delete Document
**DELETE** `/documents/{documentId}`

### 14. Get Document Types
**GET** `/documents/types`

## 🧪 Sample Test Scenarios

### Scenario 1: Complete Loan Application Flow
1. **Apply for Loan** → POST `/loans/apply`
2. **Check Application** → GET `/loans/my-loans`
3. **Upload Documents** → POST `/documents/upload/{loanId}`
4. **Update Status** → PUT `/loans/{loanId}/status`
5. **Check Notifications** → GET `/notifications`

### Scenario 2: Dashboard and Statistics
1. **Get Dashboard Stats** → GET `/dashboard`
2. **Calculate EMI** → POST `/loans/calculate-emi`

### Scenario 3: Document Management
1. **Upload ID Proof** → POST `/documents/upload/{loanId}`
2. **Upload Bank Statement** → POST `/documents/upload/{loanId}`
3. **Get All Documents** → GET `/documents/loan/{loanId}`
4. **Delete Document** → DELETE `/documents/{documentId}`

## 📝 Sample Request Bodies

### Personal Loan Application
```json
{
  "loanType": "PERSONAL",
  "loanAmount": 300000,
  "interestRate": 14.0,
  "loanTermMonths": 24,
  "purpose": "Medical expenses",
  "collateral": "None"
}
```

### Home Loan Application
```json
{
  "loanType": "HOME",
  "loanAmount": 2500000,
  "interestRate": 8.5,
  "loanTermMonths": 240,
  "purpose": "Property purchase",
  "collateral": "Property"
}
```

### Car Loan Application
```json
{
  "loanType": "CAR",
  "loanAmount": 800000,
  "interestRate": 10.5,
  "loanTermMonths": 60,
  "purpose": "Vehicle purchase",
  "collateral": "Vehicle"
}
```

## 🔧 Testing Tips

1. **Start Backend**: Ensure Spring Boot is running on port 8080
2. **Test Order**: Follow the scenarios in sequence
3. **Check Logs**: Monitor backend console for database operations
4. **Database**: Verify data persistence in PostgreSQL
5. **Error Handling**: Test with invalid data to see error responses

## 📊 Expected Response Formats

### Successful Loan Application Response
```json
{
  "id": 1,
  "loanType": "PERSONAL",
  "loanAmount": 500000,
  "monthlyEmi": 16607.89,
  "totalAmount": 597884.04,
  "status": "PENDING",
  "applicationDate": "2025-01-03T15:30:00Z"
}
```

### Dashboard Statistics Response
```json
{
  "totalLoans": 15,
  "approvedLoans": 8,
  "pendingLoans": 5,
  "rejectedLoans": 2,
  "totalApprovedAmount": 12500000,
  "averageLoanAmount": 625000
}
```

### Notification Response
```json
[
  {
    "id": 1,
    "title": "Loan Approved",
    "message": "Your loan application has been approved",
    "type": "LOAN_APPROVAL",
    "read": false,
    "createdAt": "2025-01-03T15:30:00Z"
  }
]
```

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid loan amount",
  "message": "Loan amount must be greater than 0"
}
```

### 404 Not Found
```json
{
  "error": "Loan not found",
  "message": "Loan with ID 999 does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed",
  "message": "Unable to process request"
}
```
