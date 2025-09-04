const API_BASE_URL = 'http://localhost:8080/api';

class LoanService {
  // Apply for loan
  async applyForLoan(loanData) {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanType: loanData.loanType,
          loanAmount: parseFloat(loanData.loanAmount),
          interestRate: parseFloat(loanData.interestRate) || 12.5,
          loanTermMonths: parseInt(loanData.loanTermMonths),
          purpose: loanData.purpose,
          collateral: loanData.collateral || 'None'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to apply for loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Loan application error:', error);
      throw error;
    }
  }

  // Get customer loans
  async getMyLoans() {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/my-loans`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }

      return await response.json();
    } catch (error) {
      console.error('Get loans error:', error);
      throw error;
    }
  }

  // Get loan details by ID
  async getLoanDetails(loanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/${loanId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch loan details');
      }

      return await response.json();
    } catch (error) {
      console.error('Get loan details error:', error);
      throw error;
    }
  }

  // Cancel loan application
  async cancelLoan(loanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/${loanId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Cancel loan error:', error);
      throw error;
    }
  }

  // Calculate EMI
  async calculateEMI(loanAmount, interestRate, loanTermMonths) {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/calculate-emi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanAmount: parseFloat(loanAmount),
          interestRate: parseFloat(interestRate),
          loanTermMonths: parseInt(loanTermMonths)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate EMI');
      }

      return await response.json();
    } catch (error) {
      console.error('EMI calculation error:', error);
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Dashboard stats error:', error);
      throw error;
    }
  }

  // Update loan status (for admin/checker)
  async updateLoanStatus(loanId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/${loanId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update loan status');
      }

      return await response.json();
    } catch (error) {
      console.error('Update loan status error:', error);
      throw error;
    }
  }

  // Delete loan application
  async deleteLoan(loanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/${loanId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete loan error:', error);
      throw error;
    }
  }

  // Clear all duplicate applications (utility method)
  async clearDuplicateApplications() {
    try {
      const response = await fetch(`${API_BASE_URL}/loans/cleanup-duplicates`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cleanup duplicates');
      }

      const result = await response.text();
      console.log('Backend cleanup result:', result);
      return result;
    } catch (error) {
      console.error('Clear duplicates error:', error);
      throw error;
    }
  }

  // Get notifications
  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }

  // ===== REFERENCE API METHODS =====

  // Create a reference for a loan application
  async createReference(loanApplicationId, referenceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/references/loan/${loanApplicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(referenceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create reference');
      }

      return await response.json();
    } catch (error) {
      console.error('Create reference error:', error);
      throw error;
    }
  }

  // Get all references for a loan application
  async getReferences(loanApplicationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/references/loan/${loanApplicationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch references');
      }

      return await response.json();
    } catch (error) {
      console.error('Get references error:', error);
      throw error;
    }
  }

  // Get a specific reference by ID
  async getReferenceById(referenceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/references/${referenceId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reference');
      }

      return await response.json();
    } catch (error) {
      console.error('Get reference error:', error);
      throw error;
    }
  }

  // Update a reference
  async updateReference(referenceId, referenceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/references/${referenceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(referenceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update reference');
      }

      return await response.json();
    } catch (error) {
      console.error('Update reference error:', error);
      throw error;
    }
  }

  // Delete a reference
  async deleteReference(referenceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/references/${referenceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete reference');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete reference error:', error);
      throw error;
    }
  }

  // Get reference count for a loan application
  async getReferenceCount(loanApplicationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/references/loan/${loanApplicationId}/count`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reference count');
      }

      return await response.json();
    } catch (error) {
      console.error('Get reference count error:', error);
      throw error;
    }
  }

  // ===== EXISTING LOAN API METHODS =====

  // Create an existing loan for a loan application
  async createExistingLoan(loanApplicationId, existingLoanData) {
    try {
      const response = await fetch(`${API_BASE_URL}/existing-loans/loan/${loanApplicationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(existingLoanData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create existing loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Create existing loan error:', error);
      throw error;
    }
  }

  // Get all existing loans for a loan application
  async getExistingLoans(loanApplicationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/existing-loans/loan/${loanApplicationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch existing loans');
      }

      return await response.json();
    } catch (error) {
      console.error('Get existing loans error:', error);
      throw error;
    }
  }

  // Get a specific existing loan by ID
  async getExistingLoanById(existingLoanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/existing-loans/${existingLoanId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch existing loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Get existing loan error:', error);
      throw error;
    }
  }

  // Update an existing loan
  async updateExistingLoan(existingLoanId, existingLoanData) {
    try {
      const response = await fetch(`${API_BASE_URL}/existing-loans/${existingLoanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(existingLoanData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update existing loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Update existing loan error:', error);
      throw error;
    }
  }

  // Delete an existing loan
  async deleteExistingLoan(existingLoanId) {
    try {
      const response = await fetch(`${API_BASE_URL}/existing-loans/${existingLoanId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete existing loan');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete existing loan error:', error);
      throw error;
    }
  }

  // Get existing loans summary for a loan application
  async getExistingLoansSummary(loanApplicationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/existing-loans/loan/${loanApplicationId}/summary`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch existing loans summary');
      }

      return await response.json();
    } catch (error) {
      console.error('Get existing loans summary error:', error);
      throw error;
    }
  }
}

export default new LoanService();
