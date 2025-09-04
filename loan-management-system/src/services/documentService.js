const API_BASE_URL = 'http://localhost:8080/api';

class DocumentService {
  // Upload document for loan application
  async uploadDocument(loanApplicationId, file, documentType) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch(`${API_BASE_URL}/documents/upload/${loanApplicationId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload document');
      }

      return await response.json();
    } catch (error) {
      console.error('Document upload error:', error);
      throw error;
    }
  }

  // Get documents for loan application
  async getDocuments(loanApplicationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/loan/${loanApplicationId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  // Delete document
  async deleteDocument(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      return await response.json();
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  // Get document types
  async getDocumentTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/types`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch document types');
      }

      return await response.json();
    } catch (error) {
      console.error('Get document types error:', error);
      throw error;
    }
  }

  // Upload multiple documents
  async uploadMultipleDocuments(loanApplicationId, documents) {
    const uploadPromises = documents.map(({ file, documentType }) =>
      this.uploadDocument(loanApplicationId, file, documentType)
    );

    try {
      const results = await Promise.allSettled(uploadPromises);
      
      const successful = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
        
      const failed = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason);

      return {
        successful,
        failed,
        totalUploaded: successful.length,
        totalFailed: failed.length
      };
    } catch (error) {
      console.error('Multiple document upload error:', error);
      throw error;
    }
  }
}

export default new DocumentService();
