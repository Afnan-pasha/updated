import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Chip,
  Button,
  Avatar,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountBalance,
  CheckCircle,
  Schedule,
  Visibility,
  MarkEmailRead,
  Assessment,
  Person,
  Description,
  Error,
  Warning,
  Info,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLoan } from '../../context/LoanContext';
import { motion } from 'framer-motion';
import loanService from '../../services/loanService';

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNotifications, markNotificationRead, getApplications, applications } = useLoan();
  const [notifications, setNotifications] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {
    loadNotifications();
    loadApplications();
    
    // Set up real-time polling for notifications every 10 seconds
    const notificationInterval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(notificationInterval);
  }, []);

  // Auto-mark unread notifications as read when user views them
  const markAllUnreadAsReadOnView = React.useCallback(async (unreadNotifications) => {
    try {
      console.log(`Auto-marking ${unreadNotifications.length} notifications as read after viewing`);
      
      // Mark each unread notification as read in backend
      for (const notification of unreadNotifications) {
        try {
          await loanService.markNotificationAsRead(notification.id);
        } catch (error) {
          console.error(`Error marking notification ${notification.id} as read:`, error);
        }
      }
      
      // Update local state to reflect read status
      setNotifications(prev => 
        prev.map(n => 
          unreadNotifications.some(unread => unread.id === n.id) 
            ? { ...n, read: true } 
            : n
        )
      );
      
      // Refresh global context to update badge count immediately
      await getNotifications();
      
    } catch (error) {
      console.error('Error auto-marking notifications as read:', error);
    }
  }, [getNotifications]);

  // Auto-reduce badge count when user views the notifications tab
  useEffect(() => {
    if (tabValue === 0 && notifications.length > 0) {
      const unreadNotifications = notifications.filter(n => !n.read);
      if (unreadNotifications.length > 0) {
        // Mark notifications as viewed immediately when tab is opened
        markAllUnreadAsReadOnView(unreadNotifications);
      }
    }
  }, [tabValue, notifications, markAllUnreadAsReadOnView]);


  const loadNotifications = async () => {
    try {
      const userNotifications = await loanService.getNotifications();
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  };

  const loadApplications = async () => {
    try {
      // First, clear any duplicate applications from backend
      try {
        await loanService.clearDuplicateApplications();
      } catch (cleanupError) {
        console.warn('Failed to cleanup duplicates:', cleanupError);
      }
      
      // Get from backend API - this is the primary source of truth
      const backendApplications = await loanService.getMyLoans();
      
      // More aggressive deduplication - keep only the latest application per unique criteria
      const applicationMap = new Map();
      
      backendApplications.forEach(app => {
        // Create a unique key based on loan details
        const uniqueKey = `${app.loanType}-${app.loanAmount}-${app.loanTermMonths}`;
        
        // If we haven't seen this combination, or this one is newer, keep it
        if (!applicationMap.has(uniqueKey)) {
          applicationMap.set(uniqueKey, app);
        } else {
          const existing = applicationMap.get(uniqueKey);
          const currentDate = new Date(app.submittedAt || app.createdAt);
          const existingDate = new Date(existing.submittedAt || existing.createdAt);
          
          // Keep the newer application
          if (currentDate > existingDate) {
            applicationMap.set(uniqueKey, app);
          }
        }
      });
      
      // Convert map back to array
      const uniqueApplications = Array.from(applicationMap.values());
      
      console.log(`Loaded ${backendApplications.length} applications, filtered to ${uniqueApplications.length} unique applications`);
      setUserApplications(uniqueApplications);
      
    } catch (error) {
      console.error('Error loading applications from backend:', error);
      // Fallback to empty array to avoid showing stale data
      setUserApplications([]);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case 'error':
        return <Error sx={{ color: '#f44336' }} />;
      case 'warning':
        return <Warning sx={{ color: '#ff9800' }} />;
      default:
        return <Info sx={{ color: '#2196f3' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  const markAllVisibleNotificationsAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length > 0) {
      try {
        // Try bulk mark all as read first
        await loanService.markAllNotificationsAsRead();
        
        // Immediately reload from backend to get real-time updated data
        await loadNotifications();
        
        // Refresh notifications in global context to update badge count
        await getNotifications();
      } catch (error) {
        console.error('Error with bulk mark all as read, trying individual calls:', error);
        
        // Fallback to individual API calls if bulk fails
        for (const notification of unreadNotifications) {
          try {
            await loanService.markNotificationAsRead(notification.id);
          } catch (individualError) {
            console.error('Error marking individual notification as read:', individualError);
          }
        }
        
        // Reload from backend after individual calls
        await loadNotifications();
        
        // Refresh notifications in global context to update badge count
        await getNotifications();
      }
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark individual notification as read if it's unread
    if (!notification.read) {
      try {
        await loanService.markNotificationAsRead(notification.id);
        
        // Update local state to mark this specific notification as read
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
        
        // Refresh global context to update badge count immediately
        await getNotifications();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Navigate to application if applicable
    if (notification.applicationId) {
      navigate('/customer/loan-status');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return '#2196f3';
      case 'maker_approved':
        return '#4caf50';
      case 'maker_rejected':
        return '#f44336';
      case 'final_approved':
        return '#4caf50';
      case 'final_rejected':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'under_maker_review':
        return 'Under Review';
      case 'maker_approved':
        return 'Approved by Officer';
      case 'maker_rejected':
        return 'Rejected by Officer';
      case 'under_checker_review':
        return 'Final Review';
      case 'final_approved':
        return 'Approved';
      case 'final_rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotifications = () => (
    <Box>
      {notifications.length > 0 && unreadCount > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={markAllVisibleNotificationsAsRead}
            sx={{ borderRadius: 2 }}
          >
            Mark All as Read
          </Button>
        </Box>
      )}
      <List>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText
              primary="No notifications"
              secondary="You don't have any notifications yet."
            />
          </ListItem>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItem
                button
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.read ? '#f5f5f5' : '#fff',
                  borderLeft: `4px solid ${getNotificationColor(notification.type)}`,
                  opacity: notification.read ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                  mb: 1,
                  borderRadius: 2,
                }}
              >
                <ListItemIcon>
                  <NotificationsIcon 
                    sx={{ 
                      color: getNotificationColor(notification.type),
                      opacity: notification.read ? 0.5 : 1 
                    }} 
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: notification.read ? 'normal' : 'bold',
                        }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Chip
                          label="New"
                          size="small"
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontSize: '0.75rem',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.createdAt)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </motion.div>
          ))
        )}
      </List>
    </Box>
  );

  const renderApplicationStatus = () => (
    <Grid container spacing={3}>
      {userApplications.length === 0 ? (
        <Grid item xs={12}>
          <Alert severity="info">
            You haven't submitted any loan applications yet.{' '}
            <Button
              color="primary"
              onClick={() => navigate('/customer/apply-loan')}
            >
              Apply Now
            </Button>
          </Alert>
        </Grid>
      ) : (
        userApplications.map((application, index) => (
          <Grid item xs={12} md={6} key={application.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {application.id}
                    </Typography>
                    <Chip
                      label={getStatusLabel(application.status)}
                      sx={{
                        backgroundColor: getStatusColor(application.status),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Loan Type:</strong> {application.loanType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Amount:</strong> ₹{application.loanAmount?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Duration:</strong> {application.loanDuration} years
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    <strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}
                  </Typography>
                  
                  {application.cibilScore && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>CIBIL Score:</strong> {application.cibilScore}
                      </Typography>
                    </Box>
                  )}
                  
                  {application.makerComments && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <strong>Officer Comments:</strong> {application.makerComments}
                    </Alert>
                  )}
                  
                  {application.checkerComments && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <strong>Senior Officer Comments:</strong> {application.checkerComments}
                    </Alert>
                  )}
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Visibility />}
                    onClick={() => navigate('/customer/loan-status')}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))
      )}
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #020b43 0%, #020b43 100%)', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 60, height: 60 }}>
              <NotificationsIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Notifications & Status
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Stay updated with your loan applications
              </Typography>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} unread notifications`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          )}
        </Paper>

        {/* Tabs */}
        <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge badgeContent={unreadCount} color="error" />
                  )}
                </Box>
              }
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance />
                  Application Status
                </Box>
              }
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && renderNotifications()}
            {tabValue === 1 && renderApplicationStatus()}
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<AccountBalance />}
                onClick={() => navigate('/customer/apply-loan')}
                sx={{ py: 1.5 }}
              >
                Apply for New Loan
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Schedule />}
                onClick={() => navigate('/customer/loan-status')}
                sx={{ py: 1.5 }}
              >
                Check Loan Status
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Notifications;