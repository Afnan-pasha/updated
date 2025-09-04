import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Assignment,
  Notifications as NotificationsIcon,
  AccountBalance,
  ArrowForward,
  TrendingUp,
  CheckCircle,
  Schedule,
  CurrencyRupee,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import loanService from '../../services/loanService';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const stats = await loanService.getDashboardStats();
      setDashboardStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default stats if API fails
      setDashboardStats({
        totalLoans: 0,
        approvedLoans: 0,
        pendingLoans: 0,
        totalApprovedAmount: 0,
        unreadNotifications: 0
      });
    }
    setLoading(false);
  };

  const menuOptions = [
    {
      title: 'Apply for Loan',
      description: 'Submit a new loan application using our streamlined process',
      icon: <Assignment sx={{ fontSize: 60, color: '#020b43' }} />,
      path: '/customer/apply-loan',
      color: '#020b43',
      bgColor: '#e8f4fd',
    },
    {
      title: 'Notifications',
      description: 'View updates and status changes for your loan applications',
      icon: <NotificationsIcon sx={{ fontSize: 60, color: '#020b43' }} />,
      path: '/customer/notifications',
      color: '#020b43',
      bgColor: '#e8f5e8',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #020b43 0%, #020b43 100%)',
            color: 'white',
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 80,
                height: 80,
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                Welcome, {user?.firstName || user?.name || 'Customer'}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Ready to apply for your loan? Let's get started.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            {/* <AccountBalance sx={{ mr: 2, fontSize: 30 }} /> */}
            {/* <Typography variant="h5">
              Your trusted financial partner
            </Typography> */}
          </Box>
        </Paper>
      </motion.div>

      {/* Dashboard Statistics */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3, 
                  textAlign: 'center', 
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ py: 3 }}>
                  <TrendingUp sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 1 }}>
                    {dashboardStats?.totalLoans || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Total Applications
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3, 
                  textAlign: 'center', 
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ py: 3 }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 1 }}>
                    {dashboardStats?.approvedLoans || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Approved Loans
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3, 
                  textAlign: 'center', 
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ py: 3 }}>
                  <Schedule sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 1 }}>
                    {dashboardStats?.pendingLoans || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Pending Review
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={3} 
                sx={{ 
                  borderRadius: 3, 
                  textAlign: 'center', 
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <CardContent sx={{ py: 3 }}>
                  <CurrencyRupee sx={{ fontSize: 40, color: '#2196f3', mb: 2 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3', mb: 1 }}>
                    ₹{(dashboardStats?.totalApprovedAmount || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Total Approved Amount
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Main Menu Options */}
      <Grid container spacing={4} alignItems="stretch">
        {menuOptions.map((option, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ height: '100%' }}
            >
              <Card
                elevation={6}
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => navigate(option.path)}
              >
                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      backgroundColor: option.bgColor,
                      borderRadius: '50%',
                      width: 120,
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    {option.icon}
                  </Box>
                  
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: option.color,
                    }}
                  >
                    {option.title}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {option.description}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: option.color,
                      fontWeight: 'bold',
                      py: 1.5,
                      px: 4,
                      borderRadius: 3,
                      mt: 'auto',
                      '&:hover': {
                        backgroundColor: option.color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>


    </Container>
  );
};

export default CustomerDashboard;