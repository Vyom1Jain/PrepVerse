/**
 * API Client
 * TODO: Configure API endpoints and request handlers
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * TODO: Create axios instance with base configuration
 */
const apiClient = {
  get: async (endpoint) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  
  post: async (endpoint, data) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};

export default apiClient;
