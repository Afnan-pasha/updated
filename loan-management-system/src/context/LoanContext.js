import React, { createContext, useContext, useReducer, useEffect } from 'react';
import loanService from '../services/loanService';

const LoanContext = createContext();

// Initial state
const initialState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  notifications: [],
};

// Action types
const LOAN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Application actions
  CREATE_APPLICATION: 'CREATE_APPLICATION',
  UPDATE_APPLICATION: 'UPDATE_APPLICATION',
  SET_APPLICATIONS: 'SET_APPLICATIONS',
  SET_CURRENT_APPLICATION: 'SET_CURRENT_APPLICATION',
  
  // Status actions
  APPROVE_BY_MAKER: 'APPROVE_BY_MAKER',
  REJECT_BY_MAKER: 'REJECT_BY_MAKER',
  FINAL_APPROVE: 'FINAL_APPROVE',
  FINAL_REJECT: 'FINAL_REJECT',
  
  // Notification actions
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
};

// Application statuses
const APPLICATION_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_MAKER_REVIEW: 'under_maker_review',
  MAKER_APPROVED: 'maker_approved',
  MAKER_REJECTED: 'maker_rejected',
  UNDER_CHECKER_REVIEW: 'under_checker_review',
  FINAL_APPROVED: 'final_approved',
  FINAL_REJECTED: 'final_rejected',
};

// Reducer
const loanReducer = (state, action) => {
  switch (action.type) {
    case LOAN_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case LOAN_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case LOAN_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case LOAN_ACTIONS.CREATE_APPLICATION:
      return {
        ...state,
        applications: [...state.applications, action.payload],
        loading: false,
      };
    case LOAN_ACTIONS.UPDATE_APPLICATION:
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? action.payload : app
        ),
        currentApplication: action.payload,
        loading: false,
      };
    case LOAN_ACTIONS.SET_APPLICATIONS:
      return {
        ...state,
        applications: action.payload,
        loading: false,
      };
    case LOAN_ACTIONS.SET_CURRENT_APPLICATION:
      return {
        ...state,
        currentApplication: action.payload,
        loading: false,
      };
    case LOAN_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case LOAN_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case LOAN_ACTIONS.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    default:
      return state;
  }
};

