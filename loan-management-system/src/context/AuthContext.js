import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userData && token) {
          const user = JSON.parse(userData);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: user,
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Mock user data based on credentials
      const mockUsers = {
        'customer@example.com': {
          id: 1,
          email: 'customer@example.com',
          firstName: 'Agastya',
          lastName: ' ',
          name: 'Agastya ',
          role: 'customer',
          phone: '+91 9876543210',
        },
        'maker@example.com': {
          id: 2,
          email: 'maker@example.com',
          firstName: 'Naresh',
          lastName: ' ',
          name: 'Naresh ',
          role: 'maker',
          phone: '+91 9876543211',
        },
        'checker@example.com': {
          id: 3,
          email: 'checker@example.com',
          firstName: 'Kairav',
          lastName: ' ',
          name: 'Kairav ',
          role: 'checker',
          phone: '+91 9876543212',
        },
        // Additional test users
        'customer@test.com': {
          id: 4,
          email: 'customer@test.com',
          firstName: 'Agastya',
          lastName: ' ',
          name: 'Agastya ',
          role: 'customer',
          phone: '+91 9876543213',
        },
        'maker@test.com': {
          id: 5,
          email: 'maker@test.com',
          firstName: 'Naresh',
          lastName: ' ',
          name: 'Naresh ',
          role: 'maker',
          phone: '+91 9876543214',
        },
        'checker@test.com': {
          id: 6,
          email: 'checker@test.com',
          firstName: 'Kairav',
          lastName: ' ',
          name: 'Kairav ',
          role: 'checker',
          phone: '+91 9876543215',
        },
      };

      const user = mockUsers[credentials.email];
      
      console.log('Login attempt:', credentials.email, credentials.password, 'Selected role:', credentials.selectedRole);
      console.log('Found user:', user);
      
      // Validate credentials exist
      if (!user) {
        throw new Error('User not found');
      }
      
      // Validate password
      if (credentials.password !== 'password123') {
        throw new Error('Invalid password');
      }
      
      // Validate selected role matches user's actual role
      if (credentials.selectedRole && user.role !== credentials.selectedRole) {
        throw new Error(`Access denied. This account is registered as ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}, but you selected ${credentials.selectedRole.charAt(0).toUpperCase() + credentials.selectedRole.slice(1)} role.`);
      }
      
      // If no role selected, use user's actual role (backward compatibility)
      const finalRole = credentials.selectedRole || user.role;
      
      // Additional role-based validation
      const roleBasedUsers = {
        customer: ['customer@example.com', 'customer@test.com'],
        maker: ['maker@example.com', 'maker@test.com'],
        checker: ['checker@example.com', 'checker@test.com']
      };
      
      if (credentials.selectedRole && !roleBasedUsers[credentials.selectedRole].includes(credentials.email)) {
        throw new Error(`No ${credentials.selectedRole} account found with this email address.`);
      }
      
      const token = 'mock-jwt-token-' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: user,
      });
      
      return { success: true, user };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'customer', // Default role for registration
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: newUser,
      });
      
      return { success: true, user: newUser };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    register,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;