import { API_CONFIG, STORAGE_KEYS } from './constants.js';

/**
 * Base API client with common functionality
 */
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return null;
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  // Build request headers
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Make API request
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.requiresAuth !== false),
      ...options,
    };

    try {
      console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();

      console.log(`📥 API Response:`, { status: response.status, data });

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error:`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, requiresAuth = true) {
    return this.makeRequest(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  // POST request
  async post(endpoint, data, requiresAuth = true) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  // PUT request
  async put(endpoint, data, requiresAuth = true) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  // DELETE request
  async delete(endpoint, requiresAuth = true) {
    return this.makeRequest(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;