// Provider component
export const LoanProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  // Load data from backend on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load applications from backend
        const applications = await loanService.getMyLoans();
        dispatch({ type: LOAN_ACTIONS.SET_APPLICATIONS, payload: applications });
        
        // Load notifications from backend
        const notifications = await loanService.getNotifications();
        dispatch({ type: LOAN_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
      } catch (error) {
        console.error('Error loading loan data from backend:', error);
        // Fallback to empty arrays if backend fails
        dispatch({ type: LOAN_ACTIONS.SET_APPLICATIONS, payload: [] });
        dispatch({ type: LOAN_ACTIONS.SET_NOTIFICATIONS, payload: [] });
      }
    };
    
    loadData();
  }, []);

  // Mock CIBIL score generator
  const generateCibilScore = () => {
    return Math.floor(Math.random() * (850 - 300) + 300);
  };

  // Create notification
  const createNotification = (userId, title, message, type = 'info', applicationId = null) => {
    const notification = {
      id: Date.now() + Math.random(),
      userId,
      title,
      message,
      type, // 'info', 'success', 'warning', 'error'
      applicationId,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    dispatch({ type: LOAN_ACTIONS.ADD_NOTIFICATION, payload: notification });
    return notification;
  };

  // Create application
  const createApplication = async (applicationData) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Call backend API to create loan application
      const backendApplication = await loanService.applyForLoan({
        loanType: applicationData.loanType,
        loanAmount: applicationData.loanAmount,
        interestRate: applicationData.interestRate || 12.5,
        loanTermMonths: applicationData.loanDuration,
        purpose: applicationData.loanPurpose,
        collateral: applicationData.collateral || 'None'
      });
      
      // Create frontend application object with backend data
      const application = {
        ...applicationData,
        id: backendApplication.id,
        backendId: backendApplication.id,
        status: APPLICATION_STATUS.SUBMITTED,
        submittedAt: new Date().toISOString(),
        cibilScore: generateCibilScore(),
        monthlyEmi: backendApplication.monthlyEmi,
        totalAmount: backendApplication.totalAmount,
        statusHistory: [
          {
            status: APPLICATION_STATUS.SUBMITTED,
            timestamp: new Date().toISOString(),
            comments: 'Application submitted by customer',
            updatedBy: applicationData.userId,
          }
        ],
        makerComments: '',
        checkerComments: '',
        documents: {
          personal: {
            photograph: applicationData.photograph,
            aadharCard: applicationData.aadharCard,
            panCard: applicationData.panCard,
            passport: applicationData.passport,
            drivingLicense: applicationData.drivingLicense,
            addressProof: applicationData.addressProof,
          },
          employment: {
            paySlips: applicationData.paySlips || [],
            itrDocuments: applicationData.itrDocuments || [],
            bankStatements: applicationData.bankStatements || [],
            employmentProof: applicationData.employmentProof,
            offerLetter: applicationData.offerLetter,
            idCard: applicationData.idCard,
            hrLetter: applicationData.hrLetter,
            businessProof: applicationData.businessProof,
            gstCertificate: applicationData.gstCertificate,
            businessLicense: applicationData.businessLicense,
            businessAddressProof: applicationData.businessAddressProof,
          },
          loan: {
            saleAgreement: applicationData.saleAgreement,
            ecDocument: applicationData.ecDocument,
            vehicleInvoice: applicationData.vehicleInvoice,
            vehicleQuotation: applicationData.vehicleQuotation,
          }
        }
      };
      
      dispatch({ type: LOAN_ACTIONS.CREATE_APPLICATION, payload: application });
      
      // Create notification for customer
      createNotification(
        applicationData.userId,
        'Application Submitted',
        `Your loan application ${application.id} has been submitted successfully and is under review.`,
        'success',
        application.id
      );
      
      // Create notification for makers (all makers will see this)
      createNotification(
        'all_makers',
        'New Application',
        `New loan application ${application.id} submitted by ${applicationData.firstName} ${applicationData.lastName}`,
        'info',
        application.id
      );
      
      return { success: true, application };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Get applications (filtered by user role and ID)
  const getApplications = async (filters = {}) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Fetch from backend API
      const allApps = await loanService.getMyLoans();
      let filteredApplications = [...allApps];
      
      if (filters.userId) {
        filteredApplications = filteredApplications.filter(app => app.userId === filters.userId);
      }
      
      if (filters.status) {
        filteredApplications = filteredApplications.filter(app => app.status === filters.status);
      }
      
      if (filters.role === 'maker') {
        filteredApplications = filteredApplications.filter(app => 
          [APPLICATION_STATUS.SUBMITTED, APPLICATION_STATUS.UNDER_MAKER_REVIEW].includes(app.status)
        );
      }
      
      if (filters.role === 'checker') {
        filteredApplications = filteredApplications.filter(app => 
          [APPLICATION_STATUS.MAKER_APPROVED, APPLICATION_STATUS.UNDER_CHECKER_REVIEW].includes(app.status)
        );
      }
      
      dispatch({ type: LOAN_ACTIONS.SET_APPLICATIONS, payload: allApps });
      return { success: true, applications: filteredApplications };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Get single application
  const getApplication = async (applicationId) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const application = await loanService.getLoanDetails(applicationId);
      
      dispatch({ type: LOAN_ACTIONS.SET_CURRENT_APPLICATION, payload: application });
      return { success: true, application };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Maker approve application
  const approveByMaker = async (applicationId, comments) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const updatedApplication = await loanService.updateLoanStatus(applicationId, 'APPROVED');
      
      dispatch({ type: LOAN_ACTIONS.UPDATE_APPLICATION, payload: updatedApplication });
      
      // Create notifications
      createNotification(
        'customer',
        'Application Approved by Maker',
        `Your loan application ${applicationId} has been approved by the loan officer and forwarded to senior review.`,
        'success',
        applicationId
      );
      
      return { success: true, application: updatedApplication };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Maker reject application
  const rejectByMaker = async (applicationId, comments) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const updatedApplication = await loanService.updateLoanStatus(applicationId, 'REJECTED');
      
      dispatch({ type: LOAN_ACTIONS.UPDATE_APPLICATION, payload: updatedApplication });
      
      // Create notification
      createNotification(
        'customer',
        'Application Rejected',
        `Your loan application ${applicationId} has been rejected by the loan officer. Reason: ${comments}`,
        'error',
        applicationId
      );
      
      return { success: true, application: updatedApplication };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Checker final approve
  const finalApprove = async (applicationId, comments) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const updatedApplication = await loanService.updateLoanStatus(applicationId, 'DISBURSED');
      
      dispatch({ type: LOAN_ACTIONS.UPDATE_APPLICATION, payload: updatedApplication });
      
      // Create notification
      createNotification(
        'customer',
        'Loan Approved!',
        `Congratulations! Your loan application ${applicationId} has been approved. You will receive further instructions shortly.`,
        'success',
        applicationId
      );
      
      return { success: true, application: updatedApplication };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Checker final reject
  const finalReject = async (applicationId, comments) => {
    dispatch({ type: LOAN_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const updatedApplication = await loanService.updateLoanStatus(applicationId, 'REJECTED');
      
      dispatch({ type: LOAN_ACTIONS.UPDATE_APPLICATION, payload: updatedApplication });
      
      // Create notification
      createNotification(
        'customer',
        'Loan Application Rejected',
        `Your loan application ${applicationId} has been rejected after final review. Reason: ${comments}`,
        'error',
        applicationId
      );
      
      return { success: true, application: updatedApplication };
    } catch (error) {
      dispatch({ type: LOAN_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Get notifications for user
  const getNotifications = async (userId, userRole) => {
    try {
      const notifications = await loanService.getNotifications();
      dispatch({ type: LOAN_ACTIONS.SET_NOTIFICATIONS, payload: notifications });
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  // Mark notification as read
  const markNotificationRead = async (notificationId) => {
    try {
      await loanService.markNotificationAsRead(notificationId);
      dispatch({ type: LOAN_ACTIONS.MARK_NOTIFICATION_READ, payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read for a user/role view
  const markAllNotificationsRead = (userId, userRole) => {
    const toMark = getNotifications(userId, userRole).filter(n => !n.read);
    toMark.forEach(n => dispatch({ type: LOAN_ACTIONS.MARK_NOTIFICATION_READ, payload: n.id }));
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: LOAN_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    applications: state.applications,
    currentApplication: state.currentApplication,
    loading: state.loading,
    error: state.error,
    notifications: state.notifications,
    
    // Actions
    createApplication,
    getApplications,
    getApplication,
    approveByMaker,
    rejectByMaker,
    finalApprove,
    finalReject,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearError,
    
    // Constants
    APPLICATION_STATUS,
  };

  return (
    <LoanContext.Provider value={value}>
      {children}
    </LoanContext.Provider>
  );
};

// Hook to use the loan context
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};

export default LoanContext;