import apiClient from '../lib/api.js';
import { API_CONFIG, STORAGE_KEYS } from '../lib/constants.js';

/**
 * Authentication Service
 * Handles login, signup, and user authentication state
 */
class AuthService {
  
  /**
   * Login user with phone number and password
   */
  async login(phoneNumber, password) {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.LOGIN,
        {
          phoneNumber,
          password,
        },
        false // Don't require auth for login
      );

      if (response.success && response.token) {
        // Store auth token and user data
        apiClient.setAuthToken(response.token);
        this.setUserData(response.user);
        
        console.log('✅ Login successful:', response.user?.name);
        return {
          success: true,
          user: response.user,
          message: 'Login successful'
        };
      }

      return {
        success: false,
        message: response.message || 'Login failed'
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: error.message || 'Login failed'
      };
    }
  }

  /**
   * Register new user
   */
  async signup(userData) {
    try {
      // Transform interests array to match backend expectation
      const signupData = {
        nfcId: userData.nfcId || `nfc_${Date.now()}`, // Generate NFC ID if not provided
        phoneNumber: userData.phone,
        password: userData.password,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        images: userData.photos || [],
        interests: userData.interests || [],
        bio: userData.bio,
        prompts: userData.prompts || [],
      };

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.SIGNUP,
        signupData,
        false // Don't require auth for signup
      );

      if (response.success && response.token) {
        // Store auth token and user data
        apiClient.setAuthToken(response.token);
        this.setUserData(response.user);
        
        console.log('✅ Signup successful:', response.user?.name);
        return {
          success: true,
          user: response.user,
          message: 'Account created successfully'
        };
      }

      return {
        success: false,
        message: response.message || 'Signup failed'
      };
    } catch (error) {
      console.error('❌ Signup error:', error);
      return {
        success: false,
        message: error.message || 'Signup failed'
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    try {
      apiClient.removeAuthToken();
      console.log('✅ Logout successful');
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return {
        success: false,
        message: 'Logout failed'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!apiClient.getAuthToken();
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Set user data in localStorage
   */
  setUserData(userData) {
    if (typeof window !== 'undefined' && userData) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
  }

  /**
   * Get auth token
   */
  getToken() {
    return apiClient.getAuthToken();
  }

  /**
   * Validate token by making a test request
   */
  async validateToken() {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }

      // Make a simple authenticated request to validate token
      await apiClient.get(API_CONFIG.ENDPOINTS.GET_FEED);
      return true;
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      // Remove invalid token
      this.logout();
      return false;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
